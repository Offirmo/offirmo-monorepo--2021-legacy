import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { UNKNOWN_ORIGIN } from '../consts'

////////////////////////////////////

// tslint:disable-next-line: variable-name
export const OverrideType = Enum(
	'LogLevel',
	'Cohort',
	'boolean',
	'string',
	'URL',
	// TODO more
	'json',
)
export type OverrideType = Enum<typeof OverrideType> // eslint-disable-line no-redeclare

export interface OverrideState {
	key: string
	is_enabled: boolean,
	type: OverrideType,
	value_json: string | null,
	last_reported: TimestampUTCMs, // to clean
}

export interface State {
	origin: string,
	last_interacted: TimestampUTCMs, // to clean old origins
	is_injection_enabled: boolean,
	overrides: { [key: string]: OverrideState }
}

////////////////////////////////////

export function is_eligible(state: Readonly<State>): boolean {
	return state.origin !== UNKNOWN_ORIGIN
}

export function is_injection_requested(state: Readonly<State>): boolean {
	return state.is_injection_enabled
}

////////////////////////////////////

export function create(origin: string): Readonly<State> {
	return {
		origin,
		last_interacted: 0,
		is_injection_enabled: false,
		overrides: {},
	}
}

export function create_demo(origin: string): Readonly<State> {
	return {
		origin,
		last_interacted: 0,
		is_injection_enabled: true,
		overrides: {
			'root.logLevel': {
				key: 'root.logLevel',
				is_enabled: false,
				type: OverrideType.LogLevel,
				value_json: '"error"',
				last_reported: 123,
			},
			'fooExperiment.cohort': {
				key: 'fooExperiment.cohort',
				is_enabled: true,
				type: OverrideType.Cohort,
				value_json: '"not-enrolled"',
				last_reported: 123,
			},
			'fooExperiment.logLevel': {
				key: 'fooExperiment.logLevel',
				is_enabled: true,
				type: OverrideType.LogLevel,
				value_json: '"error"',
				last_reported: 123,
			},
			'fooExperiment.isSwitchedOn': {
				key: 'fooExperiment.isSwitchedOn',
				is_enabled: true,
				type: OverrideType.boolean,
				value_json: 'true',
				last_reported: 123,
			},
		}
	}
}

export function toggle_lib_injection(state: Readonly<State>): Readonly<State> {
	return {
		...state,
		is_injection_enabled: !state.is_injection_enabled,
		last_interacted: get_UTC_timestamp_ms(),
	}
}

export function report_override_values(state: Readonly<State>, TODO: string): Readonly<State> {
	return {
		...state,
		// TODO
	}
}

////////////////////////////////////
