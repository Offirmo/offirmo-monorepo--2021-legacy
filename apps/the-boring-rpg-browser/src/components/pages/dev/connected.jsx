import React from 'react'

import { GameContextConsumerListener } from '../../../game-context'
import Component from './component'

export default () => (
	<GameContextConsumerListener>
		{game_instance => <Component game_instance={game_instance} />}
	</GameContextConsumerListener>
)
