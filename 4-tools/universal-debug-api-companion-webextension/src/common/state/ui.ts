import { Immutable } from '@offirmo-private/ts-types'

import * as OriginState from './origin'
import * as TabState from './tab'
import { UNKNOWN_ORIGIN } from '../consts'
import {SpecSyncStatus} from './tab'

export interface State {
	origin: OriginState.State,
	tab: TabState.State,
}

////////////////////////////////////

// temporary intermediate state for an override
export interface OverrideState extends TabState.OverrideState {
	spec: OriginState.OverrideState
}

////////////////////////////////////

export function compare_overrides(o1: Readonly<OverrideState>, o2: Readonly<OverrideState>): number {
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

export function was_magic_installed(state: Readonly<State>): boolean {
	return typeof TabState.was_injection_enabled(state.tab) === 'boolean'
}

export function should_inject_the_lib(state: Readonly<State>): boolean {
	return !!OriginState.is_injection_requested(state.origin)
}

export function get_origin(state: Readonly<State>): string {
	return state.tab.origin
}

export function get_global_switch_sync_status(state: Readonly<State>): TabState.SpecSyncStatus {
	return TabState.get_global_switch_sync_status(state.tab, state.origin)
}

export function get_override_sync_status(state: Readonly<State>, key: string): TabState.SpecSyncStatus {
	const override_spec = state.origin.overrides[key]
	return TabState.get_override_sync_status(state.tab, override_spec)
}

export function get_sync_status(state: Readonly<State>): SpecSyncStatus {
	return TabState.get_sync_status(state.tab, state.origin)
}

/*
export function needs_reload(state: Readonly<State>): boolean {
	return TabState.needs_reload(state.tab, state.origin)
}
*/

export function get_override(state: Readonly<State>, key: string): Readonly<OverrideState> {
	return {
		spec: state.origin.overrides[key],
		...state.tab.overrides[key],
	}
}

export function get_overrides_map(state: Readonly<State>): { [k: string]: Readonly<OverrideState> } {
	const keys_set = new Set<string>([
		...Object.keys(state.origin.overrides),
		...Object.keys(state.tab.overrides),
	],
	)

	return Array.from(keys_set.values()).reduce((acc: ReturnType<typeof get_overrides_map>, key: string) => {
		acc[key] = get_override(state, key)
		return acc
	},
		{} as ReturnType<typeof get_overrides_map>,
	)
}

////////////////////////////////////
// no reducers: this state is derived from the global state

// base state for while we haven't yet received the real one from background
export function create_loading(): Readonly<State> {
	return {
		tab: TabState.create(-1),
		origin: OriginState.create(UNKNOWN_ORIGIN),
	}
}

// base data for for testing the UI in standalone mode
export function create_demo(): Readonly<State> {
	const { origin } = window.location
	const origin_state = OriginState.create_demo(origin)

	const tab_state_loading = TabState.create(-1)
	const tab_state_not_installed =
		TabState.update_origin(
			TabState.create(123),
			window.location.href,
			origin_state,
		)
	const tab_state_installed =
		TabState.report_lib_injection(
			TabState.update_origin(
				TabState.create(123),
				window.location.href,
				origin_state,
			),
			false, // not in sync!
		)

	let tab_state = tab_state_installed

	console.log(origin_state, tab_state)

	if (tab_state.id >= 0 && Object.keys(origin_state.overrides).length) {
		OriginState.DEMO_REPORTS.forEach(report => tab_state = TabState.report_debug_api_usage(tab_state, report))
	}

	return {
		tab: tab_state,
		origin: origin_state,
	}
}
