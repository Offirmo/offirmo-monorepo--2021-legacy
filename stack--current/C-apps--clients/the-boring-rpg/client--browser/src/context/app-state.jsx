import * as React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'
import { get_revision } from '@offirmo-private/state-utils'

import get_game_instance from '../services/game-instance-browser'
import logger from '../services/logger'
import { get_timestamp } from '@offirmo-private/state-utils/src'


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
		this.unsubscribeAppStateListener = get_game_instance().view.subscribe('app-state', () => {
			//console.log(`▶ AppStateListenerAndProvider: updating on app state change`/*, game_instance.view.get()*/)
			this.setState({
				app_state: get_game_instance().view.get(),
			})
		})
	}
	componentWillUnmount () {
		this.unsubscribeAppStateListener()
		this.unsubscribeAppStateListener = null
	}

	render() {
		// yes, we shortcut React and make sure to pick the latest version
		// Without that, there is a delay while setState get propagated
		const latest_app_state = get_game_instance().view.get()
		const latest_model_revision = latest_app_state ? get_revision(latest_app_state.model) : -1

		logger.trace(`🔄 AppStateListenerAndProvider (model is rev#${latest_model_revision},T=${get_timestamp(latest_app_state.model)})`/*, {app_state: this.state.app_state}*/);

		/* Yes this triggers
		const local_revision = this.state.app_state ? get_revision(this.state.app_state.model) : -1
		if (latest_model_revision !== local_revision)
			console.warn(`FYI App State Context discrepancy: local = ${local_revision}, latest = ${latest_model_revision}`)
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
