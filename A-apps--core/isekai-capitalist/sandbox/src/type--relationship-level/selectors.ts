import assert from 'tiny-invariant'
import { Comparator, compare as _compare } from '@offirmo-private/ts-utils'

import { RelationshipLevel } from './types'
import { Quality } from '../type--quality/types'
import { SSRRank } from '../type--SSR-rank'


export function get_corresponding_quality(level: RelationshipLevel): Quality {
	return {
		[RelationshipLevel.strangers]:     Quality.poor,
		[RelationshipLevel.introduced]:    Quality.poor,
		[RelationshipLevel.acquaintances]: Quality.common,
		[RelationshipLevel.friends]:       Quality.common,
		[RelationshipLevel.friendsⵧgood]:  Quality.uncommon,
		[RelationshipLevel.friendsⵧbest]:  Quality.uncommon,
		[RelationshipLevel.dating]:        Quality.rare,
		[RelationshipLevel.intimateⵧ1]:    Quality.rare,
		[RelationshipLevel.intimateⵧ2]:    Quality.epic,
		[RelationshipLevel.intimateⵧ3]:    Quality.legendary,
	}[level]
}


const LEVELS_ORDERED_INC: RelationshipLevel[] = [
	RelationshipLevel.strangers,
	RelationshipLevel.introduced,
	RelationshipLevel.acquaintances,
	RelationshipLevel.friends,
	RelationshipLevel.friendsⵧgood,
	RelationshipLevel.friendsⵧbest,
	RelationshipLevel.dating,
	RelationshipLevel.intimateⵧ1,
	RelationshipLevel.intimateⵧ2,
	RelationshipLevel.intimateⵧ3,
]
const MAX_LEVEL_INDEX = LEVELS_ORDERED_INC.length - 1

export function is_max(level: RelationshipLevel): boolean {
	return level === RelationshipLevel.intimateⵧ3
}

export function get_corresponding_index(level: RelationshipLevel): number {
	return LEVELS_ORDERED_INC.indexOf(level)
}

export function get_from_index(level_index: number): RelationshipLevel {
	assert(level_index >= 0, `RelationshipLevel.get_from_index should be >= 0`)
	assert(level_index <= MAX_LEVEL_INDEX, `RelationshipLevel.get_from_index should be <= max>`)
	return LEVELS_ORDERED_INC[level_index]
}

export function get_next_level(level: RelationshipLevel): RelationshipLevel {
	return get_from_index(
		Math.min(
			get_corresponding_index(level) + 1,
			MAX_LEVEL_INDEX,
		)
	)
}

export { Comparator } // for convenience
export function compare(level_a: RelationshipLevel, comparator: Comparator, level_b: RelationshipLevel): boolean {
	return _compare<RelationshipLevel>(level_a, comparator, level_b, get_corresponding_index)
}
