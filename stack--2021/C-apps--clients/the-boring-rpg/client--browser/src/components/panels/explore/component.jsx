import * as React from 'react'
import PropTypes from 'prop-types'

import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { render_adventure } from '@oh-my-rpg/view-rich-text'

import { Chat } from '../../utils/chat-interface'
import rich_text_to_react from '../../../services/rich-text-to-react'
import get_game_instance from '../../../services/game-instance-browser'

import Infobox from './infobox'
import '../index.css'
import './index.css'



function * gen_next_step() {
	let game_instance = get_game_instance()

	do {
		const steps = []

		const engagement_msg = game_instance.queries.get_oldest_pending_flow_engagement()
		if (engagement_msg) {
			const { uid, $doc } = engagement_msg
			steps.push({
				type: 'simple_message',
				msg_main: rich_text_to_react($doc),
			})
			game_instance.commands.acknowledge_engagement_msg_seen(uid)
		}
		else {
			const ui_state = game_instance.view.get()
			const last_adventure = game_instance.queries.get_last_adventure()

			if (!ui_state.recap_displayed) {
				steps.push({
					type: 'simple_message',
					msg_main: rich_text_to_react(game_instance.queries.get_recap()),
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
				if (!last_adventure.good) {
					// https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
					try {
						if ('vibrate' in navigator)
							navigator.vibrate(200)
					}
					catch (err) {
						console.warn(`[optional] error when attempting to vibrate`, err)
					}
				}

				game_instance.view.set_state(() => ({
					last_displayed_adventure_uuid: last_adventure.uuid,
				}))
			}

			if (game_instance.queries.is_inventory_full()) {
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
				const CTA = 'Play! (-1⚡)'
				steps.push({
					msg_main: 'What do you want to do?',
					choices: [
						{
							msg_cta: CTA,
							value: 'play',
							msgg_as_user: () => 'Let’s go adventuring!',
							callback: () => {
								game_instance.commands.play()
								window.ga && window.ga('send', 'event', {
									eventCategory: 'game',
									eventAction: 'play',
									eventValue: game_instance.queries.get_last_adventure().good ? 1 : 0,
									eventLabel: CTA,
									hitCallback: () => console.log('GA play sent!'),
								})
							},
						},
					],
				})
			}
		}

		yield* steps
		game_instance = get_game_instance()
	} while (true)
}


export default class ExplorePanelView extends React.Component {
	static propTypes = {
		//view_state: PropTypes.object.isRequired,
	}

	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 ExplorePanelView')

		return (
			<div className="o⋄top-container tbrpg-panel tbrpg-panel--explore">
				<div key="chat">
					<div>
						<ErrorBoundary name={'chat:explore'}>
							<Chat
								initial_bubbles={[]}
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
