import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { browser } from "webextension-polyfill-ts"

import { create_msg_request_reload } from '../../../../../common/messages'
import { AppStateConsumer, needs_reload } from '../../context'
import View from './view'



export default class ReloadButton extends Component {
	static propTypes = {
	}

	on_click = () => {
		browser.runtime.sendMessage(create_msg_request_reload())
	}

	render_view = (props) => {
		console.log(`🔄 ReloadButton render_view`, props)
		const { app_state } = props

		return (
			<View needs_reload={needs_reload(app_state)} on_click={this.on_click} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}
