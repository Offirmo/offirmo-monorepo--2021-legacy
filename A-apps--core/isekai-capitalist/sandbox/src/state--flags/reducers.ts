import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import { LifeGreatPleasures, State } from './types'
import { has_lived_to_the_fullest } from './selectors'


export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		has_saved_the_world: false,
		has_lived_to_the_fullest: {
			made_a_difference: false,
			had_good_food: false,
			has_been_in_great_physical_condition: false,
			had_stimulating_conversations: false,
			enjoyed_a_great_book: false,
			travelled: false,
			became_an_expert_at_sth: false,
			had_intimate_life_partner: false,
			had_children: false,
			has_had_a_happy_home: false,
			ruled_the_known_world: false,
		},
		has_found_their_soulmate: false,
		has_improved_civilization: false,
	}
}


export interface LifeExperienceParams extends Partial<LifeGreatPleasures> {}
export function reduceⵧexperience_life_pleasure(state: Immutable<State>, params: Immutable<LifeExperienceParams>): Immutable<State> {
	assert(Object.keys(params).every(k => typeof (state.has_lived_to_the_fullest as any)[k] === 'boolean'), 'param!')
	return {
		...state,
		revision: state.revision + 1,

		has_lived_to_the_fullest: {
			...state.has_lived_to_the_fullest,
			...params,
		}
	}
}


export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		has_saved_the_world: true,
		has_found_their_soulmate: true,
		has_improved_civilization: true,
		has_lived_to_the_fullest: Object.keys(state.has_lived_to_the_fullest).reduce((acc, k) => {
			;(acc as any)[k] = true
			return acc
		}, {...state.has_lived_to_the_fullest})
	}
}
