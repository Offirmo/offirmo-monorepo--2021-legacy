import React from 'react'

import { OhMyRPGUIContext } from '@oh-my-rpg/view-browser-react'

import {GameContextConsumerListener} from '../../../game-context'
import Component from './component'

const BACKGROUNDS = [
	'ancient-castle',
	'desert',
	'lost_castle',
	'cabin_in_cave',
	'castle_phantom',
	'civilization',
	'half_remembered_ruins',
	'snowcapped_environment',
	'north_country',
	'city_gates',
	'return_of_the_knight',
	'fields_of_gold',
	'journey_to_the_center_of_the_earth',
]

export default props => (
	<OhMyRPGUIContext.Consumer>
		{omr => (
			<GameContextConsumerListener>
				{game_instance => {
					const {mode} = game_instance.get_client_state()
					const state = game_instance.get_latest_state()

					return (
						<Component
							{...props}
							omr={omr}
							mode={mode}
							background={BACKGROUNDS[state.good_click_count % BACKGROUNDS.length]}
						/>)
				}}
			</GameContextConsumerListener>
		)}
	</OhMyRPGUIContext.Consumer>

)
