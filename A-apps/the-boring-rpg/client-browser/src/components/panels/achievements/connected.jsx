import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
import { UStateListenerAndProvider } from '../../../context'



const AchievementsPanelC1M = React.memo(
	function AchievementsPanelC1({u_state}) {
		const achievements_snapshot = get_game_instance().queries.get_achievements_snapshot()

		return (
			<View achievements_snapshot={achievements_snapshot} />
		)
	},
)


class AchievementsPanel extends Component {
	static propTypes = {
	}

	render_view = ({ u_state }) => {
		return (
			<AchievementsPanelC1M u_state={u_state} />
		)
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}

export default AchievementsPanel
