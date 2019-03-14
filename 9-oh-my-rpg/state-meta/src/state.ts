/////////////////////

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
} from './types'

/////////////////////

function create(): Readonly<State> {
	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		persistence_id: undefined, // so far

		is_web_diversity_supporter: false, // so far
		is_logged_in: false, // so far
		roles: [], // so far
	}
}

/////////////////////

function on_start_session(state: Readonly<State>, is_web_diversity_supporter: boolean): Readonly<State> {
	if (state.is_web_diversity_supporter === is_web_diversity_supporter) return state

	return {
		...state,

		is_web_diversity_supporter,

		revision: state.revision + 1,
	}
}

function on_logged_in_refresh(previous_state: Readonly<State>, is_logged_in: boolean, roles: string[] = []): Readonly<State> {
	let state = previous_state
	let sorted_roles = [...roles].sort()

	if (previous_state.is_logged_in === is_logged_in
		&& previous_state.roles.join(',') === sorted_roles.join(','))
		return state // no change

	state = {
		...state,

		is_logged_in,
		roles,

		revision: state.revision + 1,
	}

	return state
}

/////////////////////

export {
	create,
	
	on_start_session,
	on_logged_in_refresh,
}

/////////////////////
