import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { browser } from 'webextension-polyfill-ts'

import { create_msg_request_reload } from '../../../../../common/messages'
import { RenderParams, AppStateConsumer, was_magic_installed, get_sync_status } from '../../context'
import View from './view'
import * as TabState from '../../../../../common/state/tab'
import send_message from '../../../utils/send-message'


export default class ReloadButton extends Component {
	static propTypes = {
	}

	on_click = () => {
		console.log('👆 ReloadButton')
		send_message(create_msg_request_reload())
	}

	render_view = ({ app_state }: RenderParams) => {
		//console.log(`🔄 ReloadButton render_view`, { app_state })

		const status = !was_magic_installed(app_state)
			? TabState.SpecSyncStatus.unknown
			: get_sync_status(app_state)

		return (
			<View status={status} on_click={this.on_click} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}
