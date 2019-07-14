import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {AppStateConsumer, get_overrides_map, sort_overrides} from '../../context'
import Override from '../override'
import { create_msg_override_change } from '../../../../../common/messages'
import send_message from '../../../utils/send-message'

const OverridesC1M = React.memo(
	function OverridesC1M({on_change, overrides}) {
		console.log(`🔄 OverridesC1M`, overrides)
		return overrides
			.map((override) => {
				console.log('OverridesC1M -> Override', override)
				return <Override key={override.key} {...{on_change, override}} />
			})
	}
)


class Overrides extends Component {
	static propTypes = {
	}

	on_change = ({key, value, is_enabled}) => {
		console.log('Overrides on_change', {key, value, is_enabled})
		send_message(create_msg_override_change(key, {
			value,
			is_enabled,
		}))
	}

	render_view = (props) => {
		console.log(`🔄 Overrides render_view`, props)
		const { app_state } = props

		const overrides = Object.values(get_overrides_map(app_state)).sort(sort_overrides)
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
