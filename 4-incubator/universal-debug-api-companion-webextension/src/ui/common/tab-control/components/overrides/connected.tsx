import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AppStateConsumer } from '../../context'
import Override from '../override'
import { create_msg_override_change } from '../../../../../common/messages'
import send_message from '../../../utils/send-message'

const OverridesC1M = React.memo(
	function OverridesC1M({on_change, overrides}) {
		return Object.keys(overrides)
			.sort((key_1, key_2) => {
				if (overrides[key_1].has_activity && !overrides[key_2].has_activity)
					return -1
				if (!overrides[key_1].has_activity && overrides[key_2].has_activity)
					return 1

				if (key_1 < key_2)
					return -1
				if (key_1 > key_2)
					return 1

				return 0
			})
			.map((override_key) => {
			return <Override key={override_key} {...{on_change, override_key}} />
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

	render_view = ({app_state}) => {
		console.log(`🔄 Overrides render_view`, {app_state})

		const overrides = app_state
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
