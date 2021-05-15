import assert from 'tiny-invariant'
import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'
import { render_any_m } from '@offirmo-private/react-error-boundary'

import { State, create_loading, create_demo } from '../../../../common/state/ui'

////////////////////////////////////

export interface RenderParams {
	app_state: State
}

////////////////////////////////////

// https://reactjs.org/docs/context.html
const DEFAULT_STATE = location.href === 'http://localhost:9090/ui/popup/popup.html'
	? create_demo() // for UI dev
	: create_loading() // temp
const AppStateContext = React.createContext(DEFAULT_STATE)

let set_app_state_internal: any
function set_app_state(state: Readonly<State>) {
	//console.log('set_app_state()', {state})
	set_app_state_internal(state)
}


////////////////////////////////////

class AppStateListenerAndProvider extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	state = DEFAULT_STATE

	set_state = (new_state: Readonly<State>) => {
		//console.log('set_state()', { new_state })
		this.setState({
			...new_state,
		})
	}

	render() {
		//console.log(`🔄 AppStateListenerAndProvider`, {state: this.state})

		set_app_state_internal = set_app_state_internal || this.set_state

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
				//console.log(`🔄 AppStateConsumer`, {app_state})
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
export * from '../../../../common/state/ui' // for convenience

////////////////////////////////////
