import React from 'react'

import { with_game_instance } from '../../context/game-instance-provider'
import { ActionButton } from '../action-button'

function TBRPGElementBase({instance, state, children, uuid}) {

	const game_element = instance.find_element(uuid)
	console.log('TBRPGElementBase', game_element)
	const { mode } = instance.get_client_state()
	const actions = instance.get_actions_for_element(uuid).filter(action => !mode || (action.category === mode))

	/* todo switch*/

	return (
		<span className={'element'}>
			{children}
			{actions.map(action => {
				return <ActionButton key={action.type} action={action} />
			})}
		</span>
	)
}

const TBRPGElement = with_game_instance(TBRPGElementBase)

export {
	TBRPGElement,
}
