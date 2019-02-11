import React from 'react'
import PropTypes from 'prop-types'

import * as RichText from '@offirmo/rich-text-format'
import { THE_BORING_RPG } from '@offirmo/marketing-rsrc'
import { SCHEMA_VERSION, GAME_VERSION } from '@tbrpg/state'

import NetlifyWidget from '../../misc/netlify'
import { Chat } from '../../utils/chat-interface'
import rich_text_to_react from '../../../services/rich-text-to-react'
import { VERSION, BUILD_DATE } from '../../../services/build.json'
import SEC from '../../../services/sec'
import ErrorBoundary from '@offirmo/react-error-boundary'
import get_game_instance from '../../../services/game-instance-browser'

import '../index.css'

function * gen_next_step(navigate_to_savegame_editor) {
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
			//const state = game_instance.model.get_state()
			const view_state = game_instance.view.get_state()
			//console.log({view_state, state})

			if (view_state.redeeming_code) {
				steps.push({
					type: 'ask_for_string',
					msg_main: `Please enter a code…`,
					msgg_as_user: value => value
						? `Let's redeem "${value}".`
						: 'Nevermind.',
					msgg_acknowledge: code => code
						? `Redeeming the code "${code}"...`
						: 'Maybe another time.',
					callback: value => {
						//console.log({value, type: typeof value})
						if (value)
							game_instance.reducers.attempt_to_redeem_code(value)
						game_instance.view.set_state(() => ({
							redeeming_code: false,
						}))
					},
				})
			}
			else {
				steps.push({
					msg_main: 'What do you want to do?',
					callback: url => window.open(url, '_blank').opener = null,
					choices: [
						{
							msg_cta: '👍 Like on social medias',
							value: THE_BORING_RPG.aggregated_links_url,
							msgg_as_user: () => 'You’re awesome…',
							msgg_acknowledge: url => <span>Now opening <a href={url} target="_blank">{url}</a></span>,
						},
						{
							msg_cta: 'Enter a code',
							value: 'redeem',
							callback: () => {
								game_instance.view.set_state(() => ({
									redeeming_code: true,
								}))
							}
						},
						{
							msg_cta: 'Report a bug 🐞',
							value: THE_BORING_RPG.issues_url,
							msgg_as_user: () => 'There is this annoying bug…',
							msgg_acknowledge: url => <span>Now opening <a href={url} target="_blank">{url}</a></span>,
						},
						{
							msg_cta: '⚙ Save/load/reset your savegame',
							value: 'save',
							msgg_as_user: () => 'Let’s mess with my savegame…',
							callback: async () => {
								navigate_to_savegame_editor()

								// trick: we'll navigate, causing this chat to be unmounted
								// which is hard to sync. Delay resolution so that
								// the chat doesn't try to advance until we're already unmounted.
								// TODO improve further (intercept return of this func?)
								return new Promise(resolve => setTimeout(resolve, 2000))
							}
						},
						{
							msg_cta: 'Reload page ↻',
							value: 'reload',
							msgg_as_user: () => 'Reload the page.',
							msgg_acknowledge: () => 'Reloading...',
							callback: async () => window.location.reload(),
						},
					],
				})
			}
		}

		yield* steps
	} while (true)
}


export function render_meta(statistics) {
	const { CHANNEL, ENV } = SEC.getInjectedDependencies()

	const $doc_list_builder = RichText.unordered_list()
	$doc_list_builder.pushRawNode(
		RichText.inline_fragment().pushText(`Play count: ${statistics.good_play_count}`).done(),
		'01-playcount'
	)
	$doc_list_builder.pushRawNode(
		RichText.inline_fragment().pushText(`Game version: ${VERSION}`).done(),
		'02-version'
	)
	$doc_list_builder.pushRawNode(
		RichText.inline_fragment().pushText(`Build date (UTC): ${BUILD_DATE}`).done(),
		'03-builddate'
	)
	$doc_list_builder.pushRawNode(
		RichText.inline_fragment().pushText(`Release channel: ${CHANNEL}`).done(),
		'04-channel'
	)
	$doc_list_builder.pushRawNode(
		RichText.inline_fragment().pushText(`Exec env: ${ENV}`).done(),
		'05-env'
	)
	$doc_list_builder.pushRawNode(
		RichText.inline_fragment().pushText(`Engine version: ${GAME_VERSION}`).done(),
		'06-engine'
	)
	$doc_list_builder.pushRawNode(
		RichText.inline_fragment().pushText(`Savegame version: ${SCHEMA_VERSION}`).done(),
		'07-savegame'
	)

	const $doc = RichText.inline_fragment()
		.pushNode(RichText.heading().pushText('Client infos:').done(), 'header')
		.pushNode($doc_list_builder.done(), 'list')
		.done()

	return $doc
}

const MetaPanelViewM = React.memo(
	function MetaPanelView({statistics, navigate_to_savegame_editor}) {
		console.log('🔄 MetaPanelView', {statistics, navigate_to_savegame_editor})

		return (
			<div className="tbrpg-panel o⋄flex--column">
				<hr/>
				<NetlifyWidget />
				<hr/>
				<div className='panel-top-content o⋄flex-element--nogrow'>
					{rich_text_to_react(render_meta(statistics))}
				</div>
				<hr/>
				<div className='o⋄flex-element--grow o⋄overflow-y⁚auto'>
					<ErrorBoundary name={'chat:meta'}>
						<Chat gen_next_step={gen_next_step(navigate_to_savegame_editor)} />
					</ErrorBoundary>
				</div>
			</div>
		)
	}
)

export default MetaPanelViewM

