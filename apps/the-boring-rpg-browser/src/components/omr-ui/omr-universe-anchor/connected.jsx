import React from 'react'

import {GameContextConsumerListener} from '../../../game-context'
import OMRUniverseAnchor from './component'

export default props => (
	<GameContextConsumerListener>
		{game_instance => {
			const {avatar} = game_instance.model.get_state()
			return (
				<OMRUniverseAnchor
					{...props}
					name={avatar.name}
					klass={avatar.klass}
					level={avatar.attributes.level}
				/>)
		}}
	</GameContextConsumerListener>
)
