/////////////////////

import {
	ItemQuality,
	InventorySlot,
	ElementType,
	create_item_base,
	compare_items_by_quality,
} from '@oh-my-rpg/definitions'
import { Random, Engine } from '@offirmo/random'

import {
	WeaponPartType,
	Weapon,
} from './types'

import {
	i18n_messages,
	WEAPON_BASES,
	WEAPON_QUALIFIERS1,
	WEAPON_QUALIFIERS2,
} from './data'

import {
	MIN_ENHANCEMENT_LEVEL,
	MAX_ENHANCEMENT_LEVEL,
	MIN_STRENGTH,
	MAX_STRENGTH,
} from './consts'

/////////////////////

function pick_random_quality(rng: Engine): ItemQuality {
	// legendary =    1/1000
	// epic:     =   10/1000
	// rare:     =  200/1000
	// uncommon  =  389/1000
	// common    =  400/1000
	return Random.bool(400, 1000)(rng)
		? ItemQuality.common
		: Random.bool(389, 600)(rng)
			? ItemQuality.uncommon
			: Random.bool(200, 211)(rng)
				? ItemQuality.rare
				: Random.bool(10, 11)(rng)
					? ItemQuality.epic
					: ItemQuality.legendary
}
function pick_random_base(rng: Engine): string {
	return Random.pick(rng, WEAPON_BASES).hid
}
function pick_random_qualifier1(rng: Engine): string {
	return Random.pick(rng, WEAPON_QUALIFIERS1).hid
}
function pick_random_qualifier2(rng: Engine): string {
	return Random.pick(rng, WEAPON_QUALIFIERS2).hid
}
const pick_random_base_strength = Random.integer(MIN_STRENGTH, MAX_STRENGTH)

/////////////////////

function create(rng: Engine, hints: Readonly<Partial<Weapon>> = {}): Weapon {
	// TODO add a check for hints to be in existing components
	return {
		...create_item_base(InventorySlot.weapon, hints.quality || pick_random_quality(rng)),
		base_hid: hints.base_hid || pick_random_base(rng),
		qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng),
		qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng),
		base_strength: hints.base_strength || pick_random_base_strength(rng),
		enhancement_level: hints.enhancement_level || MIN_ENHANCEMENT_LEVEL,
	}
}

// TODO immu
function enhance(weapon: Weapon): Weapon {
	if (weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
		throw new Error('can’t enhance a weapon above the maximal enhancement level!')

	weapon.enhancement_level++
	return weapon
}

/////////////////////

export {
	create,
	enhance,

	i18n_messages,
}

/////////////////////
