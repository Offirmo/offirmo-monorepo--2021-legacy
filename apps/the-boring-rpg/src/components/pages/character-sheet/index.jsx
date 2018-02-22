import React from 'react'

import { render_character_sheet } from '@oh-my-rpg/view-rich-text'
const { CHARACTER_CLASSES } = require('@oh-my-rpg/state-character')

import { Chat } from '../../templates/chat-interface'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'
import { with_game_instance } from '../../context/game-instance-provider'


class CharacterSheetBase extends React.Component {

	componentWillMount () {
		console.info('~~ CharacterSheetBase componentWillMount')
		this.props.instance.set_client_state(() => ({
			mode: 'inventory',
		}))
	}

	* gen_next_step() {
		console.info('~~ gen_next_step')
		const { instance } = this.props

		do {
			const steps = []
			const state = instance.get_latest_state()
			const ui_state = instance.get_client_state()
			console.log({ui_state, state})

			if (ui_state.character_changing_class) {
				steps.push({
					msg_main: 'Choose your path wisely:',
					choices: CHARACTER_CLASSES
						.filter(klass => klass !== 'novice')
						.map(klass => ({
							msg_cta: klass,
							value: klass,
							msgg_as_user: () => `I want to follow the path of the ${klass}!`,
							msgg_acknowledge: name => `You’ll make an amazing ${klass}.`,
							callback: value => {
								instance.change_avatar_class(value)
								instance.set_client_state(() => ({
									character_changing_class: false,
								}))
							}
						}))
				})
			}
			else if (ui_state.character_changing_name) {
				steps.push({
					type: 'ask_for_string',
					msg_main: `What’s your name?`,
					msgg_as_user: value => `My name is "${value}".`,
					msgg_acknowledge: name => `You are now known as ${name}!`,
					callback: value => {
						instance.rename_avatar(value)
						instance.set_client_state(() => ({
							character_changing_name: false,
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
								instance.set_client_state(() => ({
									character_changing_class: true,
								}))
							}
						},
						{
							msg_cta: 'Rename hero',
							value: 'r',
							msgg_as_user: () => 'Let’s fix my name…',
							callback: () => {
								instance.set_client_state(() => ({
									character_changing_name: true,
								}))
							}
						},
					],
				})
			}

			yield* steps
		} while (true)
	}

	componentDidMount() {
		console.info('~~ CharacterSheetBase componentDidMount')
		// subscribe to future state changes
		this.unsubscribe = this.props.instance.subscribe(() => this.forceUpdate())
	}
	componentWillUnmount () {
		console.info('~~ CharacterSheetBase componentWillUnmount', arguments)
		this.unsubscribe()
	}

	render() {
		const { instance } = this.props
		const state = instance.get_latest_state()
		const doc = render_character_sheet(state.avatar)

		return (
			<div className={'page page--character'}>
				<div className='page-top-content flex-element-nogrow'>
					{rich_text_to_react(doc)}
					<hr/>
				</div>
				<div className='flex-element-grow overflow-y⁚auto'>
					<Chat gen_next_step={this.gen_next_step()} />
				</div>
			</div>
		)
	}
}

const CharacterSheet = with_game_instance(CharacterSheetBase)


export {
	CharacterSheet,
}
