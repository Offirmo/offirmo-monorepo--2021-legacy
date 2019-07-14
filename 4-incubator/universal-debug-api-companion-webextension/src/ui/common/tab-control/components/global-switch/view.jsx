import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ToggleStateless } from '@atlaskit/toggle'
import SpecSyncIndicator from '../spec-sync-indicator'


const GlobalSwitchVM = React.memo(
	function GlobalSwitchV({ origin, is_injection_requested, status, on_change }) {

		return (
			<div className={`left-right-aligned override-line`}>
				<div>
					<SpecSyncIndicator status={status} />

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

				<div />
			</div>
		)
	}
)
GlobalSwitchVM.propTypes = {
	origin: PropTypes.string.isRequired,
	is_injection_requested: PropTypes.bool.isRequired,
	status: PropTypes.string.isRequired,
	on_change: PropTypes.func.isRequired,
}

export default GlobalSwitchVM
