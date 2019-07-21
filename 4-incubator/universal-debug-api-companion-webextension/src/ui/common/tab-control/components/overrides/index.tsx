import assert from 'tiny-invariant'
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { AppStateConsumer, get_overrides_map, compare_overrides, RenderParams } from '../../context'
import Override from '../override'
import { create_msg_change_override_spec } from '../../../../../common/messages'
import send_message from '../../../utils/send-message'
import { OverrideState as OriginOverrideState } from '../../../../../common/state/origin'


class Overrides extends Component {
	static propTypes = {
	}

	on_change = ({key, value_sjson, is_enabled}: Partial<OriginOverrideState>) => {
		assert(key, 'on change partial')
		console.log('✨ Overrides on_change', {key, value_sjson, is_enabled})
		const partial: Partial<OriginOverrideState> = {}
		if (is_enabled !== undefined)
			partial.is_enabled = is_enabled
		if (value_sjson !== undefined)
			partial.value_sjson = value_sjson
		const msg = create_msg_change_override_spec(key!, partial)
		send_message(msg)
	}

	render_view = ({ app_state }: RenderParams) => {
		//console.log(`🔄 Overrides render_view`, { app_state })

		const overrides = Object.values(get_overrides_map(app_state)).sort(compare_overrides)
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
				//console.log('OverridesC1M -> Override', override)
				return (
					<Override
						key={override.key}
						on_change={this.on_change}
						override={override} />
				)
			})
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default Overrides
