import React, { Component } from 'react'
import PropTypes from 'prop-types'

import get_game_instance from '../services/game-instance-browser'

const game_instance = get_game_instance()

// https://reactjs.org/docs/context.html
const DEFAULT_VALUE = null
const AppStateContext = React.createContext(DEFAULT_VALUE)

class AppStateListenerAndProvider extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	state = {}
	unsubscribeAppStateListener = null

	componentDidMount() {
		this.unsubscribeAppStateListener = game_instance.subscribe(`app-state`, () => {
			console.log(`▶ AppStateListenerAndProvider: updating on app state change`/*, game_instance.view.get_state()*/)
			this.setState({
				app_state: game_instance.view.get_state()
			})
		})
	}
	componentWillUnmount () {
		this.unsubscribeAppStateListener()
		this.unsubscribeAppStateListener = null
	}

	render() {
		console.log(`🔄 AppStateListenerAndProvider`/*, {app_state: this.state.app_state}*/);

		return (
			<AppStateContext.Provider value={this.state.app_state}>
				{this.props.children}
			</AppStateContext.Provider>
		)
	}
}

export default AppStateContext

export {
	AppStateContext,
	AppStateListenerAndProvider,
}
