import * as React from 'react'
import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import SpecSyncIndicator from '../spec-sync-indicator'
import './index.css'


const ReloadButtonVM = React.memo(
	function ReloadButtonV({ status, on_click }) {
		console.log('🔄 ReloadButtonV', {status})
		return (
			<button className="reload-button" onClick={on_click}>
				<SpecSyncIndicator status={status} />
				&thinsp;
				Reload page
			</button>
		)
	},
)
ReloadButtonVM.propTypes = {
	status: PropTypes.string.isRequired,
	on_click: PropTypes.func.isRequired,
}

export default ReloadButtonVM
