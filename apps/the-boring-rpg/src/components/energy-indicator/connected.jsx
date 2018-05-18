import React from 'react';

const { get_snapshot: get_energy_snapshot } = require('@oh-my-rpg/state-energy')

import {GameContextConsumerListener} from '../../game-context'
import Component from './component'

export default props => (
	<GameContextConsumerListener>
		{game_instance => {
			const state = game_instance.get_latest_state()
			const energy_snapshot = get_energy_snapshot(state.energy)
			return (
				<Component
					{...props}
					energy_snapshot={energy_snapshot}
					energy_state={state.energy}
				/>
			)
		}}
	</GameContextConsumerListener>
)
