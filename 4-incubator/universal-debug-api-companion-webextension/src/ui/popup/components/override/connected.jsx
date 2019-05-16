import React, { Component } from 'react'
import PropTypes from 'prop-types'

import View from './view'

import { AppStateConsumer } from '../../context'


const OverrideC1M = React.memo(
	function OverrideC1M({is_enabled, on_change, override_key, type, value}) {
		return (
			<View {...{is_enabled, on_change, override_key, type, value}} />
		)
	}
)


class Override extends Component {
	static propTypes = {
		override_key: PropTypes.string.isRequired,
		on_change: PropTypes.func.isRequired,
	}

	render_view = ({app_state}) => {
		const { is_enabled, overrides } = app_state
		const { override_key, on_change } = this.props
		const override = overrides[override_key]
		const { type, value } = override
		// TODO onchange wrapper

		function on_key_change(value) {
			on_change({key: override_key, value})
		}

		return (
			<OverrideC1M {...{is_enabled, on_change: on_key_change, override_key, type, value}} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default Override
