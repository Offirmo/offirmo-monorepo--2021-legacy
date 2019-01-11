import { UUID } from '@offirmo/uuid'

import { InventorySlot, Element } from '@oh-my-rpg/definitions'
import { is_full } from '@oh-my-rpg/state-inventory'
import { appraise_value, appraise_power } from '@oh-my-rpg/logic-shop'
import { Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
import {
	Item,
	get_item as _get_item,
	get_item_in_slot as _get_item_in_slot,
} from '@oh-my-rpg/state-inventory'

/////////////////////

import { State } from '../types'

/////////////////////

function appraise_item_value(state: Readonly<State>, uuid: UUID): number {
	const item = _get_item(state.inventory, uuid)
	if (!item)
		throw new Error('appraise_item_value(): No item!')

	return appraise_value(item)
}

function appraise_item_power(state: Readonly<State>, uuid: UUID): number {
	const item = _get_item(state.inventory, uuid)
	if (!item)
		throw new Error('appraise_item_power(): No item!')

	return appraise_power(item)
}

function is_inventory_full(state: Readonly<State>): boolean {
	return is_full(state.inventory)
}

function get_item_in_slot(state: Readonly<State>, slot: InventorySlot): Readonly<Item> | null {
	return _get_item_in_slot(state.inventory, slot)
}

function get_item(state: Readonly<State>, uuid: UUID): Readonly<Item> | null {
	return _get_item(state.inventory, uuid)
}

function find_best_unequipped_armor(state: Readonly<State>): Readonly<Armor> | null {
	// we take advantage of the fact that the inventory is auto-sorted
	const best_unequipped_armor = state.inventory.unslotted.find(e => e.slot === InventorySlot.armor)

	return best_unequipped_armor
		? best_unequipped_armor as Armor
		: null
}

function find_better_unequipped_armor(state: Readonly<State>): Readonly<Element> | null {
	const best_unequipped_armor = find_best_unequipped_armor(state)
	if (!best_unequipped_armor)
		return null

	const best_unequipped_power = appraise_power(best_unequipped_armor)
	const equipped_power = appraise_power(get_item_in_slot(state, InventorySlot.armor)!)
	if (best_unequipped_power > equipped_power)
		return best_unequipped_armor

	return null
}

function find_best_unequipped_weapon(state: Readonly<State>): Readonly<Weapon> | null {
	// we take advantage of the fact that the inventory is auto-sorted
	const best_unequipped_weapon = state.inventory.unslotted.find(e => e.slot === InventorySlot.weapon)

	return best_unequipped_weapon
		? best_unequipped_weapon as Weapon
		: null
}

function find_better_unequipped_weapon(state: Readonly<State>): Readonly<Element> | null {
	const best_unequipped_weapon = find_best_unequipped_weapon(state)
	if (!best_unequipped_weapon)
		return null

	const best_unequipped_power = appraise_power(best_unequipped_weapon)
	const equipped_power = appraise_power(get_item_in_slot(state, InventorySlot.weapon)!)
	if (best_unequipped_power > equipped_power)
		return best_unequipped_weapon

	return null
}

/////////////////////

export {
	appraise_item_value,
	appraise_item_power,
	is_inventory_full,
	get_item_in_slot,
	get_item,
	find_better_unequipped_armor,
	find_better_unequipped_weapon,
}

/////////////////////
