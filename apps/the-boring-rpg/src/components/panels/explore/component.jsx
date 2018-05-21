import React from 'react'

import { render_adventure } from '@oh-my-rpg/view-rich-text'
const { get_snapshot: get_energy_snapshot } = require('@oh-my-rpg/state-energy')

import { Chat } from '../../chat-interface'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'

const tbrpg = require('@oh-my-rpg/state-the-boring-rpg')

export default class Component extends React.Component {

	* gen_next_step() {
		const { game_instance, SEC } = this.props

		do {
			const steps = []
			const state = game_instance.get_latest_state()
			const ui_state = game_instance.get_client_state()
			const { last_adventure } = state
			const energy_snapshot = get_energy_snapshot(state.energy)

			if (!ui_state.alpha_warning_displayed) {
				yield {
					type: 'simple_message',
					msg_main: <span className="warning">⚠ Warning! This game is alpha, your savegame may be lost at any time!</span>,
				}
				game_instance.set_client_state(() => ({
					alpha_warning_displayed: true,
				}))
			}

			if (!ui_state.recap_displayed) {
				steps.push({
					type: 'simple_message',
					msg_main: rich_text_to_react(tbrpg.get_recap(state)),
				})
				game_instance.set_client_state(() => ({
					recap_displayed: true,
				}))
			}

			if (last_adventure && last_adventure.uuid !== ui_state.last_displayed_adventure_uuid) {
				if (last_adventure.good)
					steps.push({
						type: 'progress',
						duration_ms: 1000,
						msg_main: `Exploring…`,
						msgg_acknowledge: () => 'Encountered something:\n',
					})

				const { good_click_count } = state
				//console.log({ good_click_count, last_adventure })
				const $doc = render_adventure(last_adventure)
				//{`Episode #${good_click_count}:`}<br />
				steps.push({
					type: 'simple_message',
					msg_main: (
						<div>
							{rich_text_to_react($doc)}
						</div>
					),
				})

				game_instance.set_client_state(() => ({
					last_displayed_adventure_uuid: last_adventure.uuid,
				}))
			}

			let tip_doc = tbrpg.get_tip(state)
			if (tip_doc) {
				steps.push({
					type: 'simple_message',
					msg_main: rich_text_to_react(tip_doc),
				})
			}

			let CTA =`Play! ⚡${energy_snapshot.available_energy}/${state.energy.max_energy}`
			if (energy_snapshot.human_time_to_next)
				CTA += ` (next in ${energy_snapshot.human_time_to_next})`
			steps.push({
				msg_main: `What do you want to do?`,
				choices: [
					{
						msg_cta: CTA,
						value: 'play',
						msgg_as_user: () => 'Let’s go adventuring!',
						callback: () => {
							game_instance.play()
						},
					},
					/*{
						msg_cta: 'Manage Inventory (equip, sell…)',
						value: 'inventory',
						msgg_as_user: () => 'Let’s sort out my stuff.',
						msgg_acknowledge: () => `Sure.`,
					},
					{
						msg_cta: 'Manage Character (rename, change class…)',
						value: 'character',
						msgg_as_user: () => 'Let’s see how I’m doing!',
					},
					{
						msg_cta: 'Manage other stuff…',
						value: 'meta',
						msgg_as_user: () => 'Let’s see how I’m doing!',
					},*/
				],
			})

			yield* steps
		} while (true)
	}

	render() {
		const { game_instance } = this.props
		const client_state = game_instance.get_client_state()
		return (
			<div className={'o⋄top-container tbrpg-panel'}>
				<Chat
					initial_bubbles={client_state.home_bubbles}
					gen_next_step={this.gen_next_step()}
					on_unmount={(bubbles) => {
						game_instance.set_client_state(() => ({
							home_bubbles: bubbles,
						}))
					}}
				/>
			</div>
		)
	}
}
