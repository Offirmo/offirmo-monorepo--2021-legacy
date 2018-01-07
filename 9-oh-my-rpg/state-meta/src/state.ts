/////////////////////

import { generate_uuid } from '@oh-my-rpg/definitions'
import * as deepFreeze from 'deep-freeze-strict'

import { LIB_ID, SCHEMA_VERSION } from './consts'

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

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 5,

	uuid: 'uu1dgqu3h0FydqWyQ~6cYv3g',
	name: 'Offirmo',
	email: 'offirmo.net@gmail.com',
	allow_telemetry: false,
})

// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS: any = deepFreeze({
	// no schema_version = 0

	uuid: 'uu1dgqu3h0FydqWyQ~6cYv3g',
	name: 'Offirmo',
	email: 'offirmo.net@gmail.com',
	allow_telemetry: false,
})

// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
	to_v1: {
		revision: 5,
	},
})

/////////////////////

export {
	State,

	DEFAULT_NAME,
	create,
	rename,
	set_email,

	DEMO_STATE,
	OLDEST_LEGACY_STATE_FOR_TESTS,
	MIGRATION_HINTS_FOR_TESTS,
}

/////////////////////
