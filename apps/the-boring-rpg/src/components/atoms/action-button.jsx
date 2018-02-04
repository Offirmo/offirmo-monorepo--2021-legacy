import React from 'react'

import { ActionType } from '@oh-my-rpg/state-the-boring-rpg'
import { with_game_instance } from '../context/game-instance-provider'

const ACTION_TYPE_TO_CTA = {
	'play': 'Play',
	'equip_item': 'Equip',
	'sell_item': 'Sell',
	'rename_avatar': 'Rename',
	'change_avatar_class': 'Change class',
}
if (Object.keys(ActionType).join(';') !== Object.keys(ACTION_TYPE_TO_CTA).join(';'))
	throw new Error('Internal error: ACTION_TYPE_TO_CTA needs an update!')

function ActionButtonBase({instance, state, action}) {
	return (
		<button className={'action-btn'} onClick={() => instance.execute_serialized_action(action)}>
			{ACTION_TYPE_TO_CTA[action.type]}
		</button>
	)
}

const ActionButton = with_game_instance(ActionButtonBase)

export {
	ActionButton,
}
