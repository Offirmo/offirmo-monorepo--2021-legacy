import React, { Component } from 'react'
import PropTypes from 'prop-types'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
import { UStateListenerAndProvider } from '../../../context'



class AchievementsPanel extends Component {
	render_view = (u_state) => {
		const achievements_snapshot = get_game_instance().selectors.get_achievements_snapshot()

		return (
			<View achievements_snapshot={achievements_snapshot} />
		)
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}

export default AchievementsPanel
