import { Immutable } from '@offirmo-private/ts-types'

import { State } from './types'
import { RelationshipLevel } from '../type--relationship-level'


export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		memories: {
			count: 0,
			recent_pipeline: '',
		},
		level: RelationshipLevel.strangers,
	}
}

////////////////////////////////////

export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		memories: {
			count: 100,
			recent_pipeline: '🍰🍷',
		},
		level: RelationshipLevel.baseⵧ3,
	}
}
