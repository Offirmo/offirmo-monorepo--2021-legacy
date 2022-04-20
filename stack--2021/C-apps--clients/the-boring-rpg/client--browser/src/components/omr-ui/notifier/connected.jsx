import * as React from 'react'
import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { THE_BORING_RPG } from '@offirmo-private/marketing-rsrc'
import { NUMERIC_VERSION } from '@tbrpg/flux'

import rich_text_to_react from '../../../services/rich-text-to-react'
import { UStateListenerAndProvider } from '../../../context'
import get_game_instance from '../../../services/game-instance-browser'
import { LS_KEYS } from '../../../services/consts'
import logger from '../../../services/logger'

let start_notifs_displayed = false
const OMRUINotifierC1 = React.memo(
	function OMRUINotifierC1({enqueueNotification, u_state}) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 OMRUINotifierC1')

		if (!start_notifs_displayed) {
			enqueueNotification({
				level: 'warning',
				children: <span className="warning">⚠ Warning! This game is alpha, your savegame may be lost at any time!</span>,
				position: 'top-center',
				auto_dismiss_delay_ms: 7000,
			})

			getRootSEC().xTry('update last seen version', () => {
				const current_version = NUMERIC_VERSION
				const ls_content = localStorage.getItem(LS_KEYS.last_version_seen)
				if (ls_content) {
					const last_version_seen = Number(ls_content || 0.001)
					const isNewVersion = isNaN(last_version_seen) || current_version !== last_version_seen
					const hasNewFeatures = isNaN(last_version_seen) || (Math.trunc(current_version * 100) - Math.trunc(last_version_seen * 100)) >= 1
					//console.log({ last_version_seen, current_version, isNewVersion, hasNewFeatures, a: !!last_version_seen, b: current_version !== last_version_seen })
					if (isNewVersion) {
						enqueueNotification({
							level: 'success',
							children: hasNewFeatures
								? (<Fragment>
									🆕 You got a new version!
									Check the <a href={THE_BORING_RPG.changelog} target="_blank">new features</a>!
								</Fragment>)
								: (<Fragment>
									🆕 You got a new version, just bug fixes and maintenance.
								</Fragment>),
							position: 'top-center',
							auto_dismiss_delay_ms: 7000,
						})
					}
				}
				localStorage.setItem(LS_KEYS.last_version_seen, current_version)
			})
			start_notifs_displayed = true
		}

		let pending_non_flow_engagement
		do {
			pending_non_flow_engagement = get_game_instance().queries.get_oldest_pending_non_flow_engagement()
			if (pending_non_flow_engagement) {
				const { uid, $doc, pe } = pending_non_flow_engagement
				logger.log('Dequeing engagement: ', {uid, $doc, pe, pending_non_flow_engagement})
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
	},
)


class OMRUINotifier extends Component {
	static propTypes = {
		enqueueNotification: PropTypes.func.isRequired,
	}

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
