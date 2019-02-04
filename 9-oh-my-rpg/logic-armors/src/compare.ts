////////////////////////////////////

import { compare_items_by_quality } from '@oh-my-rpg/definitions'

import { Armor } from './types'
import { get_potential } from './selectors'

/////////////////////

// for sorting
function compare_armors_by_potential(a: Readonly<Armor>, b: Readonly<Armor>): number {
	const a_dmg = get_potential(a)
	const b_dmg = get_potential(b)
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
