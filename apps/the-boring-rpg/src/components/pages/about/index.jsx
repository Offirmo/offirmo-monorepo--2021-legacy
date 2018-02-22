import React from 'react'

import * as RichText from '@offirmo/rich-text-format'
import {
	SCHEMA_VERSION,
	GAME_VERSION,
	URL_OF_PRODUCT_HUNT_PAGE,
	URL_OF_REPO,
	URL_OF_FORK,
	URL_OF_ISSUES,
	URL_OF_REDDIT_PAGE,
} from '@oh-my-rpg/state-the-boring-rpg'

import { VERSION, BUILD_DATE, CHANNEL } from '../../../services/consts'
import { Chat } from '../../templates/chat-interface'
import { with_game_instance } from '../../context/game-instance-provider'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'


function render_meta(state) {
	const $doc_list_builder = RichText.unordered_list()
	$doc_list_builder.pushRawNode(
		RichText.span().pushText(`Play count: ${state.good_click_count}`).done(),
		'01-playcount'
	)
	$doc_list_builder.pushRawNode(
		RichText.span().pushText(`Game version: ${VERSION}`).done(),
		'02-version'
	)
	$doc_list_builder.pushRawNode(
		RichText.span().pushText(`Build date (UTC): ${BUILD_DATE}`).done(),
		'03-builddate'
	)
	$doc_list_builder.pushRawNode(
		RichText.span().pushText(`Release channel: ${CHANNEL}`).done(),
		'04-channel'
	)
	$doc_list_builder.pushRawNode(
		RichText.span().pushText(`Exec env: ${ENV}`).done(),
		'05-env'
	)
	$doc_list_builder.pushRawNode(
		RichText.span().pushText(`Engine version: ${GAME_VERSION}`).done(),
		'06-engine'
	)
	$doc_list_builder.pushRawNode(
		RichText.span().pushText(`Savegame version: ${SCHEMA_VERSION}`).done(),
		'07-savegame'
	)

	const $doc = RichText.span()
		.pushNode(RichText.heading().pushText('Client infos:').done(), 'header')
		.pushNode($doc_list_builder.done(), 'list')
		.done()

	return $doc
}

class AboutBase extends React.Component {

	componentWillMount () {
		console.info('~~ AboutBase componentWillMount')
		this.props.instance.set_client_state(() => ({
			mode: 'about',
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

			steps.push({
				msg_main: `What do you want to do?`,
				msgg_acknowledge: url => <span>Now opening <a href={url} target="_blank">{url}</a></span>,
				callback: url => window.open(url, '_blank'),
				choices: [
					{
						msg_cta: <span>
							★ star on
							<span className='bg-white fg-black'> GitHub </span>
						</span>,
						value: URL_OF_REPO,
						msgg_as_user: () => 'You’re awesome…',
					},
					{
						msg_cta: '👍 like on reddit',
						value: URL_OF_REDDIT_PAGE,
						msgg_as_user: () => 'You’re awesome…',
					},
					{
						msg_cta: <span>
							⇧ upvote on
							<span className='bg-red fg-white'> Product Hunt </span>
						</span>,
						value: URL_OF_PRODUCT_HUNT_PAGE,
						msgg_as_user: () => 'You’re awesome…',
					},
					{
						msg_cta: 'Fork on GitHub 🐙 😹',
						value: URL_OF_FORK,
						msgg_as_user: () => 'I’d like to contribute!',
					},
					{
						msg_cta: 'Report a bug 🐞',
						value: URL_OF_ISSUES,
						msgg_as_user: () => 'There is this annoying bug…',
					},
					{
						msg_cta: 'Reload page ↻',
						value: 'reload',
						msgg_as_user: () => 'Because I need it',
						msgg_acknowledge: () => `Reloading...`,
						callback: () => new Promise(() => window.location.reload()),
					},
					{
						msg_cta: 'Reset your savegame 💀',
						value: 'reset',
						msgg_as_user: () => 'I want to start over…',
						msgg_acknowledge: () => 'Are you serious?',
						callback: () => new Promise((resolve, reject) => {
							if (!window.confirm('💀 Do you really really want to reset your savegame, loose all progression and start over?'))
								return resolve(false)

							instance.reset_all()
							window.location.reload()
							// no resolution, to give the page time to reload
						})
					},
				],
			})

			yield* steps
		} while (true)
	}

	componentDidMount() {
		console.info('~~ AboutBase componentDidMount')
		// subscribe to future state changes
		this.unsubscribe = this.props.instance.subscribe(() => this.forceUpdate())
	}
	componentWillUnmount () {
		console.info('~~ AboutBase componentWillUnmount', arguments)
		this.unsubscribe()
	}

	render() {
		const { instance } = this.props
		const state = instance.get_latest_state()

		return (
			<div className={'page page--about'}>
				<div className='page-top-content flex-element-nogrow'>
					{rich_text_to_react(render_meta(state))}
					<hr/>
				</div>
				<div className='flex-element-grow overflow-y⁚auto'>
					<Chat gen_next_step={this.gen_next_step()} />
				</div>
			</div>
		)
	}
}

const About = with_game_instance(AboutBase)

export {
	About,
}
