import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { Immutable } from '@offirmo-private/ts-types'

import { StringifiedJSON, sjson_parse, sjson_stringify, is_valid_stringified_json } from '../utils/stringified-json'
import { UNKNOWN_ORIGIN } from '../consts'
import { Report } from '../messages'
import assert from 'tiny-invariant'

////////////////////////////////////
// This state represents the "specification" of the debug API config we want
// - NOTE the local storage is the real spec!
//   This is just a temporary copy.
//   Hence some "undefined" = we haven't read the LS yet
// - This is a SPEC so it may not have been applied yet,
//   pending a reload to propagate the changes in the running code

// tslint:disable-next-line: variable-name
export const OverrideType = Enum(
	'LogLevel',
	'Cohort',
	'boolean',
	'any', // any JSON
	// more? int? URL? string?
)
export type OverrideType = Enum<typeof OverrideType> // eslint-disable-line no-redeclare

export interface OverrideState {
	key: string
	type: OverrideType,
	// spec:
	is_enabled: boolean, // does the user wants to override this value?
	default_value_sjson: StringifiedJSON, // useful for display when disabled
	value_sjson: undefined | null | StringifiedJSON, // for convenience, we remember the value even when not enabled
	                                                 // null = no value was ever set (dynamically default to default value)
	                                                 // undefined = pending reading the LS
	// meta:
	last_reported: TimestampUTCMs, // for cleaning over time. TODO
}

export interface State {
	origin: string,
	last_visited: TimestampUTCMs, // for cleaning
	last_interacted_with: TimestampUTCMs, // for cleaning
	is_injection_enabled: boolean | undefined, // undefined = pending reading the LS
	overrides: { [key: string]: OverrideState }
}

////////////////////////////////////

export function is_origin_eligible(origin: string): boolean {
	if (origin === UNKNOWN_ORIGIN)
		return false

	if (origin.startsWith('chrome://'))
		return false

	if (origin.startsWith('chrome-extension://'))
		return false

	if (origin.startsWith('edge://'))
		return false

	if (origin.startsWith('file://'))
		return false // because no access to LS. TODO?

	if (origin === 'null') // Firefox about:...
		return false

	return true
}

export function is_eligible(state: Readonly<State>): boolean {
	return is_origin_eligible(state.origin)
}

export function is_injection_requested(state: Readonly<State>): State['is_injection_enabled'] {
	return state.is_injection_enabled
}

export function infer_override_type_from_key(key: string, value_sjson: null | StringifiedJSON): OverrideType {
	const key_lc = key.toLowerCase()
	//console.log('INF', {key, key_lc})

	const suffix_lc = (() => {
		const dot = key_lc.split('.').slice(-1)[0]
		const un = key_lc.split('_').slice(-1)[0]
		if (!dot)
			return un
		if (!un)
			return dot
		return (un.length < dot.length) ? un : dot
	})()

	if (suffix_lc === 'loglevel' || suffix_lc === 'll')
		return OverrideType.LogLevel

	if (suffix_lc === 'cohort' || suffix_lc === 'co')
		return OverrideType.Cohort

	//console.log('INF no suffix match')

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

	if (bool_hint_separator
		&& (
			bool_hint_separator === '_'
			|| bool_hint_separator !== bool_hint_separator.toLowerCase()
		))
		return OverrideType.boolean

	//console.log('INF no prefix match')

	if (!value_sjson)
		return OverrideType.any

	try {
		const value = sjson_parse(value_sjson)
		//console.log('INF', {value, value_sjson, type: typeof value})

		if (typeof value === 'boolean')
			return OverrideType.boolean

		if (value === 'not-enrolled')
			return OverrideType.Cohort
	} catch {
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
		default_value_sjson: sjson_stringify('not-enrolled'),
		existing_override_sjson: sjson_stringify('variation-1'),
	},
	{
		type: 'override',
		key: 'fooExperiment.isSwitchedOn',
		default_value_sjson: sjson_stringify(true),
		existing_override_sjson: sjson_stringify(true), // up to date
	},
	{
		type: 'override',
		key: 'fooExperiment.logLevel',
		default_value_sjson: sjson_stringify('error'),
		existing_override_sjson: sjson_stringify('warning'),
	},
	{
		type: 'override',
		key: 'root.logLevel',
		default_value_sjson: sjson_stringify('error'),
		existing_override_sjson: null, // not enabled
	},
	{
		type: 'override',
		key: 'some_url',
		default_value_sjson: sjson_stringify('https://www.online-adventur.es/'),
		//existing_override_sjson: null,
		existing_override_sjson: sjson_stringify('https://offirmo-monorepo.netlify.app/'),
		//existing_override_sjson: 'some bad json',
	},
	{
		type: 'override',
		key: 'some_url_undef',
		default_value_sjson: 'undefined',
		existing_override_sjson: null, // not enabled
	},
]
export function create_demo(origin: string): Readonly<State> {
	let state = create(origin)

	state = report_lib_injection(state, true)

	DEMO_REPORTS.forEach(report => state = report_debug_api_usage(state, report))

	state = change_override_spec(state, 'fooExperiment.cohort', {
		value_sjson: sjson_stringify('variation-1'),
		//value_sjson: 'variation-1' // TEST bad JSON
	})

	return state
}

