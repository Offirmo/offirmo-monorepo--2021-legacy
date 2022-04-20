import * as React from 'react'
import PropTypes from 'prop-types'
import { ActionType } from '@tbrpg/interfaces'
import get_sfx_sell_buy from '@tbrpg/audio-browser/src/sfx_sell_buy'

import get_game_instance from '../../../services/game-instance-browser'
import View from './component'


const ActionButtonC1 = React.memo(
	function ActionButtonC1({ action }) {
		return (
			<View
				action={action}
				onClick={() => {
					get_game_instance().commands.dispatch(action)
					switch (action.type) {
						case ActionType.sell_item:
							console.log({sfx_sell_buy: get_sfx_sell_buy()})
							get_sfx_sell_buy().play()
							break
						default:
							// no sfx for this action
							break
					}
				}}
			/>
		)
	},
)

export default ActionButtonC1
