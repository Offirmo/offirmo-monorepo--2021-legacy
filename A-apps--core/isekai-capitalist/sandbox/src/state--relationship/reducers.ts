import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import { SharedMemoryType, State } from './types'
import { RelationshipLevel } from '../type--relationship-level/types'
import * as RelationshipLevelLib from '../type--relationship-level'

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
		level: RelationshipLevel.intimateⵧ3,
	}
}

////////////////////////////////////
const MEMORY_PIPELINE_LENGTH = 10

export interface MakeMemoryParams {
	type: SharedMemoryType
	emoji?: string
}
export function reduceⵧmake_memory(state: Immutable<State>, params: Immutable<MakeMemoryParams>): Immutable<State> {
	const new_memory_emoji = params.emoji || get_emoji_for_memory_type(params.type)

	return {
		...state,
		revision: state.revision + 1,

		memories: {
			count: state.memories.count + 1,
			recent_pipeline: Array.from(new_memory_emoji + state.memories.recent_pipeline).slice(0, MEMORY_PIPELINE_LENGTH).join(''), // Arry.from to not cut unicode chars
		},
		// if common memory, no longer strangers
		level: state.level === RelationshipLevel.strangers ? RelationshipLevel.acquaintances : state.level,
	}
}

export function reduceⵧincrease_level(state: Immutable<State>): Immutable<State> {
	const next_level = RelationshipLevelLib.get_next_level(state.level)
	assert(state.level !== next_level, `reduceⵧincrease_level() should not be already max`)

	return {
		...state,
		revision: state.revision + 1,

		level: next_level,
	}
}
