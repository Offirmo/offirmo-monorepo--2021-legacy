import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ToggleStateless } from '@atlaskit/toggle'

const ActivityIndicatorVM = React.memo(
	function ActivityIndicatorV({ status }) {
		// TODO yellow on reload needed
		let classes = ['activity-indicator']
		if (has_activity) classes.push('activity-indicator--with-activity')
		return (
			<span className={classes.join(' ')}>●</span>
		)
	}
)
ActivityIndicatorVM.propTypes = {
	is_injection_requested: PropTypes.bool.isRequired,
	on_change: PropTypes.func.isRequired,
	origin: PropTypes.string.isRequired,
}

export default ActivityIndicatorVM




function ActivityIndicator({has_activity}) {
	// TODO yellow on reload needed
	let classes = ['activity-indicator']
	if (has_activity) classes.push('activity-indicator--with-activity')
	return (
		<span className={classes.join(' ')}>●</span>
	)
}
