import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'

import { State, LifeGreatness } from './types'


export function create(): Immutable<State> {
	const state: State = {
		schema_version: 0,
		revision: 0,

		has_saved_the_world: false,

		great_life_experiences_count: {},
	}

	Enum.keys(LifeGreatness).forEach(k => {
		state.great_life_experiences_count[k] = 0
	})

	return state
}


export interface LifeExperienceParams {
	type: LifeGreatness
}
export function reduceⵧexperience_life_greatness(state: Immutable<State>, params: Immutable<LifeExperienceParams>): Immutable<State> {
	assert(typeof state.great_life_experiences_count[params.type] === 'number', 'reduceⵧexperience_life_greatness() param!')

	return {
		...state,
		revision: state.revision + 1,

		great_life_experiences_count: {
			...state.great_life_experiences_count,
			[params.type]: state.great_life_experiences_count[params.type] + 1,
		},
	}
}


export function reduceⵧsave_the_world(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		has_saved_the_world: true,
	}
}
