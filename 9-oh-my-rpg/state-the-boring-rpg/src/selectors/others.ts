import { UUID } from '@offirmo/uuid'
import * as RichText from '@offirmo/rich-text-format'

import { ITEM_SLOTS, InventorySlot, Element } from '@oh-my-rpg/definitions'
import { is_full } from '@oh-my-rpg/state-inventory'
import { Snapshot, get_snapshot } from '@oh-my-rpg/state-energy'
import { appraise_value, appraise_power } from '@oh-my-rpg/logic-shop'
import { Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
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

function get_energy_snapshot(state: Readonly<State>, now?: Readonly<Date>): Readonly<Snapshot> {
	return get_snapshot(state.energy, now)
}

// TODO
function appraise_player_power(state: Readonly<State>): number {
	let power: number = 1

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = _get_item_in_slot(state.inventory, slot)

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
	return possible_achievement || _get_item(state.inventory, uuid)
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
	find_element,
	appraise_player_power,
	get_oldest_pending_flow_engagement,
	get_oldest_pending_non_flow_engagement,
}
export * from './achievements'

/////////////////////
