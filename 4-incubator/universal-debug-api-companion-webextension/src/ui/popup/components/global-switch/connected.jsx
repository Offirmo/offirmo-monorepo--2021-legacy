import React, { Component } from 'react'
import PropTypes from 'prop-types'

import View from './view'

import { AppStateConsumer, set_app_state } from '../../context'


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
		set_app_state(state => ({is_injection_enabled: !state.is_injection_enabled}))
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
