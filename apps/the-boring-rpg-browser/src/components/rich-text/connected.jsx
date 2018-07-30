import React from 'react'

import { GameContextConsumerListener } from '../../game-context'
import Component from './component'

export default props => (
	<GameContextConsumerListener>
		{game_instance => {
			const { uuid } = props
			const game_element = game_instance.find_element(uuid)
			//console.log('TBRPGElement', game_element)
			const { mode } = game_instance.get_client_state()
			const actions = game_instance.get_actions_for_element(uuid)
				.filter(action => !mode || (action.category === mode))

			return (
				<Component
					{...props}
					actions={actions}
				/>)
		}}
	</GameContextConsumerListener>
)
