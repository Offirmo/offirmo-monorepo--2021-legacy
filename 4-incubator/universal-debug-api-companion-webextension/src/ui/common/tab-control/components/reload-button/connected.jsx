import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { browser } from 'webextension-polyfill-ts'

import { create_msg_request_reload } from '../../../../../common/messages'
import { AppStateConsumer, needs_reload, was_magic_installed, get_global_switch_sync_status } from '../../context'
import View from './view'
import * as TabState from '../../../../../common/state/tab'



export default class ReloadButton extends Component {
	static propTypes = {
	}

	on_click = () => {
		browser.runtime.sendMessage(create_msg_request_reload())
	}

	render_view = (props) => {
		console.log(`🔄 ReloadButton render_view`, props)
		const { app_state } = props

		const status = !was_magic_installed(app_state)
			? TabState.SpecSyncStatus.unknown
			: get_global_switch_sync_status(app_state)
//			needs_reload ? TabState.SpecSyncStatus['changed-needs-reload'] : TabState.SpecSyncStatus['active-and-up-to-date']

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
