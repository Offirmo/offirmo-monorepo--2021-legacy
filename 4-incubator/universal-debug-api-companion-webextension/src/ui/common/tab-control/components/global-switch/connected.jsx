import { browser } from "webextension-polyfill-ts"
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import View from './view'

import { AppStateConsumer, get_origin, is_injection_requested } from '../../context'
import { create_msg_toggle_lib_injection } from '../../../../../common/messages'


class GlobalSwitch extends Component {
	static propTypes = {
	}

	on_change = (event) => {
		console.log('GlobalSwitch on_change', event)
		browser.runtime.sendMessage(create_msg_toggle_lib_injection())
	}

	render_view = ({app_state}) => {
		console.log(`🔄 Overrides render_view`, {app_state})
		return (
			<View
				is_injection_requested={is_injection_requested(app_state)}
				on_change={this.on_change}
				origin={get_origin(app_state)}
			/>
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default GlobalSwitch
