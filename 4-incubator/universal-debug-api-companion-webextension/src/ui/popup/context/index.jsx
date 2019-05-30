import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { render_any_m } from '@offirmo-private/react-error-boundary'


// https://reactjs.org/docs/context.html
const DEFAULT_VALUE = {
	is_injection_enabled: true,
	overrides: {
		'root.logLevel': {
			is_enabled: false,
			type: 'll',
			value: 'error',
			is_queried_in_code: false,
		},
		'fooExperiment.cohort': {
			is_enabled: true,
			type: 'co',
			value: 'not-enrolled',
			is_queried_in_code: true,
		},
		'fooExperiment.logLevel': {
			is_enabled: true,
			type: 'll',
			value: 'error',
			is_queried_in_code: true,
		},
		'fooExperiment.isSwitchedOn': {
			is_enabled: true,
			type: 'b',
			value: true,
			is_queried_in_code: true,
		},
	}
}
const AppStateContext = React.createContext(DEFAULT_VALUE)

let set_app_state = null

class AppStateListenerAndProvider extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	state = DEFAULT_VALUE

	render() {
		set_app_state = set_app_state || this.setState.bind(this)

		console.log(`🔄 AppStateListenerAndProvider`, {app_state: this.state.app_state})
		//console.log(`🔄 AppStateListenerAndProvider (model is #${latest_revision})`/*, {app_state: this.state.app_state}*/);

		return (
			<AppStateContext.Provider value={this.state}>
				{this.props.children}
			</AppStateContext.Provider>
		)
	}
}


function AppStateConsumer({ children, render }) {
	return (
		<AppStateContext.Consumer>
			{app_state => {
				console.log(`🔄 AppStateConsumer`, {app_state})
				return render_any_m({
					children,
					render,
					app_state,
				})
			}}
		</AppStateContext.Consumer>
	)
}

export default AppStateContext

export {
	AppStateContext,
	AppStateListenerAndProvider,
	AppStateConsumer,

	set_app_state, // TODO review
}
