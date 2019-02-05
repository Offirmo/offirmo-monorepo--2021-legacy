import React, { Component } from 'react'
import PropTypes from 'prop-types'

import get_game_instance from '../services/game-instance-browser'


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
		this.unsubscribeAppStateListener = get_game_instance().subscribe(`app-state`, () => {
			console.log(`▶ AppStateListenerAndProvider: updating on app state change`/*, game_instance.view.get_state()*/)
			this.setState({
				app_state: get_game_instance().view.get_state()
			})
		})
	}
	componentWillUnmount () {
		this.unsubscribeAppStateListener()
		this.unsubscribeAppStateListener = null
	}

	render() {
		// yes, we shortcut React and make sure to pick the latest version
		const latest_app_state = get_game_instance().view.get_state()
		const latest_revision = latest_app_state ? latest_app_state.model.u_state.revision : -1

		//console.log(`🔄 AppStateListenerAndProvider (model is #${latest_revision})`/*, {app_state: this.state.app_state}*/);

		/*
		const local_revision = this.state.app_state ? this.state.app_state.model.u_state.revision : -1
		if (latest_revision !== local_revision)
			console.warn(`App State Context discrepancy: local = ${local_revision}, latest = ${latest_revision}`)
		*/

		return (
			<AppStateContext.Provider value={latest_app_state}>
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
