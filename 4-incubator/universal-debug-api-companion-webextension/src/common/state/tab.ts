import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import * as OriginState from './origin'
import { UNKNOWN_ORIGIN } from '../consts'

////////////////////////////////////

// tslint:disable-next-line: variable-name
export const SpecSyncStatus = Enum(
	'active-and-up-to-date',
	'changed-needs-reload',
	'inactive',
	'unknown', // happens when we install the extension or reload it in dev
	'unexpected-error',
)
export type SpecSyncStatus = Enum<typeof SpecSyncStatus> // eslint-disable-line no-redeclare


export interface OverrideState {
	key: string
	last_reported: TimestampUTCMs
	last_reported_value_json: string | null
}

export interface State {
	id: number,
	url: string, // for quick equality check
	origin: string,
	last_reported_injection_status: undefined | boolean,
	overrides: { [key: string]: OverrideState }
}

////////////////////////////////////

export function is_injection_enabled(state: Readonly<State>): State['last_reported_injection_status'] {
	return state.last_reported_injection_status
}

export function get_global_switch_status(state: Readonly<State>, origin_state: Readonly<OriginState.State>): SpecSyncStatus {
	if (OriginState.is_injection_requested(origin_state) !== is_injection_enabled(state))
		return SpecSyncStatus['changed-needs-reload']

	if (!origin_state.is_injection_enabled)
		return SpecSyncStatus.inactive

	return SpecSyncStatus['active-and-up-to-date']
}

export function get_override_status(state: Readonly<State>, override_spec: OriginState.OverrideState): SpecSyncStatus {
	const { key } = override_spec
	const override = state.overrides[key]

	if (!override.last_reported)
		return SpecSyncStatus.inactive

	const changed__toggled_off = !override_spec.is_enabled && override.last_reported_value_json
	if (changed__toggled_off)
		return SpecSyncStatus['changed-needs-reload']

	if (override_spec.value_json !== override.last_reported_value_json)
		return SpecSyncStatus['changed-needs-reload']

	return SpecSyncStatus['active-and-up-to-date']
}

export function needs_reload(state: Readonly<State>, origin_state: Readonly<OriginState.State>): boolean {
	if (state.origin === UNKNOWN_ORIGIN) return false

	if (OriginState.is_injection_requested(origin_state) === undefined)
		return false // ext freshly installed = obviously no need to bother the user

	if (get_global_switch_status(state, origin_state) === SpecSyncStatus['changed-needs-reload'])
		return true

	const keys_set = new Set<string>([
			...Object.keys(origin_state.overrides),
			...Object.keys(state.overrides),
		]
	)

	for (let key of keys_set) {
		const override_spec = origin_state.overrides[key]
		if (get_override_status(state, override_spec) === SpecSyncStatus['changed-needs-reload'])
			return true
	}

	return false
}

export function get_sync_status(state: Readonly<State>, origin_state: Readonly<OriginState.State>): SpecSyncStatus {
	if (state.origin === UNKNOWN_ORIGIN) return SpecSyncStatus.inactive

	if (OriginState.is_injection_requested(origin_state) === undefined)
		return SpecSyncStatus.unknown // ext freshly installed = obviously no need to bother the user

	return needs_reload(state, origin_state)
		? SpecSyncStatus["changed-needs-reload"]
		: OriginState.is_injection_requested(origin_state)
			? SpecSyncStatus["active-and-up-to-date"]
			: SpecSyncStatus.inactive
}

////////////////////////////////////

export function create(tab_id: number): Readonly<State> {
	return {
		id: tab_id,
		url: UNKNOWN_ORIGIN,
		origin: UNKNOWN_ORIGIN,
		last_reported_injection_status: undefined,
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

export function update_origin(previous_state: Readonly<State>, url: string, origin_state: Readonly<OriginState.State>): Readonly<State> {
	const { origin } = origin_state

	if (origin === previous_state.origin) return previous_state

	const state = {
		...previous_state,
		url,
		origin,
		overrides: {}, // TODO check if needed
	}

	Object.keys(origin_state.overrides).forEach(key => {
		ensure_override(state, origin_state.overrides[key])
	})

	return state
}

export function report_lib_injection(state: Readonly<State>, is_injected: boolean): Readonly<State> {
	if (state.last_reported_injection_status === is_injected) return state

	return {
		...state,
		last_reported_injection_status: is_injected,
	}
}

export function ensure_override(state: Readonly<State>, override_spec: OriginState.OverrideState): Readonly<State> {
	const { key } = override_spec

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
