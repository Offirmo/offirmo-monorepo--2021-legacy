import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AppStateConsumer } from '../../context'
import Override from '../override'

const OverridesC1M = React.memo(
	function OverridesC1M({on_change, overrides}) {
		return Object.keys(overrides).map((override_key) => {
			return <Override key={override_key} {...{on_change, override_key}} />
		})
	}
)


class Overrides extends Component {
	static propTypes = {
	}

	on_change = ({key, value}) => {
		console.log('Overrides on_change TODO', {key, value})
	}

	render_view = ({app_state}) => {
		console.log(`🔄 Overrides render_view`, {app_state})

		const { overrides } = app_state
		return (
			<OverridesC1M {...{on_change: this.on_change, overrides}} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default Overrides
