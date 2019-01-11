import React from 'react'

import { GameContextConsumerListener } from '../../../game-context'
import PanelView from './component'

export default props => (
	<GameContextConsumerListener>
		{game_instance => <PanelView {...props} game_instance={game_instance} />}
	</GameContextConsumerListener>
)
