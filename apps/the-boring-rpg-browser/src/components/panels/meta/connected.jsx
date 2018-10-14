import React from 'react'
import { withRouter } from 'react-router'

import { GameContextConsumerListener } from '../../../game-context'
import Component from './component'

const C1 = withRouter(Component)

export default props => (
	<GameContextConsumerListener>
		{game_instance => (
			<C1
				{...props}
				game_instance={game_instance}
			/>
		)}
	</GameContextConsumerListener>
)
