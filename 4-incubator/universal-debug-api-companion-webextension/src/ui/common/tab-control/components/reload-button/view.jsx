import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import * as TabState from '../../../../../common/state/tab'
import SpecSyncIndicator from '../spec-sync-indicator'
import './index.css'


const ReloadButtonVM = React.memo(
	function ReloadButtonV({ needs_reload, on_click }) {
		console.log(`🔄 ReloadButtonV`, {status})
		return (
			<button className="reload-button" onClick={on_click}>
				<SpecSyncIndicator status={needs_reload ? TabState.SpecSyncStatus['changed-needs-reload'] : TabState.SpecSyncStatus['active-and-up-to-date']} />
				&thinsp;
				Reload page
			</button>
		)
	}
)
ReloadButtonVM.propTypes = {
	needs_reload: PropTypes.bool.isRequired,
	on_click: PropTypes.func.isRequired,
}

export default ReloadButtonVM
