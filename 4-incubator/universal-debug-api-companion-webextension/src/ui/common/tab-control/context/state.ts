
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

////////////////////////////////////

export function is_eligible(state: Readonly<State>): boolean {
	return OriginState.is_eligible(state.origin)
}

export function get_origin(state: Readonly<State>): string {
	return state.tab.origin
}

export function should_injection_be_enabled(state: Readonly<State>): boolean {
	return OriginState.should_injection_be_enabled(state.origin)
}

export function is_injection_enabled(state: Readonly<State>): boolean {
	return state.tab.last_reported_injection_status
}

export function needs_reload(state: Readonly<State>): boolean {
	return TabState.needs_reload(state.tab, state.origin)
}

export function get_overrides_spec(state: Readonly<State>): Readonly<OriginState.State['overrides']> {
	return state.origin.overrides
}

export function get_overrides(state: Readonly<State>): { [k: string]: Readonly<OverrideState> } {
	const keys_set = new Set<string>([
		...Object.keys(state.origin.overrides),
		...Object.keys(state.tab.overrides),
		]
	)

	return Array.from(keys_set.values()).reduce((acc: ReturnType<typeof get_overrides>, key: string) => {
			acc[key] = {
				spec: state.origin.overrides[key],
				...state.tab.overrides[key],
			}
			return acc
		},
		{} as ReturnType<typeof get_overrides>
	)
}



////////////////////////////////////

// base data for:
// 1) while we haven't received any yet from background
// 2) for testing the UI in standalone mode
export function create(): Readonly<State> {
	return {
		tab: TabState.create(123),
		origin: OriginState.create(UNKNOWN_ORIGIN),
	}
}

////////////////////////////////////
