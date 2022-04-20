/////////////////////

import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { Random, Engine } from '@offirmo/random'

import {
	ItemQuality,
	InventorySlot,
	ElementType,
} from '@tbrpg/definitions'

import { Weapon } from './types'

import {
	MIN_ENHANCEMENT_LEVEL,
	MAX_ENHANCEMENT_LEVEL,
} from './consts'

import {
	WEAPON_BASES,
	WEAPON_QUALIFIERS1,
	WEAPON_QUALIFIERS2,
} from './data'

import {
	BASE_STRENGTH_INTERVAL_BY_QUALITY,
} from './selectors'

import { create } from './state'

/////////////////////

const DEMO_WEAPON_1: Immutable<Weapon> = enforce_immutability<Weapon>({
	uuid: 'uu1~test~demo~weapon~001',
	element_type: ElementType.item,
	slot: InventorySlot.weapon,
	base_hid: WEAPON_BASES[0].hid,
	qualifier1_hid: WEAPON_QUALIFIERS1[0].hid,
	qualifier2_hid: WEAPON_QUALIFIERS2[0].hid,
	quality: ItemQuality.uncommon,
	base_strength: BASE_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.uncommon][0] + 1,
	enhancement_level: MIN_ENHANCEMENT_LEVEL,
})

const DEMO_WEAPON_2: Immutable<Weapon> = enforce_immutability<Weapon>({
	uuid: 'uu1~test~demo~weapon~002',
	element_type: ElementType.item,
	slot: InventorySlot.weapon,
	base_hid: WEAPON_BASES[1].hid,
	qualifier1_hid: WEAPON_QUALIFIERS1[1].hid,
	qualifier2_hid: WEAPON_QUALIFIERS2[1].hid,
	quality: ItemQuality.legendary,
	base_strength: BASE_STRENGTH_INTERVAL_BY_QUALITY[ItemQuality.legendary][1] - 1,
	enhancement_level: MAX_ENHANCEMENT_LEVEL,
})

// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_weapon(rng?: Engine): Weapon {
	rng = rng || Random.engines.mt19937().autoSeed()
	return create(rng!, {
		enhancement_level: Random.integer(MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL)(rng),
	})
}

/////////////////////

export {
	DEMO_WEAPON_1,
	DEMO_WEAPON_2,
	generate_random_demo_weapon,
}

/////////////////////