// the content script reports that it injected the lib
export function report_lib_injection(state: Readonly<State>, is_injected: boolean): Readonly<State> {
	return {
		...state,
		last_visited: get_UTC_timestamp_ms(),
		is_injection_enabled: is_injected,
	}
}

export function report_debug_api_usage(state: Readonly<State>, report: Report): Readonly<State> {
	switch (report.type) {
		case 'override': {
			const { key, default_value_sjson, existing_override_sjson } = report
			assert(!!key, 'O.report_debug_api_usage override key')
			assert(is_valid_stringified_json(default_value_sjson), 'O.report_debug_api_usage default value !sjson')
			assert(existing_override_sjson === null || is_valid_stringified_json(existing_override_sjson), 'O.report_debug_api_usage existing value null or string')

			const override: OverrideState = {
				...state.overrides[key],
				key,
				is_enabled: !!existing_override_sjson,
				type: infer_override_type_from_key(key, default_value_sjson),
				default_value_sjson,
				value_sjson: existing_override_sjson,
				last_reported: get_UTC_timestamp_ms(),
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
			console.error(`O.report_debug_api_usage() unknown report type "${report.type}"!`)
			break
	}

	return state
}

// user toggled it, for current tab
export function toggle_lib_injection(state: Readonly<State>): Readonly<State> {
	return {
		...state,
		is_injection_enabled: !state.is_injection_enabled,
		last_interacted_with: get_UTC_timestamp_ms(),
	}
}

// user touched an override
export function change_override_spec(state: Readonly<State>, key: string, partial: Readonly<Partial<OverrideState>>): Readonly<State> {
	const current_override = state.overrides[key]
	const partial2 = {
		...partial,
	}

	// convenience: default value on activation for some fields
	if (  partial.is_enabled === true
		&& !partial.hasOwnProperty('value_sjson')
		&& current_override.value_sjson === null
	) {
		console.log('Smart default value on override activation:', {
			type: current_override.type,
			default_value_sjson: current_override.default_value_sjson,
			current_override,
		})
		switch(current_override.type) {
			case OverrideType.boolean:
				// if toggled on, it's obvious the user wants to change the value = opposite of the default
				partial2.value_sjson = sjson_stringify(!sjson_parse(current_override.default_value_sjson))
				break
			case OverrideType.LogLevel:
				// if toggled on, we usually want more logs
				partial2.value_sjson = sjson_stringify('silly')
				break
			case OverrideType.Cohort:
				// if toggled on, we usually want sth different
				if (current_override.default_value_sjson.startsWith('"variation'))
					partial2.value_sjson = sjson_stringify('not-enrolled')
				else
					partial2.value_sjson = sjson_stringify('variation')
				break
			default:
				if (current_override.key.toLowerCase().endsWith('url'))
					partial2.value_sjson = sjson_stringify('https://localhost:8080')
				break
		}
	}

	return {
		...state,
		overrides: {
			...state.overrides,
			[key]: {
				...state.overrides[key],
				...partial2,
			},
		},
		last_interacted_with: get_UTC_timestamp_ms(),
	}
}

////////////////////////////////////
