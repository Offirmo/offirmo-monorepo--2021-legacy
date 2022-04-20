import { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { render_character_sheet } from '@oh-my-rpg/view-rich-text'
import ErrorBoundary from '@offirmo-private/react-error-boundary'

import { is_likely_to_be_mobile } from '../../../services/mobile-detection'
import { Chat } from '../../utils/chat-interface'
import rich_text_to_react from '../../../services/rich-text-to-react'
import get_game_instance from '../../../services/game-instance-browser'

import '../index.css'
import './index.css'


function * gen_next_step() {
	const game_instance = get_game_instance()

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
			const view_state = game_instance.view.get()

			if (view_state.changing_character_class) {
				steps.push({
					msg_main: 'Choose your path wisely:',
					choices: get_game_instance().queries.get_available_classes()
						.map(klass => ({
							msg_cta: klass,
							value: klass,
							msgg_as_user: () => `I want to follow the path of the ${klass}!`,
							msgg_acknowledge: () => `You’ll make an amazing ${klass}.`,
							callback: value => {
								game_instance.commands.change_avatar_class(value)
								game_instance.view.set_state(() => ({
									changing_character_class: false,
								}))
								window.ga && window.ga('send', 'event', {
									eventCategory: 'game',
									eventAction: 'change_class',
									//eventValue: ...,
									//eventLabel: CTA,
									hitCallback: () => console.log('GA cc sent!'),
								})
							},
						})),
				})
			}
			else if (view_state.changing_character_name) {
				steps.push({
					type: 'ask_for_string',
					msg_main: 'What’s your name?',
					msgg_as_user: value => value
						? `My name is "${value}".`
						: 'Nevermind.',
					msgg_acknowledge: name => name
						? `You are now known as ${name}!`
						: 'Maybe another time.',
					callback: value => {
						console.log({value, type: typeof value})
						if (value)
							game_instance.commands.rename_avatar(value)
						game_instance.view.set_state(() => ({
							changing_character_name: false,
						}))
						window.ga && window.ga('send', 'event', {
							eventCategory: 'game',
							eventAction: 'rename_avatar',
							//eventValue: ...,
							//eventLabel: CTA,
							hitCallback: () => console.log('GA ra sent!'),
						})
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
							},
						},
						{
							msg_cta: 'Rename hero',
							value: 'r',
							msgg_as_user: () => 'Let’s fix my name…',
							callback: () => {
								game_instance.view.set_state(() => ({
									changing_character_name: true,
								}))
							},
						},
					],
				})
			}
		}

		yield* steps
	} while (true)
}


export default class CharacterPanelView extends PureComponent {
	static propTypes = {
		avatar: PropTypes.object.isRequired,
	}

	state = {
		mobile_keyboard_likely_present: false,
	}

	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 CharacterPanelView')

		const { avatar } = this.props

		return (
			<div className="tbrpg-panel tbrpg-panel--character o⋄flex--directionꘌcolumn">
				{this.state.mobile_keyboard_likely_present
					? '(temporarily hidden while you type on mobile)'
					: <div className="panel-top-content o⋄flex-element--nogrow o⋄bg-colorꘌbackdrop">
						{rich_text_to_react(render_character_sheet(avatar))}
					</div>}
				<div className="o⋄flex-element--grow o⋄overflow-yꘌauto">
					<ErrorBoundary name={'chat:character'}>
						<Chat
							gen_next_step={gen_next_step()}
							on_input_begin={() => {
								console.log('input start')
								this.setState(() => ({
									mobile_keyboard_likely_present: is_likely_to_be_mobile(),
								}))
							}}
							on_input_end={() => {
								console.log('input stop')
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
