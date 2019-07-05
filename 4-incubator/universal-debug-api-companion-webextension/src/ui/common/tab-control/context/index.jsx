import assert from 'tiny-invariant'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render_any_m } from '@offirmo-private/react-error-boundary'

import { State, create, create_demo } from './state'

// https://reactjs.org/docs/context.html
const DEFAULT_STATE = create_demo()
const AppStateContext = React.createContext(DEFAULT_STATE)

let set_app_state_internal = (state) => {}
function set_app_state(state) {
	console.log('set_app_state', {state})
	set_app_state_internal(state)
}


////////////////////////////////////

class AppStateListenerAndProvider extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	state = DEFAULT_STATE

	render() {
		set_app_state_internal = set_app_state_internal || this.setState.bind(this)

		console.log(`🔄 AppStateListenerAndProvider`, {state: this.state})

		return (
			<AppStateContext.Provider value={this.state}>
				{this.props.children}
			</AppStateContext.Provider>
		)
	}
}

////////////////////////////////////

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
	set_app_state,
	AppStateContext,
	AppStateListenerAndProvider,
	AppStateConsumer,
}
export * from './state' // for convenience

////////////////////////////////////
