import React from 'react'

import { with_game_instance } from '../context/game-instance-provider'

function ActionButtonBase({instance, state, action}) {
	return (
		<button className={'action-btn'}>
			{action.type}
		</button>
	)
}

const ActionButton = with_game_instance(ActionButtonBase)

export {
	ActionButton,
}
