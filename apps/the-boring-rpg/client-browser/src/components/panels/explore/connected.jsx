import React from 'react'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'


export default function ExplorePanel() {
	const view_state = get_game_instance().view.get_state()

	return (
		<View view_state={view_state} />
	)
}
