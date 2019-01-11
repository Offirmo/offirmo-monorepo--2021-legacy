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

import get_game_instance from '../../../services/game-instance-browser'
import ActionButtonView from './component'


const game_instance = get_game_instance()


const ActionButton = React.memo(
	function ActionButtonC1({ action }) {
		console.log('🔄 ActionButton', action)

		return (
			<ActionButtonView
				action={action}
				onClick={() => game_instance.reducers.execute_serialized_action(action)}
			/>
		)
	}
)

export default ActionButton
