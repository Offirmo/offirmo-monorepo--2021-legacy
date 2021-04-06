import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'
import { are_ustate_revision_requirements_met } from '@offirmo-private/state-utils'
import { State } from '@tbrpg/state'
import * as TBRPGState from '@tbrpg/state'
import { Action, ActionType } from '@tbrpg/interfaces'

import { LIB } from '../consts'


const KNOWN_ACTIONS_COUNT = 13
if (KNOWN_ACTIONS_COUNT !== Enum.keys(ActionType).length)
	throw new Error(`[${LIB}] reduce_action() is outdated! ${Enum.keys(ActionType).length} vs. ${KNOWN_ACTIONS_COUNT}`)

function reduce_action(state: Immutable<State>, action: Immutable<Action>): Immutable<State> {
	if (!are_ustate_revision_requirements_met(state, action.expected_revisions)) {
		throw new Error(`Failed to execute an action "${action.type}": outdated!`)
	}

	switch (action.type) {
		case ActionType.play:
			return TBRPGState.play(state, action.time)
		case ActionType.equip_item:
			return TBRPGState.equip_item(state, action.target_uuid, action.time)
		case ActionType.sell_item:
			return TBRPGState.sell_item(state, action.target_uuid, action.time)
		case ActionType.rename_avatar:
			return TBRPGState.rename_avatar(state, action.new_name, action.time)
		case ActionType.change_avatar_class:
			return TBRPGState.change_avatar_class(state, action.new_class, action.time)
		case ActionType.redeem_code:
			return TBRPGState.attempt_to_redeem_code(state, action.code, action.time)

		case ActionType.start_game:
			throw new Error('Unexpected start game action dispatched!')
		case ActionType.on_start_session:
			return TBRPGState.on_start_session(state, action.is_web_diversity_supporter, action.time)
		case ActionType.on_logged_in_refresh:
			return TBRPGState.on_logged_in_refresh(state, action.is_logged_in, action.roles, action.time)
		case ActionType.acknowledge_engagement_msg_seen:
			return TBRPGState.acknowledge_engagement_msg_seen(state, action.uid, action.time)
		case ActionType.update_to_now:
			return TBRPGState.update_to_now(state, action.time)

		case ActionType.set:
			return action.state
		case ActionType.hack:
			return action.custom_reducer(
				// auto update-to-now for convenience
				TBRPGState.update_to_now(
					state,
					action.time
				)
			)

		default:
			throw new Error('reduce_action(): Unhandled switch value(s)!')
	}
}

export {
	reduce_action,
}
