/////////////////////

import * as deepFreeze from 'deep-freeze-strict'

import { InventorySlot } from '@oh-my-rpg/definitions'
import { DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons'
import { DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors'

import {
	UUID,
	Item,
	State,
} from './types'

import { LIB, SCHEMA_VERSION } from './consts'
import { compare_items } from './compare'

/////////////////////

function create(): State {
	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		// todo rename equipped / backpack
		unslotted_capacity: 20,
		slotted: {},
		unslotted: [],
	}
}

/////////////////////

function auto_sort(state: State): State {
	state.unslotted.sort(compare_items)
	return state
}

/////////////////////

function add_item(state: State, item: Item): State {
	if (state.unslotted.length >= state.unslotted_capacity)
		throw new Error(`state-inventory: can't add item, inventory is full!`)

	state.unslotted.push(item)

	return auto_sort(state)
}

function remove_item_from_unslotted(state: State, uuid: UUID): State {
	const new_unslotted = state.unslotted.filter(i => i.uuid !== uuid)
	if (new_unslotted.length === state.unslotted.length)
		throw new Error(`state-inventory: can't remove item #${uuid}, not found!`)

	state.unslotted = new_unslotted

	return state
}

function equip_item(state: State, uuid: UUID): State {
	const item_to_equip = state.unslotted.find(i => i.uuid === uuid)
	if (!item_to_equip)
		throw new Error(`state-inventory: can't equip item #${uuid}, not found!`)

	const target_slot = item_to_equip.slot

	const item_previously_in_slot = get_item_in_slot(state, target_slot) // may be null

	// swap them
	state.slotted[target_slot] = item_to_equip
	state = remove_item_from_unslotted(state, item_to_equip.uuid)
	if (item_previously_in_slot)
		state.unslotted.push(item_previously_in_slot)

	return auto_sort(state)
}

/////////////////////

function get_equipped_item_count(state: Readonly<State>): number {
	return Object.keys(state.slotted).length
}

function get_unequipped_item_count(state: Readonly<State>): number {
	return state.unslotted.filter(i => !!i).length
}

function get_item_count(state: Readonly<State>): number {
	return get_equipped_item_count(state) + get_unequipped_item_count(state)
}

function get_unslotted_item(state: Readonly<State>, uuid: UUID): Item | null {
	let item: Item | undefined | null = state.unslotted.find(i => i.uuid === uuid)
	return item ? item : null
}

function get_item(state: Readonly<State>, uuid: UUID): Item | null {
	let item: Item | undefined | null = get_unslotted_item(state, uuid)
	item = item || Object.values(state.slotted).find(i => !!i && i.uuid === uuid)
	return item ? item : null
}

function get_item_in_slot(state: Readonly<State>, slot: InventorySlot): Item | null {
	return state.slotted[slot] || null
}

function* iterables_unslotted(state: Readonly<State>) {
	yield* state.unslotted
}

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 42,

	unslotted_capacity: 20,
	slotted: {
		armor: DEMO_ARMOR_2,
		weapon: DEMO_WEAPON_1,
	},
	unslotted: [
		DEMO_WEAPON_2,
		DEMO_ARMOR_1,
	],
})

// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS: any = deepFreeze({
	unslotted_capacity: 20,
	slotted: {
		armor: DEMO_ARMOR_2,
		weapon: DEMO_WEAPON_1,
	},
	unslotted: [
		DEMO_WEAPON_2,
		DEMO_ARMOR_1,
	],
})

// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
	to_v1: {
		revision: 42
	},
})

/////////////////////

export {
	InventorySlot,
	Item,
	State,

	create,
	add_item,
	remove_item_from_unslotted,
	equip_item,

	get_equipped_item_count,
	get_unequipped_item_count,
	get_item_count,
	get_unslotted_item,
	get_item,
	get_item_in_slot,
	iterables_unslotted,

	DEMO_STATE,
	OLDEST_LEGACY_STATE_FOR_TESTS,
	MIGRATION_HINTS_FOR_TESTS,
}

/////////////////////
