import { Immutable } from '@offirmo-private/ts-types'

import { get_next, SSRRank } from '../type--SSR-rank'

import { State } from './types'

////////////////////////////////////

export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		quest_count: 0,
		rank: null, // not even registered
	}
}

////////////////////////////////////

export function reduceⵧrank_up(state: Immutable<State>): Immutable<State> {
	const next_rank = state.rank ? get_next(state.rank) : SSRRank.F
	if (next_rank === state.rank)
		return state // already max

	return {
		...state,
		revision: state.revision + 1,

		rank: next_rank,
	}
}

////////////////////////////////////

export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		rank: SSRRank.SSR,
	}
}

////////////////////////////////////
