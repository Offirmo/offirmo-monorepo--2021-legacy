import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { OhMyRPGUIContext } from '@oh-my-rpg/view-browser-react'

import { AppStateContext } from '../../../context'
import get_game_instance from '../../../services/game-instance-browser'
import OMRUINotifier from '../notifier'
import View from './component'



const BACKGROUNDS = [
	'ancient-castle',
	'desert',
	'lost_castle',
	'cabin_in_cave',
	'castle_phantom',
	'city_gates',
	'civilization',
	'dmitry-kremiansky-a_secret_place_alps',
	'dmitry-kremiansky-street',
	'dmitry-kremiansky-depth_needed',
	'dmitry-kremiansky-ship',
	'fields_of_gold',
	'gnomon',
	'gothic_choir',
	'half_remembered_ruins',
	'journey_to_the_center_of_the_earth',
	'jungle',
	'return_of_the_knight',
	'north_country',
	'cloud_city_palace',
	'cloud_city',
	'kvasir_fortress',
	'barren_landscape',
	'lost_island',
	'monoliths',
	'snowcapped_environment',
	'viking_ambush',
]

function render_c2(app_state) {
	//console.log('🔄 OMR-UI immersion c2')

	const { mode } = get_game_instance().view.get_state()
	const { good_play_count } = get_game_instance()
		.selectors.get_sub_state('progress')
		.statistics

	return (
		<View
			mode={mode}
			background={BACKGROUNDS[good_play_count % BACKGROUNDS.length]}
		/>
	)
}

function render_c1(omr) {
	//console.log('🔄 OMR-UI immersion c1')

	return (
		<Fragment>
			<OMRUINotifier enqueueNotification={omr.enqueueNotification}/>
			<AppStateContext.Consumer>
				{render_c2}
			</AppStateContext.Consumer>
		</Fragment>
	)
}

export default () => (
	<OhMyRPGUIContext.Consumer>
		{render_c1}
	</OhMyRPGUIContext.Consumer>
)
