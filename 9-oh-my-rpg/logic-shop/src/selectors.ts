/////////////////////

import { Item, InventorySlot } from '@oh-my-rpg/definitions'
import {
	Armor,
	get_ultimate_medium_damage_reduction,
	ATTACK_VS_DEFENSE_RATIO,
} from '@oh-my-rpg/logic-armors'
import {
	Weapon,
	get_ultimate_medium_damage,
} from '@oh-my-rpg/logic-weapons'

/////////////////////

const ARMOR_DMG_REDUCTION_TO_POWER_RATIO = 1.
function appraise_armor_power(armor: Readonly<Armor>, potential: boolean): number {
	return Math.round(get_ultimate_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_POWER_RATIO)
}

const WEAPON_DMG_TO_POWER_RATIO = 5.
function appraise_weapon_power(weapon: Readonly<Weapon>, potential: boolean): number {
	return Math.round(get_ultimate_medium_damage(weapon) * WEAPON_DMG_TO_POWER_RATIO)
}

function appraise_power(item: Readonly<Item>, potential: boolean = true): number {
	switch(item.slot) {
		case InventorySlot.armor:
			return appraise_armor_power(item as Armor, potential)
		case InventorySlot.weapon:
			return appraise_weapon_power(item as Weapon, potential)
		default:
			throw new Error(`appraise_power(): no appraisal scheme for slot "${item.slot}" !`)
	}
}

// appraise power normalized across different item slots
function appraise_power_normalized(item: Readonly<Item>, potential: boolean = true): number {
	switch(item.slot) {
		case InventorySlot.armor:
			return appraise_armor_power(item as Armor, potential) / ATTACK_VS_DEFENSE_RATIO
		case InventorySlot.weapon:
			return appraise_weapon_power(item as Weapon, potential)
		default:
			throw new Error(`appraise_power_normalized(): no appraisal scheme for slot "${item.slot}" !`)
	}
}

///////

const ARMOR_DMG_REDUCTION_TO_COINS_RATIO = 1
function appraise_armor_base_value(armor: Readonly<Armor>): number {
	return get_ultimate_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_COINS_RATIO
}

const WEAPON_DMG_TO_COINS_RATIO = 1.5
function appraise_weapon_base_value(weapon: Readonly<Weapon>): number {
	return get_ultimate_medium_damage(weapon) * WEAPON_DMG_TO_COINS_RATIO
}

const SELL_RATIO = .25
function appraise_sell_value(item: Readonly<Item>): number {
	switch(item.slot) {
		case InventorySlot.armor:
			return Math.max(1, Math.round(appraise_armor_base_value(item as Armor) * SELL_RATIO))
		case InventorySlot.weapon:
			return Math.max(1, Math.round(appraise_weapon_base_value(item as Weapon) * SELL_RATIO))
		default:
			throw new Error(`appraise_value(): no appraisal scheme for slot "${item.slot}" !`)
	}
}

/////////////////////

export {
	appraise_power_normalized,
	appraise_power,
	appraise_sell_value,
}
