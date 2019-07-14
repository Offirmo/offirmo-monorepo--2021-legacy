import React, { Component } from 'react'
import PropTypes from 'prop-types'

import View from './view'

import {AppStateConsumer, get_override_status, is_injection_requested} from '../../context'



class Override extends Component {
	static propTypes = {
		override: PropTypes.object.isRequired,
		on_change: PropTypes.func.isRequired,
	}

	render_view = ({app_state}) => {
		const is_injection_enabled = is_injection_requested(app_state)
		const { override, on_change } = this.props
		const { key } = override.spec
		const status = get_override_status(app_state, key)
		function on_key_change({value, is_enabled}) {
			on_change({key, value, is_enabled })
		}

		return (
			<View {...{is_injection_enabled, on_change: on_key_change, override, status}} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default Override
