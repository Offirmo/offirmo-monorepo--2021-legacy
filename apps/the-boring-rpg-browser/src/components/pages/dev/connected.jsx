import React from 'react'

import { GameContextConsumerListener } from '../../../game-context'
import Dev from './component'

export default () => (
	<GameContextConsumerListener>
		{game_instance => <Dev game_instance={game_instance} />}
	</GameContextConsumerListener>
)
