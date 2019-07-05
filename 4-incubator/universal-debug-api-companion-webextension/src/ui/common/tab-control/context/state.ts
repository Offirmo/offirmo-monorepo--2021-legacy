import { Enum } from 'typescript-string-enums'

import * as OriginState from '../../../../common/state/origin'
import * as TabState from '../../../../common/state/tab'
import { UNKNOWN_ORIGIN } from '../../../../common/consts'

////////////////////////////////////

export interface State {
	tab: TabState.State
	origin: OriginState.State
}

export interface OverrideState extends TabState.OverrideState {
	spec: OriginState.OverrideState
}

// tslint:disable-next-line: variable-name
const OverrideStatus = Enum(
	'active-and-up-to-date',
	'active-but-needs-reload',
	'inactive',
)
type OverrideStatus = Enum<typeof OverrideStatus> // eslint-disable-line no-redeclare


////////////////////////////////////

export function sort_overrides(o1: Readonly<OverrideState>, o2: Readonly<OverrideState>): number {
	if (o1.last_reported && !o2.last_reported)
		return -1
	if (!o1.last_reported && o2.last_reported)
		return 1

	if (o1.key < o2.key)
		return -1
	if (o1.key > o2.key)
		return 1

	return 0
}

export function is_eligible(state: Readonly<State>): boolean {
	return OriginState.is_eligible(state.origin)
}

export function is_injection_requested(state: Readonly<State>): boolean {
	return OriginState.is_injection_requested(state.origin)
}

export function get_origin(state: Readonly<State>): string {
	return state.tab.origin
}

export function get_override_status(state: Readonly<State>, key: string): OverrideStatus {
	// TODO later
	return OverrideStatus.inactive
}

export function needs_reload(state: Readonly<State>): boolean {
	return TabState.needs_reload(state.tab, state.origin)
}

export function get_override(state: Readonly<State>, key: string): Readonly<OverrideState> {
	return {
		spec: state.origin.overrides[key],
		...state.tab.overrides[key],
	}
}
/*
export function get_overrides_spec_map(state: Readonly<State>): Readonly<OriginState.State['overrides']> {
	return state.origin.overrides
}
*/
export function get_overrides_map(state: Readonly<State>): { [k: string]: Readonly<OverrideState> } {
	const keys_set = new Set<string>([
		...Object.keys(state.origin.overrides),
		...Object.keys(state.tab.overrides),
		]
	)

	return Array.from(keys_set.values()).reduce((acc: ReturnType<typeof get_overrides_map>, key: string) => {
			acc[key] = get_override(state, key)
			return acc
		},
		{} as ReturnType<typeof get_overrides_map>
	)
}

export function is_override_enabled(state: Readonly<State>, key: string): boolean {
	return state.origin.overrides[key].is_enabled
}

////////////////////////////////////

// base data for while we haven't received any yet from background
export function create(): Readonly<State> {
	return {
		tab: TabState.create(123),
		origin: OriginState.create(UNKNOWN_ORIGIN),
	}
}

// base data for for testing the UI in standalone mode
export function create_demo(): Readonly<State> {
	const { origin } = window.location
	let tab_state = TabState.update_origin(TabState.create(123), origin)
	const origin_state = OriginState.create_demo(origin)
	Object.keys(origin_state.overrides).forEach(key => {
		tab_state = TabState.ensure_override(tab_state, key)
	})
	return {
		tab: tab_state,
		origin: origin_state,
	}
}

////////////////////////////////////
