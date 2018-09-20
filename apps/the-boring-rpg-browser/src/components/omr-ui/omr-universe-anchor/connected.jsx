import React from 'react'

import {GameContextConsumerListener} from '../../../game-context'
import Component from './component'

export default props => (
	<GameContextConsumerListener>
		{game_instance => {
			const {avatar} = game_instance.get_latest_state()
			return (
				<Component
					{...props}
					name={avatar.name}
					klass={avatar.klass}
					level={avatar.attributes.level}
				/>)
		}}
	</GameContextConsumerListener>
)
