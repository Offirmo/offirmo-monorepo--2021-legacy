import { UUID } from '@offirmo-private/uuid'
import { Immutable } from '@offirmo-private/ts-types'
import { get_unslotted_item } from '@tbrpg/state--inventory'
import { UState } from '@tbrpg/state'
import {
	Action,
	ActionEquipItem,
	ActionSellItem,
	ActionType,
} from '@tbrpg/interfaces'

/////////////////////

function get_actions_for_unslotted_item(u_state: Immutable<UState>, uuid: UUID): Action[] {
	const actions: Action[] = []

	const equip: ActionEquipItem = {
		time: 0, // to indicate that action time is pending
		type: ActionType.equip_item,
		expected_revisions: {
			inventory: u_state.inventory.revision,
		},
		target_uuid: uuid,
	}
	actions.push(equip)

	const sell: ActionSellItem = {
		time: 0, // to indicate that action time is pending
		type: ActionType.sell_item,
		expected_revisions: {
			inventory: u_state.inventory.revision,
		},
		target_uuid: uuid,
	}
	actions.push(sell)

	return actions
}


function get_actions_for_element(u_state: Immutable<UState>, uuid: UUID): Action[] {
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
