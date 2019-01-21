/////////////////////

import { Random, Engine } from '@offirmo/random'

/////////////////////

import {
	play,
	equip_item,
	sell_item,
	rename_avatar,
	change_avatar_class,
} from '../state'

/////////////////////

import { State } from '../types'
import {
	ActionType,
	Action,
} from './types'


/////////////////////

function reduce_action(state: Readonly<State>, action: Readonly<Action>): Readonly<State> {
	const { expected_state_revision } = (action as any)
	if (expected_state_revision) {
		if (state.u_state.revision !== expected_state_revision)
			throw new Error('Trying to execute an outdated action!')
	}

	switch (action.type) {
		case ActionType.play:
			return play(state)
		case ActionType.equip_item:
			return equip_item(state, action.target_uuid)
		case ActionType.sell_item:
			return sell_item(state, action.target_uuid)
		case ActionType.rename_avatar:
			return rename_avatar(state, action.new_name)
		case ActionType.change_avatar_class:
			return change_avatar_class(state, action.new_class)
		default:
			throw new Error('Unrecognized action!')
	}
}

/////////////////////

export {
	reduce_action,
}
