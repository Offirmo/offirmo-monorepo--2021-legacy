import React from 'react'

import { GameContextConsumerListener } from '../../game-context'
import OhMyRPGView from './component'

export default props => (
	<GameContextConsumerListener>
		{game_instance => {
			return (
				<OhMyRPGView
					{...props}
					game_instance={game_instance}
				/>
			)
		}}
	</GameContextConsumerListener>
)
