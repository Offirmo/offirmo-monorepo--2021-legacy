import { State as OriginState } from './origin'
import { UNKNOWN_ORIGIN } from '../consts'

////////////////////////////////////

export interface OverrideState {
	last_reported_value: string
}

export interface State {
	id: number,
	url: string, // for quick equality check
	origin: string,
	last_reported_injection_status: boolean,
	overrides: { [key: string]: OverrideState }
}

////////////////////////////////////

export function needs_reload(origin_state: OriginState): boolean {
	// TODO
}

////////////////////////////////////

export function create(tab_id: number): Readonly<State> {
	return {
		id: tab_id,
		url: UNKNOWN_ORIGIN,
		origin: UNKNOWN_ORIGIN,
		last_reported_injection_status: false,
		overrides: {},
	}
}

export function on_load(state: Readonly<State>): Readonly<State> {
	return {
		...state,
		url: UNKNOWN_ORIGIN,
		origin: UNKNOWN_ORIGIN,
		overrides: {},
	}
}

export function update_origin(state: Readonly<State>, url: string = UNKNOWN_ORIGIN): Readonly<State> {
	if (url === state.url) return state

	const origin = url === UNKNOWN_ORIGIN
		? UNKNOWN_ORIGIN
		: (new URL(url)).origin

	if (origin === state.origin) return state

	return {
		...state,
		url,
		origin,
		overrides: {}, // TODO check if needed
	}
}

export function report_lib_injection(state: Readonly<State>, is_injected: boolean): Readonly<State> {
	return {
		...state,
		last_reported_injection_status: is_injected,
	}
}

export function report_override_values(state: Readonly<State>, TODO: string): Readonly<State> {
	return {
		...state,
		// TODO
	}
}

////////////////////////////////////
