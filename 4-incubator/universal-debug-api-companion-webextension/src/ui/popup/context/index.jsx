import assert from 'tiny-invariant'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render_any_m } from '@offirmo-private/react-error-boundary'

import { ENTRY } from '../../../common/messages'
import { create_default_origin_state, create_demo_origin_state } from '../../../common/origin-state'

// https://reactjs.org/docs/context.html
const AppStateContext = React.createContext(create_default_origin_state())

let set_app_state = null

class AppStateListenerAndProvider extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	state = create_default_origin_state()

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
}

////////////////////////////////////

if (!chrome.tabs) {
	setTimeout(
		() => set_app_state(create_demo_origin_state()),
		1
	)
}
else {
	const port_to_bg = chrome.runtime.connect({name: "popup"});
	port_to_bg.onMessage.addListener((msg) => {
		console.log(`received a port message`, msg)
		assert(msg[ENTRY], 'ENTRY')

		set_app_state(msg[ENTRY].state)
	});
//port.postMessage({hello: "test"});
}
