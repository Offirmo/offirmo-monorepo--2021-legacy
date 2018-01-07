/////////////////////

import { Random, Engine } from '@offirmo/random'
import { Item, ItemQuality, InventorySlot } from '@oh-my-rpg/definitions'
import {
	Weapon,
	create as create_weapon,
	get_medium_damage,
} from '@oh-my-rpg/logic-weapons'
import {
	Armor,
	create as create_armor,
	get_medium_damage_reduction,
} from '@oh-my-rpg/logic-armors'


import {
	WEAPON_STRENGTH_TO_COINS_COEFFICIENT,
} from './consts'

/////////////////////

function create(rng: Engine): void {
	// TODO one day
}

/////////////////////

// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_shop(): void {
	const rng: Engine = Random.engines.mt19937().autoSeed()
	return create(rng)
}

/////////////////////

const ARMOR_DMG_REDUCTION_TO_COINS_RATIO = 1.8
function appraise_armor(armor: Armor): number {
	return Math.round(get_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_COINS_RATIO)
}

const WEAPON_DMG_TO_COINS_RATIO = 0.8
function appraise_weapon(weapon: Weapon): number {
	return Math.round(get_medium_damage(weapon) * WEAPON_DMG_TO_COINS_RATIO)
}

///////

function appraise(item: Item): number {
	switch(item.slot) {
		case InventorySlot.armor:
			return appraise_armor(item as Armor)
		case InventorySlot.weapon:
			return appraise_weapon(item as Weapon)
		default:
			throw new Error(`appraise(): no appraisal scheme for slot "${item.slot}" !`)
	}
}

/////////////////////

export {
	generate_random_demo_shop,
	create,
	appraise,
}

/////////////////////
