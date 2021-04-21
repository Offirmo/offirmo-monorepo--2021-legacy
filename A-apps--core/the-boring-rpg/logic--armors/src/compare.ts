////////////////////////////////////

import { Immutable } from '@offirmo-private/ts-types'
import { compare_items_by_quality } from '@tbrpg/definitions'

import { Armor } from './types'
import { get_ultimate_medium_damage_reduction } from './selectors'

/////////////////////

// for sorting
function compare_armors_by_potential(a: Immutable<Armor>, b: Immutable<Armor>): number {
	const a_dmg = get_ultimate_medium_damage_reduction(a)
	const b_dmg = get_ultimate_medium_damage_reduction(b)
	if (a_dmg !== b_dmg)
		return b_dmg - a_dmg

	// fallback to other attributes
	return compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid)
}

/////////////////////

export {
	compare_armors_by_potential,
}

/////////////////////
