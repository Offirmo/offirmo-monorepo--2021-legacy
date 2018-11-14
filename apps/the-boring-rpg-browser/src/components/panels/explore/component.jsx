import React from 'react'

import ErrorBoundary from '@offirmo/react-error-boundary'
import { render_adventure } from '@oh-my-rpg/view-rich-text'
const { get_snapshot: get_energy_snapshot } = require('@oh-my-rpg/state-energy')

import { Chat } from '../../utils/chat-interface'
//import PlayButton from '../../play-button'
import rich_text_to_react from '../../../services/rich-text-to-react'

const tbrpg = require('@oh-my-rpg/state-the-boring-rpg')

export default class Component extends React.Component {

	* gen_next_step() {
		const { game_instance } = this.props

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
				const {last_adventure} = state
				const energy_snapshot = get_energy_snapshot(state.energy)

				if (!ui_state.recap_displayed) {
					steps.push({
						type: 'simple_message',
						msg_main: rich_text_to_react(tbrpg.get_recap(state)),
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

				if (tbrpg.is_inventory_full(state)) {
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
					let CTA = `Play! ⚡${energy_snapshot.available_energy}/${state.energy.max_energy}`
					if (energy_snapshot.human_time_to_next)
						CTA += ` (next in ${energy_snapshot.human_time_to_next})`
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

	render() {
		const { game_instance } = this.props
		const view_state = game_instance.view.get_state()
		return (
			<div className={'o⋄top-container tbrpg-panel'}>
				<ErrorBoundary name={'chat:explore'}>
					<Chat
						initial_bubbles={view_state.home_bubbles}
						gen_next_step={this.gen_next_step()}
						on_unmount={(bubbles) => {
							game_instance.view.set_state(() => ({
								home_bubbles: bubbles,
							}))
						}}
					/>
				</ErrorBoundary>
			</div>
		)
	}
}
