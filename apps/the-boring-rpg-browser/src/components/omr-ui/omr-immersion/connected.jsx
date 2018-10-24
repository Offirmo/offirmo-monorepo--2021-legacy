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
	'city_gates',
	'civilization',
	'fields_of_gold',
	'gnomon',
	'half_remembered_ruins',
	'snowcapped_environment',
	'north_country',
	'return_of_the_knight',
	'journey_to_the_center_of_the_earth',
]

export default props => (
	<OhMyRPGUIContext.Consumer>
		{omr => (
			<GameContextConsumerListener>
				{game_instance => {
					const {mode} = game_instance.view.get_state()
					const state = game_instance.model.get_state()

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
