import { Immutable} from '@offirmo-private/ts-types'
import { UUID } from '@offirmo-private/uuid'
import * as RichText from '@offirmo-private/rich-text-format'

import { ITEM_SLOTS, InventorySlot, Element } from '@tbrpg/definitions'
import { appraise_power } from '@tbrpg/logic--shop'
import {
	get_item as _get_item,
	get_item_in_slot as _get_item_in_slot,
} from '@tbrpg/state--inventory'
import {
	PendingEngagement,
	get_oldest_queued_flow,
	get_oldest_queued_non_flow,
} from '@oh-my-rpg/state-engagement'
import { AchievementSnapshot } from '@tbrpg/state--progress'

/////////////////////

import { UState } from '../types'
import { get_engagement_message } from '../data/engagement'
import { get_achievement_snapshot_by_temporary_id } from './achievements'

/////////////////////


// TODO power
function appraise_player_power(u_state: Immutable<UState>): number {
	let power: number = 1

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = _get_item_in_slot(u_state.inventory, slot)

		if (item)
			power += appraise_power(item)
	})

	// TODO appraise attributes relative to class

	return power
}

function find_element(u_state: Immutable<UState>, uuid: UUID): Immutable<Element> | AchievementSnapshot | null {
	// only inventory for now
	let possible_achievement: AchievementSnapshot | null = null
	try {
		possible_achievement = get_achievement_snapshot_by_temporary_id(u_state, uuid)
	}
	catch (err) {
		// not found, swallow
	}
	return possible_achievement || _get_item(u_state.inventory, uuid)
}

// TODO code duplication
function get_oldest_pending_flow_engagement(u_state: Immutable<UState>): { uid: number, $doc: RichText.Document, pe: PendingEngagement } | null {
	const pe = get_oldest_queued_flow(u_state.engagement)
	if (!pe)
		return null

	return {
		uid: pe.uid,
		$doc: get_engagement_message(pe),
		pe,
	}
}
function get_oldest_pending_non_flow_engagement(u_state: Immutable<UState>): { uid: number, $doc: RichText.Document, pe: PendingEngagement } | null {
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
