import React from 'react'

const { CHARACTER_CLASSES } = require('@oh-my-rpg/state-character')
import { render_character_sheet } from '@oh-my-rpg/view-rich-text'

import { is_likely_to_be_mobile } from '../../../services/mobile-detection'
import { Chat } from '../../utils/chat-interface'
import rich_text_to_react from '../../../services/rich-text-to-react'
import './index.css'
import ErrorBoundary from '@offirmo/react-error-boundary'


export default class PanelView extends React.Component {
	state = {
		mobile_keyboard_likely_present: false,
	};

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
				//const state = game_instance.model.get_state()
				const view_state = game_instance.view.get_state()
				//console.log({view_state, state})

				if (view_state.changing_character_class) {
					steps.push({
						msg_main: 'Choose your path wisely:',
						choices: CHARACTER_CLASSES
							.filter(klass => klass !== 'novice')
							.map(klass => ({
								msg_cta: klass,
								value: klass,
								msgg_as_user: () => `I want to follow the path of the ${klass}!`,
								msgg_acknowledge: () => `You’ll make an amazing ${klass}.`,
								callback: value => {
									game_instance.reducers.change_avatar_class(value)
									game_instance.view.set_state(() => ({
										changing_character_class: false,
									}))
								}
							}))
					})
				}
				else if (view_state.changing_character_name) {
					steps.push({
						type: 'ask_for_string',
						msg_main: `What’s your name?`,
						msgg_as_user: value => value
							? `My name is "${value}".`
							: 'Nevermind.',
						msgg_acknowledge: name => name
							? `You are now known as ${name}!`
							: 'Maybe another time.',
						callback: value => {
							console.log({value, type: typeof value})
							if (value)
								game_instance.reducers.rename_avatar(value)
							game_instance.view.set_state(() => ({
								changing_character_name: false,
							}))
						},
					})
				}
				else {
					steps.push({
						msg_main: 'What do you want to do?',
						choices: [
							{
								msg_cta: 'Change class',
								value: 'c',
								msgg_as_user: () => 'I want to follow the path of…',
								callback: () => {
									game_instance.view.set_state(() => ({
										changing_character_class: true,
									}))
								}
							},
							{
								msg_cta: 'Rename hero',
								value: 'r',
								msgg_as_user: () => 'Let’s fix my name…',
								callback: () => {
									game_instance.view.set_state(() => ({
										changing_character_name: true,
									}))
								}
							},
						],
					})
				}
			}

			yield* steps
		} while (true)
	}

	render() {
		console.log('Character is refreshing')
		const { game_instance } = this.props
		const state = game_instance.model.get_state()

		return (
			<div className={'tbrpg-panel tbrpg-panel--character o⋄flex--column'}>
				{this.state.mobile_keyboard_likely_present
					? '(temporarily hidden while you type on mobile)'
					: <div className='panel-top-content o⋄flex-element--nogrow'>
						{rich_text_to_react(render_character_sheet(state.avatar))}
					</div>}
				<div className='o⋄flex-element--grow o⋄overflow-y⁚auto'>
					<ErrorBoundary name={'chat:character'}>
						<Chat
							gen_next_step={this.gen_next_step()}
							on_input_begin={() => {
								console.log('input start')
								this.setState(() => ({
									mobile_keyboard_likely_present: is_likely_to_be_mobile(),
								}))
							}}
							on_input_end={() => {
								console.log('unput stop')
								this.setState(() => ({
									mobile_keyboard_likely_present: false,
								}))
							}}
						/>
					</ErrorBoundary>
				</div>
			</div>
		)
	}
}
