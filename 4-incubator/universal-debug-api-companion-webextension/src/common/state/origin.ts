import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { UNKNOWN_ORIGIN } from '../consts'
import {Report} from "../messages";
import assert from "tiny-invariant";
import * as TabState from "./tab";

////////////////////////////////////
// This state represents the "specification" of the debug API config we want
// 1. actual tab values may be different, pending a reload
// 2. this is a temp copy for UI, the local storage is the real spec

// tslint:disable-next-line: variable-name
export const OverrideType = Enum(
	'LogLevel',
	'Cohort',
	'boolean',
	'string',
	//'URL', ?
	// int ?
	// TODO more
	'any',
)
export type OverrideType = Enum<typeof OverrideType> // eslint-disable-line no-redeclare

export interface OverrideState {
	key: string
	is_enabled: boolean,
	type: OverrideType,
	value_json: string | undefined, // for convenience, we remember the value even when not enabled
	                                // undefined = no value was ever set TODO default compatible with type?
	last_reported: TimestampUTCMs, // for cleaning
}

export interface State {
	origin: string,
	last_visited: TimestampUTCMs, // for cleaning
	last_interacted_with: TimestampUTCMs, // for cleaning
	is_injection_enabled: boolean | undefined, // the user may have enabled it in LS, we can't know...
	overrides: { [key: string]: OverrideState }
}

////////////////////////////////////

export function is_eligible(state: Readonly<State>): boolean {
	return state.origin !== UNKNOWN_ORIGIN && !state.origin.startsWith('chrome://')
}

export function is_injection_requested(state: Readonly<State>): State['is_injection_enabled'] {
	return state.is_injection_enabled
}

export function infer_type_from_key(key: string, value_json: null | string): OverrideType {
	const key_lc = key.toLowerCase()

	if (key_lc.endsWith('.loglevel') || key_lc.endsWith('_ll') || key_lc.endsWith('.ll'))
		return OverrideType.LogLevel

	if (key_lc.endsWith('.cohort') || key_lc.endsWith('_co') || key_lc.endsWith('.co'))
		return OverrideType.Cohort

	if (key_lc.endsWith('.str') || key_lc.endsWith('_str'))
		return OverrideType.string

	let bool_hint_separator: string | undefined
	if (key_lc.startsWith('is'))
		bool_hint_separator = key[2]
	if (key_lc.startsWith('has'))
		bool_hint_separator = key[3]
	if (key_lc.startsWith('should'))
		bool_hint_separator = key[6]
	if (key_lc.startsWith('was'))
		bool_hint_separator = key[3]
	if (key_lc.startsWith('will'))
		bool_hint_separator = key[4]

	if (  bool_hint_separator
		&& (
			   bool_hint_separator === '_'
			|| bool_hint_separator !== bool_hint_separator.toLowerCase()
		))
		return OverrideType.boolean

	if (!value_json)
		return OverrideType.any

	try {
		const value = JSON.parse(value_json)
		if (typeof value === 'boolean')
			return OverrideType.boolean

		if (typeof value === 'string')
			return OverrideType.string

		if (value === 'not-enrolled')
			return OverrideType.Cohort
	}
	catch {
		// ignore
	}

	return OverrideType.any
}

////////////////////////////////////

export function create(origin: string): Readonly<State> {
	return {
		origin,
		last_visited: get_UTC_timestamp_ms(),
		last_interacted_with: 0,
		is_injection_enabled: undefined,
		overrides: {},
	}
}

export const DEMO_REPORTS: Report[] = [
	{
		type: 'override',
		key: 'fooExperiment.cohort',
		default_value_json: '"not-enrolled"',
		existing_override_json: '"variation-1"'
	},
	{
		type: 'override',
		key: 'fooExperiment.isSwitchedOn',
		default_value_json: 'true',
		existing_override_json: 'true', // up to date
	},
	{
		type: 'override',
		key: 'fooExperiment.logLevel',
		default_value_json: '"error"',
		existing_override_json: '"warning"',
	},
	{
		type: 'override',
		key: 'root.logLevel',
		default_value_json: '"error"',
		existing_override_json: null, // not enabled
	}
]
export function create_demo(origin: string): Readonly<State> {
	let state = create(origin)
	state = report_lib_injection(state, true)
	DEMO_REPORTS.forEach(report => state = report_debug_api_usage(state, report))
	//state = TODO override change request
	//fooExperiment.cohort to sth else!
	return state
}

// the content script reports that it injected the lib
export function report_lib_injection(state: Readonly<State>, is_injected: boolean): Readonly<State> {
	if (state.is_injection_enabled === is_injected) return state

	return {
		...state,
		last_visited: get_UTC_timestamp_ms(),
		is_injection_enabled: is_injected,
	}
}

// user toggled it, for current tab
export function toggle_lib_injection(state: Readonly<State>): Readonly<State> {
	return {
		...state,
		is_injection_enabled: !state.is_injection_enabled,
		last_interacted_with: get_UTC_timestamp_ms(),
	}
}

export function report_debug_api_usage(state: Readonly<State>, report: Report): Readonly<State> {
	switch (report.type) {
		case 'override': {
			const { key, default_value_json, existing_override_json } = report
			assert(!!key, 'O.report_debug_api_usage override key')
			let override = {
				...state.overrides[key],
				key,
				is_enabled: !!existing_override_json,
				type: infer_type_from_key(key, default_value_json),
				value_json: existing_override_json || default_value_json,
				last_reported: get_UTC_timestamp_ms(),
			}
			state = {
				...state,
				overrides: {
					...state.overrides,
					[key]: override,
				}
			}
			break
		}
		default:
			console.error(`O.report_debug_api_usage() unknown report type "${report.type}"!`)
			break
	}

	return state
}

////////////////////////////////////
