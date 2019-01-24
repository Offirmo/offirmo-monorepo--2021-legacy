import React from 'react'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'


export default function InventoryPanel() {
	const { u_state: { inventory, wallet } } = get_game_instance().model.get_state()

	return (
		<View inventory={inventory} wallet={wallet} />
	)
}
