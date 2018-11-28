import React from 'react'

import GameContext from '../../../game-context'
import ActionButtonP from './component'

export default props => (
	<GameContext.Consumer>
		{game_instance => {
			const { action } = props
			return (
				<ActionButtonP
					{...props}
					onClick={() => game_instance.reducers.execute_serialized_action(action)}
				/>)
		}}
	</GameContext.Consumer>
)
