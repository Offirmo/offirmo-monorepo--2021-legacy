/////////////////////

import { compare_items_by_quality } from '@oh-my-rpg/definitions'

import { get_medium_damage } from './selectors'
import { Weapon } from './types'

/////////////////////

// for sorting
function compare_weapons_by_strength(a: Readonly<Weapon>, b: Readonly<Weapon>): number {
	const a_dmg = get_medium_damage(a)
	const b_dmg = get_medium_damage(b)
	if (a_dmg !== b_dmg)
		return b_dmg - a_dmg

	// with equal damage, the least enhanced has more potential
	if (a.enhancement_level !== b.enhancement_level)
		return a.enhancement_level - b.enhancement_level

	// fallback to other attributes
	return compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid)
}

/////////////////////

export {
	compare_weapons_by_strength,
}

/////////////////////
