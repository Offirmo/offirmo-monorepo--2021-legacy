import React, { Component } from 'react'
import PropTypes from 'prop-types'

import View from './view'

import { AppStateConsumer, is_injection_requested } from '../../context'


const OverrideC1M = React.memo(
	function OverrideC1M({is_injection_enabled, on_change, override}) {
		return (
			<View {...{is_injection_enabled, on_change, override}} />
		)
	}
)


class Override extends Component {
	static propTypes = {
		override: PropTypes.object.isRequired,
		on_change: PropTypes.func.isRequired,
	}

	render_view = ({app_state}) => {
		const is_injection_enabled = is_injection_requested(app_state)
		const { override, on_change } = this.props
		const { key } = override
		function on_key_change({value, is_enabled}) {
			on_change({key, value, is_enabled })
		}

		return (
			<OverrideC1M {...{is_injection_enabled, on_change: on_key_change, override}} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default Override
