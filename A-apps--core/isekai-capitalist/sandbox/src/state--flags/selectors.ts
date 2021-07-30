import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'

import { State, LifeGreatness } from './types'



export function has_saved_the_world(state: Immutable<State>): boolean {
	return state.has_saved_the_world
}

export function get_life_experiences_counts(state: Immutable<State>): [number, number] {
	const max = Enum.keys(LifeGreatness).length
	const current = Enum.keys(LifeGreatness)
		.reduce((count, k) => {
			//console.log({ count, k, v: (state as any)[k] })
			return count + Math.min(1, state.great_life_experiences_count[k])
		}, 0)
	//console.log({state, current, max})
	return [current, max]
}


/*
export function get_fulfillment_ratio(state: Immutable<State['has_lived_to_the_fullest']>): number {
	const max = Object.keys(state).length
	const current = Object.keys(state)
		.reduce((count, k) => {
			//console.log({ count, k, v: (state as any)[k] })
			return count + ((state as any)[k] ? 1 : 0)
		}, 0)
	//console.log({state, current, max})
	return current/max
}
export function has_lived_to_the_fullest(state: Immutable<State>): boolean {
	return get_fulfillment_ratio(state.has_lived_to_the_fullest) >= .8
}

export function has_found_their_soulmate(state: Immutable<State>): boolean {
	return state.has_found_their_soulmate
}
export function has_improved_civilization(state: Immutable<State>): boolean {
	return state.has_improved_civilization
}
*/

/*
export function has_unraveled_the_mystery(): boolean { throw new Error('NIMP!')}
export function has_defeated_BBEG(): boolean { throw new Error('NIMP!')}
export function has_found_their_place_in_the_world(): boolean { throw new Error('NIMP!')}
*/
