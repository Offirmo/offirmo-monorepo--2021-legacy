/*
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
*/

import React from 'react'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
const game_instance = get_game_instance()


const ActionButtonC1M = React.memo(
	function ActionButtonC1({ action }) {
		return (
			<View
				action={action}
				onClick={() => game_instance.reducers.execute_serialized_action(action)}
			/>
		)
	}
)

export default ActionButtonC1M
