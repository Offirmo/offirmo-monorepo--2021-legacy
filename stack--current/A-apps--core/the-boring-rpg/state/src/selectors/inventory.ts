import { UUID } from '@offirmo-private/uuid'
import { Immutable} from '@offirmo-private/ts-types'

import { InventorySlot, Element } from '@tbrpg/definitions'
import { is_full } from '@tbrpg/state--inventory'
import { appraise_sell_value, appraise_power } from '@tbrpg/logic--shop'
import { Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
import {
	Item,
	get_item as _get_item,
	get_item_in_slot as _get_item_in_slot,
} from '@tbrpg/state--inventory'

/////////////////////

import { UState } from '../types'

/////////////////////

function appraise_item_value(u_state: Immutable<UState>, uuid: UUID): number {
	const item = _get_item(u_state.inventory, uuid)
	if (!item)
		throw new Error('appraise_item_value(): No item!')

	return appraise_sell_value(item)
}

function appraise_item_power(u_state: Immutable<UState>, uuid: UUID): number {
	const item = _get_item(u_state.inventory, uuid)
	if (!item)
		throw new Error('appraise_item_power(): No item!')

	return appraise_power(item)
}

function is_inventory_full(u_state: Immutable<UState>): boolean {
	return is_full(u_state.inventory)
}

function get_item_in_slot(u_state: Immutable<UState>, slot: InventorySlot): Immutable<Item> | null {
	return _get_item_in_slot(u_state.inventory, slot)
}

function get_item(u_state: Immutable<UState>, uuid: UUID): Immutable<Item> | null {
	return _get_item(u_state.inventory, uuid)
}

function find_best_unequipped_armor(u_state: Immutable<UState>): Immutable<Armor> | null {
	// we take advantage of the fact that the inventory is auto-sorted
	const best_unequipped_armor = u_state.inventory.unslotted.find(e => e.slot === InventorySlot.armor)

	return best_unequipped_armor
		? best_unequipped_armor as Armor
		: null
}

function find_better_unequipped_armor(u_state: Immutable<UState>): Immutable<Element> | null {
	const best_unequipped_armor = find_best_unequipped_armor(u_state)
	if (!best_unequipped_armor)
		return null

	const best_unequipped_power = appraise_power(best_unequipped_armor)
	const equipped_power = appraise_power(get_item_in_slot(u_state, InventorySlot.armor)!)
	if (best_unequipped_power > equipped_power)
		return best_unequipped_armor

	return null
}

function find_best_unequipped_weapon(u_state: Immutable<UState>): Immutable<Weapon> | null {
	// we take advantage of the fact that the inventory is auto-sorted
	const best_unequipped_weapon = u_state.inventory.unslotted.find(e => e.slot === InventorySlot.weapon)

	return best_unequipped_weapon
		? best_unequipped_weapon as Weapon
		: null
}

function find_better_unequipped_weapon(u_state: Immutable<UState>): Immutable<Element> | null {
	const best_unequipped_weapon = find_best_unequipped_weapon(u_state)
	if (!best_unequipped_weapon)
		return null

	const best_unequipped_power = appraise_power(best_unequipped_weapon)
	const equipped_power = appraise_power(get_item_in_slot(u_state, InventorySlot.weapon)!)
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
