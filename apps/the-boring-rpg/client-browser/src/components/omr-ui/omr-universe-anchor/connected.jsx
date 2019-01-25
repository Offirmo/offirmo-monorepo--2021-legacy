import React from 'react'
import PropTypes from 'prop-types'

import OMRUniverseAnchor from './component'

import get_game_instance from '../../../services/game-instance-browser'
const game_instance = get_game_instance()

export default props => {
	const { u_state: {avatar}} = game_instance.model.get_state()
	return (
		<OMRUniverseAnchor
			{...props}
			name={avatar.name}
			klass={avatar.klass}
			level={avatar.attributes.level}
		/>)
}
