/////////////////////

import { UUID } from '@offirmo-private/uuid'
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { InventorySlot } from '@tbrpg/definitions'


import { SCHEMA_VERSION } from './consts'
import { Item, State } from './types'
import { compare_items_by_slot_then_strength } from './compare'
import { is_full, get_item_in_slot } from './selectors'
import { OMRSoftExecutionContext, get_lib_SEC } from './sec'

/////////////////////

function create(SEC?: OMRSoftExecutionContext): Immutable<State> {
	return get_lib_SEC(SEC).xTry('rename', () => {
		return enforce_immutability<State>({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			// todo rename equipped / backpack ?
			unslotted_capacity: 20,
			slotted: {},
			unslotted: [],
		})
	})
}

/////////////////////

function _auto_sort(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		unslotted: [...state.unslotted].sort(compare_items_by_slot_then_strength)
	}
}

function _internal_remove_item_from_unslotted(state: Immutable<State>, uuid: UUID): Immutable<State> {
	const new_unslotted = state.unslotted.filter(i => i.uuid !== uuid)
	if (new_unslotted.length === state.unslotted.length)
		throw new Error(`state-inventory: can’t remove item #${uuid}, not found!`)

	// removing won't change the sort order, so no need to auto-sort
	return {
		...state,
		unslotted: new_unslotted,
	}
}

/////////////////////

function add_item(state: Immutable<State>, item: Item): Immutable<State> {
	if (is_full(state))
		throw new Error('state-inventory: can’t add item, inventory is full!')

	return _auto_sort({
		...state,

		unslotted: [...state.unslotted, item],

		revision: state.revision + 1,
	})
}

function remove_item_from_unslotted(state: Immutable<State>, uuid: UUID): Immutable<State> {
	return _internal_remove_item_from_unslotted({
		...state,
		revision: state.revision + 1,
	}, uuid)
}

function equip_item(state: Immutable<State>, uuid: UUID): Immutable<State> {
	const item_to_equip = state.unslotted.find(i => i.uuid === uuid)
	if (!item_to_equip)
		throw new Error(`state-inventory: can’t equip item #${uuid}, not found!`)

	const target_slot = item_to_equip.slot

	const item_previously_in_slot = get_item_in_slot(state, target_slot) // may be null

	// swap them
	let new_state = {
		...state,
		slotted: {
			...state.slotted,
			[target_slot]: item_to_equip,
		},
		revision: state.revision + 1,
	}
	new_state = _internal_remove_item_from_unslotted(new_state, item_to_equip.uuid)
	if (item_previously_in_slot) {
		new_state.unslotted = [...new_state.unslotted, item_previously_in_slot]
	}

	return _auto_sort(new_state)
}

/////////////////////

export {
	InventorySlot,

	create,
	add_item,
	remove_item_from_unslotted,
	equip_item,
}

/////////////////////
