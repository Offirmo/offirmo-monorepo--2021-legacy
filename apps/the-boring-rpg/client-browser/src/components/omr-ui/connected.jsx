import React from 'react'
import PropTypes from 'prop-types'

import OhMyRPGView from './component'

import get_game_instance from '../../services/game-instance-browser'
const game_instance = get_game_instance()

export default props => {
	const { mode } = game_instance.view.get_state()
	const avatar_name = game_instance.model.get_state().u_state.avatar.name

	return (
		<OhMyRPGView
			mode={mode}
			avatar_name={avatar_name}
			game_instance={game_instance}
		/>
	)
}
