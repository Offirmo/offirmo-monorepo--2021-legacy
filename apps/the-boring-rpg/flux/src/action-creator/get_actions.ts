import { UUID } from '@offirmo/uuid'

import { get_unslotted_item } from '@oh-my-rpg/state-inventory'
import { UState } from '@tbrpg/state'

/////////////////////

import {
	Action,
	ActionEquipItem,
	ActionSellItem,
	ActionType
} from './types'

/////////////////////

function get_actions_for_unslotted_item(u_state: Readonly<UState>, uuid: UUID): Readonly<Action>[] {
	const actions: Action[] = []

	const equip: ActionEquipItem = {
		type: ActionType.equip_item,
		target_uuid: uuid,
	}
	actions.push(equip)

	const sell: ActionSellItem = {
		type: ActionType.sell_item,
		target_uuid: uuid,
	}
	actions.push(sell)

	return actions
}

///////

function get_actions_for_element(u_state: Readonly<UState>, uuid: UUID): Readonly<Action>[] {
	const actions: Action[] = []

	const as_unslotted_item = get_unslotted_item(u_state.inventory, uuid)
	if (as_unslotted_item)
		actions.push(...get_actions_for_unslotted_item(u_state, uuid))

	return actions
}

/////////////////////

export {
	get_actions_for_element,
}
