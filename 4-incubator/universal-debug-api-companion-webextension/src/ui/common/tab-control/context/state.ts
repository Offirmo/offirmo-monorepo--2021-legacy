
import * as OriginState from '../../../../common/state/origin'
import * as TabState from '../../../../common/state/tab'
import { UNKNOWN_ORIGIN } from '../../../../common/consts'

////////////////////////////////////

export interface State {
	tab: TabState.State
	origin: OriginState.State
}

////////////////////////////////////

export function get_origin(state: Readonly<State>): string {
	return state.tab.origin
}

export function should_injection_be_enabled(state: Readonly<State>): boolean {
	return state.origin.is_injection_enabled
}

export function is_injection_enabled(state: Readonly<State>): boolean {
	return state.tab.last_reported_injection_status
}

////////////////////////////////////

// base data for:
// 1) while we haven't received any yet from background
// 2) for testing the UI in standalone mode
export function create(): Readonly<State> {
	return {
		tab: TabState.update_origin(TabState.create(123), UNKNOWN_ORIGIN),
		origin: OriginState.create(UNKNOWN_ORIGIN),
	}
}

////////////////////////////////////
