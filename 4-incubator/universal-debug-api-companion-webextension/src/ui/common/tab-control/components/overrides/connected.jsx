import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import {AppStateConsumer, get_overrides_map, compare_overrides} from '../../context'
import Override from '../override'
import { create_msg_change_override_spec } from '../../../../../common/messages'
import send_message from '../../../utils/send-message'

const OverridesC1M = React.memo(
	function OverridesC1M({on_change, overrides}) {
		console.log(`🔄 OverridesC1M`, overrides)

		if (!overrides.length)
			return (
				<Fragment>
					<p className="o⋄color⁚secondary">No known overrides for this origin so far. Suggestions:</p>
					<ol className="o⋄color⁚secondary">
						<li>Ensure the injection is enabled (switch above)</li>
						<li>Use some in your code!</li>
						<li>Try refreshing the page</li>
					</ol>
				</Fragment>
			)
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

	on_change = ({key, value_json, is_enabled}) => {
		console.log('Overrides on_change', {key, value_json, is_enabled})
		const msg = create_msg_change_override_spec(key, {
			value_json,
			is_enabled,
		})
		console.log('📤 Sending msg:', msg)
		send_message(msg)
	}

	render_view = (props) => {
		console.log(`🔄 Overrides render_view`, props)
		const { app_state } = props

		const overrides = Object.values(get_overrides_map(app_state)).sort(compare_overrides)
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
