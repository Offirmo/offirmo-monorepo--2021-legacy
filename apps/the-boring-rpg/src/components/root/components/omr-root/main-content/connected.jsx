import React from 'react';

import {GameContextConsumerListener} from '../../../../../game-context'
import Component from './component'

export default props => (
	<GameContextConsumerListener>
		{game_instance => {
			const {mode} = game_instance.get_client_state()

			return (
				<Component
					{...props}
					mode={mode}
				/>)
		}}
	</GameContextConsumerListener>
)
