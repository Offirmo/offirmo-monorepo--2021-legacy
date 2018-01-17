import React from 'react'

import { with_game_instance } from '../../context/game-instance-provider'

function TBRPGElementBase({instance, state, children, uuid}) {
	console.log('TBRPGElementBase', state)

	return (
		<span>
			{children}
		</span>
	)
}

const TBRPGElement = with_game_instance(TBRPGElementBase)

export {
	TBRPGElement,
}
