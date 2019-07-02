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
	is_enabled: boolean,
	type: OverrideType,
	value: any,
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

export function should_injection_be_enabled(state: Readonly<State>): boolean {
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
		is_injection_enabled: false,
		overrides: {
			'root.logLevel': {
				is_enabled: false,
				type: OverrideType.LogLevel,
				value: 'error',
				last_reported: 123,
			},
			'fooExperiment.cohort': {
				is_enabled: true,
				type: OverrideType.Cohort,
				value: 'not-enrolled',
				last_reported: 123,
			},
			'fooExperiment.logLevel': {
				is_enabled: true,
				type: OverrideType.LogLevel,
				value: 'error',
				last_reported: 123,
			},
			'fooExperiment.isSwitchedOn': {
				is_enabled: true,
				type: OverrideType.boolean,
				value: true,
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
