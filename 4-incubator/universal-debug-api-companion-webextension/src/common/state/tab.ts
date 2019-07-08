import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import * as OriginState from './origin'
import { UNKNOWN_ORIGIN } from '../consts'
////////////////////////////////////


// tslint:disable-next-line: variable-name
export const SyncStatus = Enum(
	'active-and-up-to-date',
	'needs-reload',
	'inactive',
)
export type SyncStatus = Enum<typeof SyncStatus> // eslint-disable-line no-redeclare

export interface OverrideState {
	key: string
	last_reported: TimestampUTCMs
	last_reported_value_json: string | null
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
	if (OriginState.is_injection_requested(origin_state) !== is_injection_enabled(state))
		return true

	const keys_set = new Set<string>([
			...Object.keys(origin_state.overrides),
			...Object.keys(state.overrides),
		]
	)

	for (let key of keys_set) {
		const override_spec = origin_state.overrides[key]
		const override = state.overrides[key]

		if (!override_spec.is_enabled && override.last_reported_value_json)
			return true

		if (override_spec.is_enabled && override_spec.value_json !== override.last_reported_value_json)
			return true
	}

	return false
}

export function get_sync_status(state: Readonly<State>, origin_state: Readonly<OriginState.State>): SyncStatus {
	if (needs_reload(state, origin_state))
		return SyncStatus["needs-reload"]

	if (!origin_state.is_injection_enabled)
		return SyncStatus.inactive

	return SyncStatus["active-and-up-to-date"]
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

export function ensure_override(state: Readonly<State>, key: string): Readonly<State> {
	state.overrides[key] = state.overrides[key] || {
		key,
		last_reported: 0,
		last_reported_value_json: null,
	}

	return state
}
export function report_override_values(state: Readonly<State>, TODO: string): Readonly<State> {
	return {
		...state,
		// TODO
	}
}

////////////////////////////////////
