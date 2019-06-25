import React, { Component } from 'react'
import PropTypes from 'prop-types'

import View from './view'

import { AppStateConsumer } from '../../context'
import { create_msg_toggle_lib_injection } from '../../../../common/messages'


const GlobalSwitchC1M = React.memo(
	function GlobalSwitchC1M({is_injection_enabled, on_change}) {
		return (
			<View {...{is_injection_enabled, on_change}} />
		)
	}
)


class GlobalSwitch extends Component {
	static propTypes = {
	}

	on_change = (event) => {
		console.log('GlobalSwitch on_change', event)
		chrome.runtime.sendMessage(create_msg_toggle_lib_injection())
	}

	render_view = ({app_state}) => {
		console.log(`🔄 Overrides render_view`, {app_state})
		const { is_injection_enabled } = app_state
		return (
			<GlobalSwitchC1M {...{is_injection_enabled, on_change: this.on_change}} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default GlobalSwitch
