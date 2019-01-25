import React from 'react'
import PropTypes from 'prop-types'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
import { UStateProvider } from '../../../context'


function render() {
	const achievements_snapshot = get_game_instance().selectors.get_achievements_snapshot()

	return (
		<View achievements_snapshot={achievements_snapshot} />
	)
}

export default function AchievementsPanel() {

	return (
		<UStateProvider>
			{render}
		</UStateProvider>
	)
}
