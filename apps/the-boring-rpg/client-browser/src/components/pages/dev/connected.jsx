import React from 'react'
import PropTypes from 'prop-types'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
const game_instance = get_game_instance()


const PageDev = React.memo(
	function PageDevC1() {
		console.log('🔄 PageDevC1')

		const state = game_instance.model.get_state()
		const view_state = game_instance.view.get_state()

		return (
			<View
				state={state}
				view_state={view_state}
			/>
		)
	}
)

export default PageDev
