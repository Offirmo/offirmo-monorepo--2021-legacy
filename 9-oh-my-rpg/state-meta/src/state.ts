/////////////////////

import { generate_uuid } from '@offirmo/uuid'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
} from './types'

/////////////////////

const DEFAULT_NAME = 'anonymous'

///////

function create(): Readonly<State> {
	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		uuid: generate_uuid(), // ok this breaks functional programming, nevermind
		name: DEFAULT_NAME,
		email: null,
		allow_telemetry: true,
	}
}

/////////////////////

function rename(state: Readonly<State>, name: string): Readonly<State> {
	if (!name)
		throw new Error(`Error while renaming to "${name}: invalid value!`)
	// TODO normalize

	return {
		...state,

		name,

		revision: state.revision + 1,
	}
}

function set_email(state: Readonly<State>, email: string): Readonly<State> {
	if (!email)
		throw new Error(`Error while setting mail to "${email}: invalid value!`)
	// TODO normalize

	return {
		...state,

		email,

		revision: state.revision + 1,
	}}

/////////////////////


export {
	State,

	DEFAULT_NAME,
	create,
	rename,
	set_email,
}

/////////////////////
