import assert from 'tiny-invariant'

import { SSRRank } from './types'
import { Quality } from '../type--quality/types'


export function get_corresponding_quality(ssr_rank: SSRRank): Quality {
	return {
		[SSRRank.F]:   Quality.poor,
		[SSRRank.E]:   Quality.poor,
		[SSRRank.D]:   Quality.common,
		[SSRRank.C]:   Quality.common,
		[SSRRank.B]:   Quality.uncommon,
		[SSRRank.A]:   Quality.uncommon,
		[SSRRank.S]:   Quality.rare,
		[SSRRank.SS]:  Quality.epic,
		[SSRRank.SSR]: Quality.legendary,
	}[ssr_rank]
}

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

function _get_corresponding_index(ssr_rank: SSRRank): number {
	return RANKS_ORDERED_INC.indexOf(ssr_rank)
}

function _get_from_index(ssr_rank_index: number): SSRRank {
	assert(ssr_rank_index >= 0)
	assert(ssr_rank_index <= MAX_RANK_INDEX)
	return RANKS_ORDERED_INC[ssr_rank_index]
}

//export function compare(ssr_rank_a, ssr_rank_b)

export function get_next_rank(ssr_rank: SSRRank): SSRRank {
	return _get_from_index(
		Math.min(
			_get_corresponding_index(ssr_rank) + 1,
			MAX_RANK_INDEX,
		)
	)
}
