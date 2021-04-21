/////////////////////

import { Immutable } from '@offirmo-private/ts-types'
import {
	Item,
	ItemQuality,
	InventorySlot,
	create_item_base,
} from '@tbrpg/definitions'
import { Random, Engine } from '@offirmo/random'

import {
	Weapon,
} from './types'

import {
	i18n_messages,
	WEAPON_BASES,
	WEAPON_QUALIFIERS1,
	WEAPON_QUALIFIERS2,
} from './data'

import {
	LIB,
	MIN_ENHANCEMENT_LEVEL,
	MAX_ENHANCEMENT_LEVEL,
} from './consts'

import {
	BASE_STRENGTH_INTERVAL_BY_QUALITY,
} from './selectors'

/////////////////////

function pick_random_quality(rng: Engine): ItemQuality {
	// see armor for numbers
	let p = Random.integer(1, 1000)(rng)

	if (p <= 300)
		return ItemQuality.common
	p -= 300

	if (p <= 300)
		return ItemQuality.uncommon
	p -= 300

	if (p <= 250)
		return ItemQuality.rare
	p -= 250

	if (p <= 120)
		return ItemQuality.epic

	return ItemQuality.legendary
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
function pick_random_base_strength(rng: Engine, quality: ItemQuality): number {
	return Random.integer(...BASE_STRENGTH_INTERVAL_BY_QUALITY[quality])(rng)
}

/////////////////////

function create(rng: Engine, hints: Immutable<Partial<Weapon>> = {}): Weapon {
	// TODO add a check for hints to be in existing components

	const base = create_item_base(InventorySlot.weapon, hints.quality || pick_random_quality(rng)) as Item & { slot: typeof InventorySlot.weapon }

	const temp: Weapon = {
		...base,
		base_hid: hints.base_hid || pick_random_base(rng),
		qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng),
		qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng),
		base_strength: hints.base_strength || pick_random_base_strength(rng, base.quality),
		enhancement_level: hints.enhancement_level || MIN_ENHANCEMENT_LEVEL,
	}

	if (temp.base_strength < BASE_STRENGTH_INTERVAL_BY_QUALITY[temp.quality][0])
		throw new Error(`${LIB}: create(): base_strength too low for this quality!`)
	if (temp.base_strength > BASE_STRENGTH_INTERVAL_BY_QUALITY[temp.quality][1])
		throw new Error(`${LIB}: create(): base_strength too high for this quality!`)

	return temp
}

function enhance(weapon: Immutable<Weapon>): Immutable<Weapon> {
	if (weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
		throw new Error('can’t enhance a weapon above the maximal enhancement level!')

	return {
		...weapon,
		enhancement_level: weapon.enhancement_level + 1,
	}
}

/////////////////////

export {
	create,
	enhance,

	i18n_messages,
}

/////////////////////
