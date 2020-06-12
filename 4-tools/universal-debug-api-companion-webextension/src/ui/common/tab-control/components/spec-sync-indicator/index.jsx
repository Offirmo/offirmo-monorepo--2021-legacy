import * as React from 'react'
import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import './index.css'


const SpecSyncIndicatorVM = React.memo(
	function SpecSyncIndicatorV({ status }) {
		console.log('🔄 SpecSyncIndicatorV', {status})
		return (
			<span className={`spec-sync-indicator spec-sync-indicator--${status}`}>●</span>
		)
	},
)
SpecSyncIndicatorVM.propTypes = {
	status: PropTypes.string.isRequired,
}

export default SpecSyncIndicatorVM
