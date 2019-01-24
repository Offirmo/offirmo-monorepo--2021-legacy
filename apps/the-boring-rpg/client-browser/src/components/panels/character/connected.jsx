import React from 'react'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'


export default function CharacterPanel() {
	const { u_state: { avatar } } = get_game_instance().model.get_state()

	return (
		<View avatar={avatar} />
	)
}
