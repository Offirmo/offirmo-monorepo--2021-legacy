import assert from 'tiny-invariant'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render_any_m } from '@offirmo-private/react-error-boundary'

import { State, create } from './state'
import { MSG_ENTRY } from '../../../../common/messages'

// https://reactjs.org/docs/context.html
const AppStateContext = React.createContext(create())

export let set_app_state = (state: Readonly<State>) => void

////////////////////////////////////

class AppStateListenerAndProvider extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	state: Readonly<State> = create()

	render() {
		set_app_state = set_app_state || this.setState.bind(this)

		console.log(`🔄 AppStateListenerAndProvider`, {state: this.state})

		return (
			<AppStateContext.Provider value={this.state}>
				{this.props.children}
			</AppStateContext.Provider>
		)
	}
}

////////////////////////////////////

function AppStateConsumer({ children, render }: any) {
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
