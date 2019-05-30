import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Toggle from '@atlaskit/toggle'

export default class Switch extends Component {
	static propTypes = {
		is_injection_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
	}

	render() {
		const { is_injection_enabled, on_change } = this.props
		return (
			<div className="left-right-aligned">
				<div>Inject the Universal Debug API library</div>
				<div className="box-sizing-reset">
					<Toggle
						size="large"
						isDefaultChecked={is_injection_enabled}
						onChange={on_change}
					/>
				</div>
			</div>
		)
	}
}
