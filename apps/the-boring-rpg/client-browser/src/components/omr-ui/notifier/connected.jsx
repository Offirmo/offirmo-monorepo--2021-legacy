import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import rich_text_to_react from '../../../services/rich-text-to-react'
import { UStateListenerAndProvider } from '../../../context'

import get_game_instance from '../../../services/game-instance-browser'
import SEC from "../../../services/sec";
import {LS_KEYS} from "../../../services/consts";
import {THE_BORING_RPG} from "@offirmo/marketing-rsrc";


let start_notifs_displayed = false
const OMRUINotifierC1 = React.memo(
	function OMRUINotifierC1({enqueueNotification, u_state}) {
		console.log('🔄 OMRUINotifierC1')

		if (!start_notifs_displayed) {
			enqueueNotification({
				level: 'warning',
				children: <span className="warning">⚠ Warning! This game is alpha, your savegame may be lost at any time!</span>,
				position: 'top-center',
				auto_dismiss_delay_ms: 7000,
			})

			// update notification
			SEC.xTry('update last seen version', ({ VERSION: current_version }) => {
				const last_version_seen = localStorage.getItem(LS_KEYS.last_version_seen)
				if (current_version === last_version_seen) return
				enqueueNotification({
					level: 'success',
					children: (
						<Fragment>
							🆕 You got a new version!
							Check the <a href={THE_BORING_RPG.changelog} target="_blank">new features</a>!
						</Fragment>
					),
					position: 'top-center',
					auto_dismiss_delay_ms: 7000,
				})
				localStorage.setItem(LS_KEYS.last_version_seen, current_version)
			})
			start_notifs_displayed = true
		}

		let pending_non_flow_engagement
		do {
			pending_non_flow_engagement = get_game_instance().queries.get_oldest_pending_non_flow_engagement()
			if (pending_non_flow_engagement) {
				const { uid, $doc, pe } = pending_non_flow_engagement
				console.info('Dequeing engagement: ', {uid, $doc, pe, pending_non_flow_engagement})
				const type = pe.engagement.type
				switch(type) {
					case 'aside': {
						const level = pe.params.semantic_level || 'info'
						const auto_dismiss_delay_ms = pe.params.auto_dismiss_delay_ms || 0
						enqueueNotification({
							level,
							children: rich_text_to_react($doc),
							position: 'bottom-center',
							auto_dismiss_delay_ms,
						})
						break
					}
					case 'warning': {
						const level = pe.params.semantic_level || 'warning'
						const auto_dismiss_delay_ms = pe.params.auto_dismiss_delay_ms || 0
						enqueueNotification({
							level,
							children: rich_text_to_react($doc),
							position: 'top-center',
							auto_dismiss_delay_ms,
						})
						break
					}
					default:
						throw new Error(`Engagement type not recognized: "${type}"!`)
				}
				get_game_instance().commands.acknowledge_engagement_msg_seen(uid)
			}
		} while(pending_non_flow_engagement)

		return null
	}
)


class OMRUINotifier extends Component {
	render_view = ({ u_state }) => {
		const { enqueueNotification } = this.props

		return (
			<OMRUINotifierC1
				enqueueNotification={enqueueNotification}
				u_state={u_state}
			/>
		)
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}

export default OMRUINotifier
