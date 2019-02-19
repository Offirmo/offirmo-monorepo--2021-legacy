import React from 'react'
import PropTypes from 'prop-types'

import get_game_instance from '../../../services/game-instance-browser'
import View from './component'


const ActionButtonC1 = React.memo(
	function ActionButtonC1({ action }) {
		return (
			<View
				action={action}
				onClick={() => get_game_instance().commands.dispatch(action)}
			/>
		)
	}
)

export default ActionButtonC1
