import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ToggleStateless } from '@atlaskit/toggle'

export default class Switch extends Component {
	static propTypes = {
		is_injection_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
	}

	render() {
		const { is_injection_enabled, on_change } = this.props
		return (
			<div className={`left-right-aligned override-line`}>
				<div>
					<span className={`box-sizing-reset override-enable-toggle`}>
						<ToggleStateless
							size="large"
							isChecked={is_injection_enabled}
							onChange={on_change}
						/>
					</span>

					<span className={`override-label`}>
						Inject the Universal Debug API library
					</span>
				</div>

				<div />
			</div>
		)
	}
}
