import { Enum } from 'typescript-string-enums'

import { UUID } from '@offirmo-private/uuid'
import * as RichText from '@offirmo-private/rich-text-format'

import { CharacterClass } from '@oh-my-rpg/state-character'
import { ITEM_SLOTS, InventorySlot, Element } from '@oh-my-rpg/definitions'
import { appraise_sell_value, appraise_power } from '@oh-my-rpg/logic-shop'
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
} from '@oh-my-rpg/state-engagement'
import { AchievementSnapshot } from '@oh-my-rpg/state-progress'

/////////////////////

import { UState } from '../types'
import { get_engagement_message } from '../engagement'
import { get_achievement_snapshot_by_uuid } from './achievements'

/////////////////////


// TODO
function appraise_player_power(u_state: Readonly<UState>): number {
	let power: number = 1

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = _get_item_in_slot(u_state.inventory, slot)

		if (item)
			power += appraise_power(item)
	})

	// TODO appraise attributes relative to class

	return power
}


function find_element(u_state: Readonly<UState>, uuid: UUID): Readonly<Element> | Readonly<AchievementSnapshot> | null {
	// only inventory for now
	let possible_achievement: Readonly<AchievementSnapshot> | null = null
	try {
		possible_achievement = get_achievement_snapshot_by_uuid(u_state, uuid)
	}
	catch (err) {
		// not found, swallow
	}
	return possible_achievement || _get_item(u_state.inventory, uuid)
}

// TODO code duplication
function get_oldest_pending_flow_engagement(u_state: Readonly<UState>): { uid: number, $doc: RichText.Document, pe: PendingEngagement } | null {
	const pe = get_oldest_queued_flow(u_state.engagement)
	if (!pe)
		return null

	return {
		uid: pe.uid,
		$doc: get_engagement_message(pe),
		pe,
	}
}
function get_oldest_pending_non_flow_engagement(u_state: Readonly<UState>): { uid: number, $doc: RichText.Document, pe: PendingEngagement } | null {
	const pe = get_oldest_queued_non_flow(u_state.engagement)
	if (!pe)
		return null

	return {
		uid: pe.uid,
		$doc: get_engagement_message(pe),
		pe,
	}
}


/////////////////////

export {
	find_element,
	appraise_player_power,
	get_oldest_pending_flow_engagement,
	get_oldest_pending_non_flow_engagement,
}

/////////////////////
