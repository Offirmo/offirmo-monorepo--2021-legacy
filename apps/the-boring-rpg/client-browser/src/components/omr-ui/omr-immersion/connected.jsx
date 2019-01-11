import React, { Fragment } from 'react'

import { OhMyRPGUIContext } from '@oh-my-rpg/view-browser-react'

import rich_text_to_react from '../../../services/rich-text-to-react'
import {GameContextConsumerListener} from '../../../game-context'

import Component from './component'
import {VERSION} from '../../../services/build'

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

export default props => (
	<OhMyRPGUIContext.Consumer>
		{omr => (
			<GameContextConsumerListener>
				{game_instance => {
					console.log('🔄 OMR-UI immersion')

					const {mode} = game_instance.view.get_state()
					const state = game_instance.model.get_state()

					let pending_non_flow_engagement
					do {
						pending_non_flow_engagement = game_instance.selectors.get_oldest_pending_non_flow_engagement()
						if (pending_non_flow_engagement) {
							const { uid, $doc, pe } = pending_non_flow_engagement
							console.info('Dequeing engagement: ', {uid, $doc, pe, pending_non_flow_engagement})
							const type = pe.engagement.type
							switch(type) {
								case 'aside': {
									const level = pe.params.semantic_level || 'info'
									const auto_dismiss_delay_ms = pe.params.auto_dismiss_delay_ms || 0
									omr.enqueueNotification({
										level,
										children: rich_text_to_react($doc),
										position: 'bottom-center',
										auto_dismiss_delay_ms,
									})
									break
								}
								case 'warning': {
									const level = pe.params.semantic_level || 'warning'
									const auto_dismiss_delay_ms = pe.params.auto_dismiss_delay_ms || 0
									omr.enqueueNotification({
										level,
										children: rich_text_to_react($doc),
										position: 'top-center',
										auto_dismiss_delay_ms,
									})
									break
								}
								default:
									throw new Error(`Engagement type not recognized: "${type}"!`)
							}
							game_instance.reducers.acknowledge_engagement_msg_seen(uid)
						}
					} while(pending_non_flow_engagement)

					return (
						<Component
							{...props}
							omr={omr}
							mode={mode}
							background={BACKGROUNDS[state.progress.statistics.good_play_count % BACKGROUNDS.length]}
						/>)
				}}
			</GameContextConsumerListener>
		)}
	</OhMyRPGUIContext.Consumer>

)
