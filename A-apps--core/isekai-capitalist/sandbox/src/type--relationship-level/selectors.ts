import assert from 'tiny-invariant'

import { RelationshipLevel } from './types'
import { Quality } from '../type--quality/types'


export function get_corresponding_quality(level: RelationshipLevel): Quality {
	return {
		[RelationshipLevel.strangers]:     Quality.poor,
		[RelationshipLevel.introduced]:    Quality.poor,
		[RelationshipLevel.acquaintances]: Quality.common,
		[RelationshipLevel.friends]:       Quality.common,
		[RelationshipLevel.friendsⵧgood]:  Quality.uncommon,
		[RelationshipLevel.friendsⵧbest]:  Quality.uncommon,
		[RelationshipLevel.dating]:        Quality.rare,
		[RelationshipLevel.baseⵧ1]:        Quality.rare,
		[RelationshipLevel.baseⵧ2]:        Quality.epic,
		[RelationshipLevel.baseⵧ3]:        Quality.legendary,
	}[level]
}

/*
const RANKS_ORDERED_INC: SSRRank[] = [
	SSRRank.F,
	SSRRank.E,
	SSRRank.D,
	SSRRank.C,
	SSRRank.B,
	SSRRank.A,
	SSRRank.S,
	SSRRank.SS,
	SSRRank.SSR,
]
const MAX_RANK_INDEX = RANKS_ORDERED_INC.length - 1

function get_corresponding_index(ssr_rank: SSRRank): number {
	return RANKS_ORDERED_INC.indexOf(ssr_rank)
}

function get_from_index(ssr_rank_index: number): SSRRank {
	assert(ssr_rank_index >= 0)
	assert(ssr_rank_index <= MAX_RANK_INDEX)
	return RANKS_ORDERED_INC[ssr_rank_index]
}

//export function compare(ssr_rank_a, ssr_rank_b)

export function get_next_rank(ssr_rank: SSRRank): SSRRank {
	return get_from_index(
		Math.min(
			get_corresponding_index(ssr_rank) + 1,
			MAX_RANK_INDEX,
		)
	)
}*/
