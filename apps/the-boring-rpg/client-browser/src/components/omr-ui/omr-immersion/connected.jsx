import React, { Component, Fragment } from 'react'

import { OhMyRPGUIContext } from '@oh-my-rpg/view-browser-react'

import rich_text_to_react from '../../../services/rich-text-to-react'

import View from './component'

import get_game_instance from '../../../services/game-instance-browser'
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


class Notifier extends Component {

	componentDidMount() {
		const { omr } = this.props

		omr.enqueueNotification({
			level: 'warning',
			children: <span className="warning">⚠ Warning! This game is alpha, your savegame may be lost at any time!</span>,
			position: 'top-center',
			auto_dismiss_delay_ms: 7000,
		})

		// update notification
		SEC.xTry('update last seen version', ({ VERSION: current_version }) => {
			const last_version_seen = localStorage.getItem(LS_KEYS.last_version_seen)
			if (current_version === last_version_seen) return
			omr.enqueueNotification({
				level: 'success',
				children: (
					<Fragment>
						🆕 You got a new version!
						Check the <a href={THE_BORING_RPG.changelog} target="_blank">new features</a>!
					</Fragment>
				),
				position: 'top-center',
				auto_dismiss_delay_ms: 7000,
			})
			localStorage.setItem(LS_KEYS.last_version_seen, current_version)
		})
	}

	render() {
		const { omr } = this.props
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

		return null
	}
}


export default () => (
	<OhMyRPGUIContext.Consumer>
		{omr => {
			console.log('🔄 OMR-UI immersion')

			const { mode } = game_instance.view.get_state()
			const { u_state } = game_instance.model.get_state()

			return (
				<Fragment>
					<Notifier omr={omr}/>
					<View
						mode={mode}
						background={BACKGROUNDS[u_state.progress.statistics.good_play_count % BACKGROUNDS.length]}
					/>
				</Fragment>
			)
		}}
	</OhMyRPGUIContext.Consumer>
)
