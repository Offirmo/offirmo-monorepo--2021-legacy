/////////////////////

import { UUID } from '@offirmo/uuid'

import { InventorySlot } from '@oh-my-rpg/definitions'

import {
	Item,
	State,
} from './types'

/////////////////////

function is_full(state: Readonly<State>): boolean {
	return (state.unslotted.length >= state.unslotted_capacity)
}

function get_equipped_item_count(state: Readonly<State>): number {
	return Object.keys(state.slotted).length
}

function get_unequipped_item_count(state: Readonly<State>): number {
	return state.unslotted.length
}

function get_item_count(state: Readonly<State>): number {
	return get_equipped_item_count(state) + get_unequipped_item_count(state)
}

function get_unslotted_item(state: Readonly<State>, uuid: UUID): Readonly<Item> | null {
	let item: Item | undefined | null = state.unslotted.find(i => i.uuid === uuid)
	return item ? item : null
}

function get_item(state: Readonly<State>, uuid: UUID): Readonly<Item> | null {
	let item: Item | undefined | null = get_unslotted_item(state, uuid)
	item = item || Object.values(state.slotted).find(i => !!i && i.uuid === uuid)
	return item ? item : null
}

function get_item_in_slot(state: Readonly<State>, slot: InventorySlot): Readonly<Item> | null {
	return (state.slotted as { [k: string]: Item})[slot] || null
}
/*
function get_typed_item_in_slot(state: Readonly<State>, slot: InventorySlot): State['slotted'][keyof State['slotted']] | null {
	switch(slot) {
		case InventorySlot.armor:
			return state.slotted[InventorySlot.armor] || null
		case InventorySlot.weapon:
			return state.slotted[InventorySlot.weapon] || null
		default:
			return null
	}
}
*/

function* iterables_unslotted(state: Readonly<State>) {
	yield* state.unslotted
}

/////////////////////

export {
	is_full,
	get_equipped_item_count,
	get_unequipped_item_count,
	get_item_count,
	get_unslotted_item,
	get_item,
	get_item_in_slot,
	iterables_unslotted,
}

/////////////////////
