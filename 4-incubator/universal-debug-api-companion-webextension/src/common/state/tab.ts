import * as OriginState from './origin'
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

export function is_injection_enabled(state: Readonly<State>): boolean {
	return state.last_reported_injection_status
}

export function needs_reload(state: Readonly<State>, origin_state: Readonly<OriginState.State>): boolean {
	if (OriginState.should_injection_be_enabled(origin_state) !== is_injection_enabled(state))
		return true

	const keys_set = new Set<string>([
			...Object.keys(origin_state.overrides),
			...Object.keys(state.overrides),
		]
	)

	for (let key of keys_set) {
		const override_spec = origin_state.overrides[key]
		const override = state.overrides[key]

		if (!override_spec.is_enabled && override.last_reported_value)
			return true

		if (override_spec.is_enabled && override_spec.value !== override.last_reported_value)
			return true
	}

	return false
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
