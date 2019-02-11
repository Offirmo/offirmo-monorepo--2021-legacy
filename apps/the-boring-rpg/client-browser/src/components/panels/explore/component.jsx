import React from 'react'
import PropTypes from 'prop-types'

import ErrorBoundary from '@offirmo/react-error-boundary'
import { render_adventure } from '@oh-my-rpg/view-rich-text'
import * as tbrpg from '@tbrpg/state'

import { Chat } from '../../utils/chat-interface'
import rich_text_to_react from '../../../services/rich-text-to-react'
import get_game_instance from '../../../services/game-instance-browser'

import Infobox from './infobox'
import '../index.css'
import './index.css'



function * gen_next_step() {
	const game_instance = get_game_instance()

	do {
		const steps = []

		const engagement_msg = game_instance.selectors.get_oldest_pending_flow_engagement()
		if (engagement_msg) {
			const { uid, $doc } = engagement_msg
			steps.push({
				type: 'simple_message',
				msg_main: rich_text_to_react($doc),
			})
			game_instance.reducers.acknowledge_engagement_msg_seen(uid)
		}
		else {
			const state = game_instance.model.get_state()
			const ui_state = game_instance.view.get_state()
			const last_adventure = game_instance.selectors.get_last_adventure()

			if (!ui_state.recap_displayed) {
				steps.push({
					type: 'simple_message',
					msg_main: rich_text_to_react(get_game_instance().selectors.get_recap()),
				})
				game_instance.view.set_state(() => ({
					recap_displayed: true,
				}))
			}

			if (last_adventure && last_adventure.uuid !== ui_state.last_displayed_adventure_uuid) {
				if (last_adventure.good)
					steps.push({
						type: 'progress',
						duration_ms: 1000,
						msg_main: 'Exploring…',
						msgg_acknowledge: () => 'Encountered something:\n',
					})

				const $doc = render_adventure(last_adventure)
				steps.push({
					type: 'simple_message',
					msg_main: (
						<div>
							{rich_text_to_react($doc)}
						</div>
					),
				})

				game_instance.view.set_state(() => ({
					last_displayed_adventure_uuid: last_adventure.uuid,
				}))
			}

			if (game_instance.selectors.is_inventory_full()) {
				steps.push({
					msg_main: 'Your inventory is full! You can’t play until you make some space.',
					choices: [
						{
							msg_cta: 'Manage Inventory (equip, sell…)',
							value: 'inventory',
							msgg_as_user: () => 'Let’s sort out my stuff.',
							callback: () => game_instance.view.set_state(() => ({mode: 'inventory'})),
						},
					],
				})
			}
			else {
				let CTA = `Play! (-1⚡)`
				steps.push({
					msg_main: 'What do you want to do?',
					choices: [
						{
							msg_cta: CTA,
							value: 'play',
							msgg_as_user: () => 'Let’s go adventuring!',
							callback: () => {
								game_instance.reducers.play()
							},
						},
					],
				})
			}
		}

		yield* steps
	} while (true)
}


export default class ExplorePanelView extends React.Component {
	static propTypes = {
		//view_state: PropTypes.object.isRequired,
	}

	render() {
		console.log('🔄 ExplorePanelView')

		//const { view_state } = this.props
		const view_state = {} // TODO clean

		return (
			<div className="o⋄top-container tbrpg-panel tbrpg-panel--explore">
				<div key="chat">
					<div>
						<ErrorBoundary name={'chat:explore'}>
							<Chat
								initial_bubbles={view_state.home_bubbles}
								gen_next_step={gen_next_step()}
								on_unmount={(bubbles) => {
									/*get_game_instance().view.set_state(() => ({
										home_bubbles: bubbles,
									}))*/
								}}
							/>
						</ErrorBoundary>
					</div>
				</div>
				<div key="energy-indicator">
					<Infobox />
				</div>
			</div>
		)
	}
}
