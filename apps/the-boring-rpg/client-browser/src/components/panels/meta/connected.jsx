import React from 'react'
import { withRouter } from 'react-router'

import { GameContextConsumerListener } from '../../../game-context'
import PanelView from './component'

const PanelViewWithRouter = withRouter(PanelView)

export default props => (
	<GameContextConsumerListener>
		{game_instance => (
			<PanelViewWithRouter
				{...props}
				game_instance={game_instance}
			/>
		)}
	</GameContextConsumerListener>
)
