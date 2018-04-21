import React from 'react'

import GameContext from '../../game-context'
import Component from './component'

export default props => (
	<GameContext.Consumer>
		{game_instance => {
			const { action } = props
			return (
				<Component
					{...props}
					onClick={() => game_instance.execute_serialized_action(action)}
				/>)
		}}
	</GameContext.Consumer>
)
