import { State } from '@tbrpg/state'
import * as TBRPGState from '@tbrpg/state'

import {
	Action,
	ActionType,
} from '../actions'


function reduce_action(state: Readonly<State>, action: Readonly<Action>): Readonly<State> {
	const { expected_state_revision } = action
	if (expected_state_revision) {
		if (state.u_state.revision !== expected_state_revision)
			throw new Error('Trying to execute an outdated action!')
	}

	switch (action.type) {
		case ActionType.on_start_session:
			return TBRPGState.on_start_session(state, action.is_web_diversity_supporter)
		case ActionType.play:
			return TBRPGState.play(state)
		case ActionType.equip_item:
			return TBRPGState.equip_item(state, action.target_uuid)
		case ActionType.sell_item:
			return TBRPGState.sell_item(state, action.target_uuid)
		case ActionType.rename_avatar:
			return TBRPGState.rename_avatar(state, action.new_name)
		case ActionType.change_avatar_class:
			return TBRPGState.change_avatar_class(state, action.new_class)
		case ActionType.redeem_code:
			return TBRPGState.attempt_to_redeem_code(state, action.code)
		case ActionType.acknowledge_engagement_msg_seen:
			return TBRPGState.acknowledge_engagement_msg_seen(state, action.uid)
		case ActionType.update_to_now:
			return TBRPGState.update_to_now(state /* TODO , action.time*/)
		case ActionType.hack:
			return action.custom_reducer(state)
		default:
			throw new Error(`reduce_action(): Unhandled switch value(s)!`)
	}
}

export {
	reduce_action
}
