import React from 'react'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
const game_instance = get_game_instance()


const AchievementsPanelC1M = React.memo(
	function AchievementsPanelC1({u_state}) {
		const achievements_snapshot = game_instance.selectors.get_achievements_snapshot()

		return (
			<View achievements_snapshot={achievements_snapshot} />
		)
	}
)

export default function AchievementsPanelC2() {
	const { u_state } = game_instance.model.get_state()

	return (
		<AchievementsPanelC1M u_state={u_state} />
	)
}
