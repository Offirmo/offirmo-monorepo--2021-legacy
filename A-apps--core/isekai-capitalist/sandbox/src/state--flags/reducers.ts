import { Immutable } from '@offirmo-private/ts-types'

import { State } from './types'


export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		has_saved_the_world: false,
		has_found_their_soulmate: false,
		has_improved_civilization: false,
	}
}


export function reduce__todo(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		has_saved_the_world: true,
		has_found_their_soulmate: true,
		has_improved_civilization: true,
	}
}
