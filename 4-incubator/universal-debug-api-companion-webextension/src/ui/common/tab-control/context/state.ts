import { Enum } from 'typescript-string-enums'
import { browser } from "webextension-polyfill-ts"

import * as OriginState from '../../../../common/state/origin'
import * as TabState from '../../../../common/state/tab'
import { UNKNOWN_ORIGIN } from '../../../../common/consts'
import { State } from '../../../../common/state/ui'
export { State }

////////////////////////////////////

export interface OverrideState extends TabState.OverrideState {
	spec: OriginState.OverrideState
}

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

export function get_global_switch_status(state: Readonly<State>): TabState.SpecSyncStatus {
	return TabState.get_global_switch_status(state.tab, state.origin)
}

export function get_override_status(state: Readonly<State>, key: string): TabState.SpecSyncStatus {
	const override_spec = state.origin.overrides[key]
	return TabState.get_override_status(state.tab, override_spec)
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
		tab: TabState.create(-1),
		origin: OriginState.create(UNKNOWN_ORIGIN),
	}
}

// base data for for testing the UI in standalone mode
export function create_demo(): Readonly<State> {
	const { origin } = window.location
	const origin_state = OriginState.create_demo(origin)
	let tab_state =
		TabState.report_lib_injection(
			TabState.update_origin(
				TabState.create(123),
				window.location.href,
				origin_state,
			),
			false,
		)

	// TODO use reducers
	if (origin_state.overrides['fooExperiment.cohort']) {
		tab_state.overrides['fooExperiment.cohort'].last_reported = 12345
		tab_state.overrides['fooExperiment.cohort'].last_reported_value_json = '"variation-1"' // not up to date
	}
	if (origin_state.overrides['fooExperiment.isSwitchedOn']) {
		tab_state.overrides['fooExperiment.isSwitchedOn'].last_reported = 12345
		tab_state.overrides['fooExperiment.isSwitchedOn'].last_reported_value_json = 'true' // up to date
	}
	if (origin_state.overrides['fooExperiment.logLevel']) {
		tab_state.overrides['fooExperiment.logLevel'].last_reported = 12345
		tab_state.overrides['fooExperiment.logLevel'].last_reported_value_json = 'warning'
	}


	return {
		tab: tab_state,
		origin: origin_state,
	}
}

////////////////////////////////////
