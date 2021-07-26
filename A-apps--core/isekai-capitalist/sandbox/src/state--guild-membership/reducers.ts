import { Immutable } from '@offirmo-private/ts-types'

import { State } from './types'
import { SSRRank } from '../type--SSR-rank'


export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		quest_count: 0,
		rank: SSRRank.F,
	}
}


export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		rank: SSRRank.SSR,
	}
}
