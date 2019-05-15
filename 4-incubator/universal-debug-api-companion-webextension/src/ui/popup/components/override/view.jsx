import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Toggle from '@atlaskit/toggle'

export default class Switch extends Component {
	static propTypes = {
		is_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
		label: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		value: PropTypes.any, // TODO refine
	}

	render() {
		const { is_enabled, on_change, label, type, value } = this.props
		return (
			<div>
				{ /* TODO usage indicator */ }

				<div className="left-right-aligned">
					<div>{label}</div>
					<div className="box-sizing-reset">
						<Toggle
							size="large"
							isDisabled={!is_enabled}
							isDefaultChecked={value}
							onChange={on_change}
						/>
					</div>
				</div>
			</div>
		)
	}
}
