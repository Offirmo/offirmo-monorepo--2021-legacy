import React from 'react'
import PropTypes from 'prop-types'

import OMRUniverseAnchor from './component'

import get_game_instance from '../../../services/game-instance-browser'

export default props => {
	const avatar = get_game_instance().selectors.get_sub_state('avatar')
	return (
		<OMRUniverseAnchor
			{...props}
			name={avatar.name}
			klass={avatar.klass}
			level={avatar.attributes.level}
		/>)
}
