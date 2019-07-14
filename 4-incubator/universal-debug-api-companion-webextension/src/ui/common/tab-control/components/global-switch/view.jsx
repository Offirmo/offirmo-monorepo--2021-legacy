import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ToggleStateless } from '@atlaskit/toggle'

const GlobalSwitchVM = React.memo(
	function GlobalSwitchV({ origin, is_injection_requested, on_change }) {
		return (
			<div className={`left-right-aligned override-line`}>
				<div>
					<span className={`box-sizing-reset override-enable-toggle`}>
						<ToggleStateless
							size="large"
							isChecked={is_injection_requested}
							onChange={on_change}
						/>
					</span>

					<span className={`override-label`}>
						Inject the Universal Debug API library into {origin}
					</span>
				</div>
			</div>
		)
	}
)
GlobalSwitchVM.propTypes = {
	is_injection_requested: PropTypes.bool.isRequired,
	on_change: PropTypes.func.isRequired,
	origin: PropTypes.string.isRequired,
}

export default GlobalSwitchVM
