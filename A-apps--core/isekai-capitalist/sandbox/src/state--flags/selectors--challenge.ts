import { Immutable } from '@offirmo-private/ts-types'

import { State } from './types'



export function has_saved_the_world(state: Immutable<State>): boolean {
	return state.has_saved_the_world
}
export function has_found_their_soulmate(state: Immutable<State>): boolean {
	return state.has_found_their_soulmate
}
export function has_improved_civilization(state: Immutable<State>): boolean {
	return state.has_improved_civilization
}


/*
export function has_unraveled_the_mystery(): boolean { throw new Error('NIMP!')}
export function has_defeated_BBEG(): boolean { throw new Error('NIMP!')}
export function has_found_their_place_in_the_world(): boolean { throw new Error('NIMP!')}
*/
