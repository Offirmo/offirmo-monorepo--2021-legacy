import { Immutable } from '@offirmo-private/ts-types'

import { SharedMemoryType, State } from './types'
import { RelationshipLevel } from '../type--relationship-level'
import { get_emoji_for_memory_type } from './selectors'

////////////////////////////////////

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

////////////////////////////////////

interface MakeMemoryParams {
	type: SharedMemoryType
	emoji?: string
}
export function reduceⵧmake_memory(state: Immutable<State>, options: Immutable<MakeMemoryParams>): Immutable<State> {
	const new_memory_emoji = options.emoji || get_emoji_for_memory_type(options.type)

	return {
		...state,
		revision: state.revision + 1,

		memories: {
			count: state.memories.count + 1,
			recent_pipeline: (new_memory_emoji + state.memories.recent_pipeline).slice(0, 9),
		},
		level: state.level === RelationshipLevel.strangers ? RelationshipLevel.acquaintances : state.level,
	}
}
