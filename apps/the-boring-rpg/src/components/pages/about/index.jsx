import React from 'react'

import * as RichText from '@offirmo/rich-text-format'
import { SCHEMA_VERSION, GAME_VERSION } from '@oh-my-rpg/state-the-boring-rpg'

import { VERSION, BUILD_DATE, CHANNEL } from '../../../services/consts'
import { Chat } from '../../templates/chat-interface'
import { with_game_instance } from '../../context/game-instance-provider'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'


class AboutBase extends React.Component {

	componentWillMount () {
		console.info('~~ AboutBase componentWillMount')
		this.props.instance.set_client_state(client_state => ({
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
				choices: [
					{
						msg_cta: 'Visit game official website',
						value: URL_OF_WEBSITE,
						msgg_as_user: () => 'Let’s have a look…',
					},
					{
						msg_cta: `💰 Reward the game author with a ${stylize_string.bgRed(
							stylize_string.white(' npm ')
						)} star ★`,
						value: URL_OF_NPM_PAGE,
						msgg_as_user: () => 'You’re awesome…',
					},
					{
						msg_cta: `💰 Reward the game author with a ${stylize_string.bgWhite(
							stylize_string.black(' GitHub ')
						)} star ★`,
						value: URL_OF_REPO,
						msgg_as_user: () => 'You’re awesome…',
					},
					/*{
                       msg_cta: 'Reward the game author with a reddit like 👍',
                       value: URL_OF_REDDIT_PAGE,
                       msgg_as_user: () => 'You’re awesome…',
                   },*/
					{
						msg_cta: `💰 Reward the game author with a ${stylize_string.bgRed(
							stylize_string.white(' Product Hunt ')
						)} upvote ⇧`,
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
						msg_cta: 'Reset your savegame 💀',
						value: 'reset',
						msgg_as_user: () => 'I want to start over…',
						msgg_acknowledge: url => `You can't be serious?`,
						callback: () => {
							this.props.instance.set_client_state(client_state => ({
								game_reset_requested: true
							}))
						}
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

		let $doc_list = RichText.unordered_list()
		$doc_list.pushRawNode(
			RichText.span().pushText(`Play count: ${state.good_click_count}`).done(),
			'01-playcount'
		)
		$doc_list.pushRawNode(
			RichText.span().pushText(`Game version: ${VERSION}`).done(),
			'02-version'
		)
		$doc_list.pushRawNode(
			RichText.span().pushText(`build date (UTC): ${BUILD_DATE}`).done(),
			'03-builddate'
		)
		$doc_list.pushRawNode(
			RichText.span().pushText(`Release channel: ${CHANNEL}`).done(),
			'04-channel'
		)
		$doc_list.pushRawNode(
			RichText.span().pushText(`Exec env: ${ENV}`).done(),
			'05-env'
		)
		$doc_list.pushRawNode(
			RichText.span().pushText(`Engine version: ${GAME_VERSION}`).done(),
			'06-engine'
		)
		$doc_list.pushRawNode(
			RichText.span().pushText(`Savegame version: ${SCHEMA_VERSION}`).done(),
			'07-savegame'
		)
		$doc_list = $doc_list.done()

		const $doc = RichText.span()
			.pushNode(RichText.heading().pushText('Client infos:').done(), 'header')
			.pushNode($doc_list, 'list')
			.done()

		return (
			<div className={'page page--about'}>
				{rich_text_to_react($doc)}
				<Chat gen_next_step={this.gen_next_step()} />
			</div>
		)
	}
}

const About = with_game_instance(AboutBase)

export {
	About,
}
