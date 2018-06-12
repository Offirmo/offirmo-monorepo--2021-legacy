/////////////////////

import { generate_uuid } from '@oh-my-rpg/definitions'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
} from './types'

/////////////////////

const DEFAULT_NAME = 'anonymous'

///////

function create(): State {
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

function rename(state: State, new_name: string): State {
	if (!new_name)
		throw new Error(`Error while renaming to "${new_name}: invalid value!`)

	state.name = new_name

	return state
}

function set_email(state: State, email: string): State {
	if (!email)
		throw new Error(`Error while setting mail to "${email}: invalid value!`)

	state.email = email

	return state
}

/////////////////////


export {
	State,

	DEFAULT_NAME,
	create,
	rename,
	set_email,
}

/////////////////////
