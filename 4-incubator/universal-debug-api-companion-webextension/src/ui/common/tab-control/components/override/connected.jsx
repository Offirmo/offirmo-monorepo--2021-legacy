import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { SpecSyncStatus } from '../../../../../common/state/tab'
import View from './view'

import {
	AppStateConsumer,
	get_global_switch_sync_status,
	get_override_sync_status,
	should_inject_the_lib,
} from '../../context'



class Override extends Component {
	static propTypes = {
		override: PropTypes.object.isRequired,
		on_change: PropTypes.func.isRequired,
	}

	render_view = ({app_state}) => {
		const is_injection_enabled = should_inject_the_lib(app_state)
		const { override, on_change } = this.props
		const { key } = override.spec

		const status = (() => {
			const global_status = get_global_switch_sync_status(app_state)
			if (global_status === SpecSyncStatus.inactive)
				return global_status

			return get_override_sync_status(app_state, key)
		})()

		function on_key_change({value_json, is_enabled}) {
			on_change({key, value_json, is_enabled })
		}

		return (
			<View {...{is_injection_enabled, status, override, on_change: on_key_change}} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default Override
