import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { OhMyRPGUIContext } from '@oh-my-rpg/view-browser-react'

import rich_text_to_react from '../../../services/rich-text-to-react'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
import OMRUINotifier from '../notifier'

import SEC from "../../../services/sec";
import {LS_KEYS} from "../../../services/consts";
import {THE_BORING_RPG} from "@offirmo/marketing-rsrc";

const game_instance = get_game_instance()

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

export default () => (
	<OhMyRPGUIContext.Consumer>
		{omr => {
			console.log('🔄 OMR-UI immersion')

			const { mode } = game_instance.view.get_state()
			const { good_play_count } = get_game_instance()
				.selectors.get_sub_state('progress')
				.statistics

			return (
				<Fragment>
					<OMRUINotifier enqueueNotification={omr.enqueueNotification}/>
					<View
						mode={mode}
						background={BACKGROUNDS[good_play_count % BACKGROUNDS.length]}
					/>
				</Fragment>
			)
		}}
	</OhMyRPGUIContext.Consumer>
)
