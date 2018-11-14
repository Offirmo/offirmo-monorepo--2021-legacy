import { UUID } from '@offirmo/uuid'
import * as RichText from '@offirmo/rich-text-format'

import { ITEM_SLOTS, InventorySlot, Element } from '@oh-my-rpg/definitions'
import { is_full } from '@oh-my-rpg/state-inventory'
import { Snapshot, get_snapshot } from '@oh-my-rpg/state-energy'
import { appraise_value, appraise_power } from '@oh-my-rpg/logic-shop'
import {
	Item,
	get_item as _get_item,
	get_item_in_slot as _get_item_in_slot,
} from '@oh-my-rpg/state-inventory'
import {
	EngagementType,
	PendingEngagement,
	get_oldest_queued_flow,
	get_oldest_queued_non_flow,
} from "@oh-my-rpg/state-engagement"
import { AchievementSnapshot } from "@oh-my-rpg/state-progress";

/////////////////////

import { State } from '../types'
import { get_engagement_message } from '../engagement'
import {get_achievement_snapshot_by_uuid} from "./achievements";

/////////////////////

function is_inventory_full(state: Readonly<State>): boolean {
	return is_full(state.inventory)
}

function get_energy_snapshot(state: Readonly<State>, now?: Readonly<Date>): Readonly<Snapshot> {
	return get_snapshot(state.energy, now)
}

function get_item_in_slot(state: Readonly<State>, slot: InventorySlot): Readonly<Item> | null {
	return _get_item_in_slot(state.inventory, slot)
}

function get_item(state: Readonly<State>, uuid: UUID): Readonly<Item> | null {
	return _get_item(state.inventory, uuid)
}

function appraise_item_value(state: Readonly<State>, uuid: UUID): number {
	const item = get_item(state, uuid)
	if (!item)
		throw new Error('appraise_item_value(): No item!')

	return appraise_value(item)
}

function appraise_item_power(state: Readonly<State>, uuid: UUID): number {
	const item = get_item(state, uuid)
	if (!item)
		throw new Error('appraise_item_power(): No item!')

	return appraise_power(item)
}

// TODO
function appraise_player_power(state: Readonly<State>): number {
	let power: number = 1

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = get_item_in_slot(state, slot)

		if (item)
			power += appraise_power(item)
	})

	// TODO appraise attributes relative to class

	return power
}

function find_element(state: Readonly<State>, uuid: UUID): Readonly<Element> | Readonly<AchievementSnapshot> | null {
	// only inventory for now
	let possible_achievement: Readonly<AchievementSnapshot> | null = null
	try {
		possible_achievement = get_achievement_snapshot_by_uuid(state, uuid)
	}
	catch (err) {
		// not found, swallow
	}
	return possible_achievement || get_item(state, uuid)
}

function find_better_unequipped_weapon(state: Readonly<State>): Readonly<Element> | null {
	// we take advantage of the fact that the inventory is auto-sorted
	const best_unequipped_weapon = state.inventory.unslotted.find(e => e.slot === InventorySlot.weapon)

	if (!best_unequipped_weapon)
		return null

	const best_unequipped_power = appraise_power(best_unequipped_weapon)
	const equipped_power = appraise_power(get_item_in_slot(state, InventorySlot.weapon)!)
	if (best_unequipped_power > equipped_power)
		return best_unequipped_weapon

	return null
}

// TODO code duplication
function get_oldest_pending_flow_engagement(state: Readonly<State>): { uid: number, $doc: RichText.Document, pe: PendingEngagement } | null {
	const pe = get_oldest_queued_flow(state.engagement)
	if (!pe)
		return null

	return {
		uid: pe.uid,
		$doc: get_engagement_message(state, pe),
		pe,
	}
}
function get_oldest_pending_non_flow_engagement(state: Readonly<State>): { uid: number, $doc: RichText.Document, pe: PendingEngagement } | null {
	const pe = get_oldest_queued_non_flow(state.engagement)
	if (!pe)
		return null

	return {
		uid: pe.uid,
		$doc: get_engagement_message(state, pe),
		pe,
	}
}

/////////////////////

export {
	get_energy_snapshot,
	is_inventory_full,
	get_item_in_slot,
	get_item,
	appraise_item_value,
	appraise_item_power,
	find_element,
	find_better_unequipped_weapon,
	appraise_player_power,
	get_oldest_pending_flow_engagement,
	get_oldest_pending_non_flow_engagement,
}
export * from './achievements'

/////////////////////
