import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { Immutable } from '@offirmo-private/ts-types'

import { UNKNOWN_ORIGIN } from '../consts'
import { Report } from '../messages'
import * as OriginState from './origin'
import { is_valid_stringified_json, StringifiedJSON }   from '../utils/stringified-json'

////////////////////////////////////

// tslint:disable-next-line: variable-name
export const SpecSyncStatus = Enum(
	'active-and-up-to-date',
	'changed-needs-reload',
	'inactive',
	'unknown', // happens when we install the extension or reload it during dev
	'unexpected-error',
)
export type SpecSyncStatus = Enum<typeof SpecSyncStatus> // eslint-disable-line no-redeclare

// what was reported the first time this override was used
export interface OverrideState {
	key: string
	last_reported: TimestampUTCMs // -1 = never
	last_reported_value_sjson: undefined | null | StringifiedJSON
}

export interface State {
	id: number,
	url: string, // for quick equality check TODO really needed?
	origin: string,
	last_reported_injection_status: undefined | boolean,
	overrides: { [key: string]: OverrideState }
}

////////////////////////////////////

/*
export function is_sync_status_hinting_at_a_reload(status: SpecSyncStatus): boolean {
	switch(status) {
		case 'active-and-up-to-date':
		case 'inactive':
			return false
		default:
			return true
	}
}
*/

// at last (re)load
export function was_injection_enabled(state: Readonly<State>): State['last_reported_injection_status'] {
	return state.last_reported_injection_status
}

export function get_global_switch_sync_status(state: Readonly<State>, origin_state: Readonly<OriginState.State>): SpecSyncStatus {
	if (OriginState.is_injection_requested(origin_state) !== was_injection_enabled(state))
		return SpecSyncStatus['changed-needs-reload']

	if (!origin_state.is_injection_enabled)
		return SpecSyncStatus.inactive

	return SpecSyncStatus['active-and-up-to-date']
}

export function get_override_sync_status(state: Readonly<State>, override_spec: OriginState.OverrideState): SpecSyncStatus {
	const { key } = override_spec
	const override = state.overrides[key]
	if (!override)
		return SpecSyncStatus['unexpected-error']

	if (!override.last_reported)
		return SpecSyncStatus.inactive

	if (override_spec.is_enabled && override_spec.value_sjson) {
		if (!is_valid_stringified_json(override_spec.value_sjson))
			return SpecSyncStatus['unexpected-error']
	}

	const was_enabled = override.last_reported_value_sjson !== null
	if (override_spec.is_enabled !== was_enabled)
		return SpecSyncStatus['changed-needs-reload']

	if (!override_spec.is_enabled)
		return SpecSyncStatus['active-and-up-to-date'] // we don't care about the value if !enabled

	if (override_spec.value_sjson !== override.last_reported_value_sjson)
		return SpecSyncStatus['changed-needs-reload']

	return SpecSyncStatus['active-and-up-to-date']
}

export function get_sync_status(state: Readonly<State>, origin_state: Readonly<OriginState.State>): SpecSyncStatus {
	if (state.origin === UNKNOWN_ORIGIN) return SpecSyncStatus.inactive

	if (OriginState.is_injection_requested(origin_state) === undefined) {
		// ext freshly installed = we don't know what state is the tab in
		return SpecSyncStatus.unknown
	}

	if (was_injection_enabled(state) === undefined) {
		// means the magic is not activated
		// This happen on extension install / reinstall
		return SpecSyncStatus.unknown
	}

	const global_switch_sync_status = get_global_switch_sync_status(state, origin_state)
	if (global_switch_sync_status !== SpecSyncStatus['active-and-up-to-date'])
		return global_switch_sync_status

	let non_inactive_count = 0
	for (const key of Object.keys(origin_state.overrides)) {
		const override_spec = origin_state.overrides[key]
		const sync_status = get_override_sync_status(state, override_spec)
		if (sync_status !== SpecSyncStatus['active-and-up-to-date'] && sync_status !== SpecSyncStatus.inactive)
			return sync_status
		if (sync_status !== SpecSyncStatus.inactive) non_inactive_count++
	}

	return non_inactive_count || Object.keys(origin_state.overrides).length === 0
		? SpecSyncStatus['active-and-up-to-date']
		: SpecSyncStatus.inactive
}

/*
export function needs_reload(state: Readonly<State>, origin_state: Readonly<OriginState.State>): boolean {
	return is_sync_status_hinting_at_a_reload(get_sync_status(state, origin_state))
}
*/

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

// if a tab gets created, or a navigation happens inside a tab.
// If it's a navigation, the origin may change and the current page state may switch to another origin
// thus we need to clear stuff
export function on_load(state: Readonly<State>): Readonly<State> {
	return {
		...state,
		// a navigation may have happened, invalidate origin
		url: UNKNOWN_ORIGIN,
		origin: UNKNOWN_ORIGIN,
		// same, reset overrides
		overrides: {},
	}
}

export function update_origin(previous_state: Readonly<State>, url: string, origin_state: Readonly<OriginState.State>): Readonly<State> {
	const { origin } = origin_state

	//if (origin === previous_state.origin) return previous_state

	let state = {
		...previous_state,
		url,
		origin,
		overrides: {}, // extra-safety, but we should have had on_load()
	}

	Object.keys(origin_state.overrides).forEach(key => {
		state = ensure_override(state, origin_state.overrides[key])
	})

	return state
}

// the content script reports that it injected the lib
export function report_lib_injection(state: Readonly<State>, is_injected: boolean): Readonly<State> {
	if (state.last_reported_injection_status === is_injected) return state

	return {
		...state,
		last_reported_injection_status: is_injected,
	}
}

export function ensure_override(state: Readonly<State>, override_spec: OriginState.OverrideState): Readonly<State> {
	const { key } = override_spec

	state = {
		...state,
		overrides: {
			...state.overrides,
		},
	}
	state.overrides[key] = state.overrides[key] || {
		key,
		last_reported: -1,
		last_reported_value_sjson: undefined,
	}

	return state
}

export function report_debug_api_usage(state: Readonly<State>, report: Report): Readonly<State> {
	switch (report.type) {
		case 'override': {
			const { key, existing_override_sjson } = report
			assert(!!key, 'T.report_debug_api_usage override key')

			const override: OverrideState = {
				...state.overrides[key],
				key,
				last_reported: get_UTC_timestamp_ms(),
				last_reported_value_sjson: existing_override_sjson,
			}

			state = {
				...state,
				overrides: {
					...state.overrides,
					[key]: override,
				},
			}
			break
		}
		default:
			console.error(`T.report_debug_api_usage() unknown report type "${report.type}"!`)
			break
	}

	return state
}

////////////////////////////////////
