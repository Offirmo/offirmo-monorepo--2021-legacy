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

/////////////////////

import { State } from '../types'
import { get_engagement_message } from '../engagement'

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

function find_element(state: Readonly<State>, uuid: UUID): Readonly<Element> | null {
	// only inventory for now
	return get_item(state, uuid)
}

/*
function has_non_flow_engagement_pending(state: Readonly<State>): boolean {

}

function has_flow_engagement_pending(state: Readonly<State>): boolean {

}*/

function get_oldest_pending_flow_engagement(state: Readonly<State>): { key: string, $doc: RichText.Document, pe: PendingEngagement } | null {
	const pe = get_oldest_queued_flow(state.engagement)
	if (!pe)
		return null

	return {
		key: pe.engagement.key,
		$doc: get_engagement_message(state, pe),
		pe,
	}
}

function get_oldest_pending_non_flow_engagement(state: Readonly<State>): { key: string, $doc: RichText.Document, pe: PendingEngagement } | null {
	const pe = get_oldest_queued_non_flow(state.engagement)
	if (!pe)
		return null

	return {
		key: pe.engagement.key,
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
	appraise_player_power,
	get_oldest_pending_flow_engagement,
	get_oldest_pending_non_flow_engagement,
}

/////////////////////
