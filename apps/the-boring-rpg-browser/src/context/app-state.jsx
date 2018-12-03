import React from 'react'

import get_game_instance from '../services/game-instance-browser'

const game_instance = get_game_instance()

const DEFAULT_VALUE = {}
const AppStateContext = React.createContext(DEFAULT_VALUE)

class AppStateListenerAndProvider extends React.Component {
	state = {
		uber_state: {},
	}

	componentDidMount() {
		this.unsubscribe = game_instance.subscribe(() => {
			console.log('🔄 AppStateListenerAndProvider: updating on uber state change', game_instance.view.get_state())
			this.setState({
				uber_state: game_instance.view.get_state()
			})
		})
	}
	componentWillUnmount () {
		this.unsubscribe()
	}

	render() {
		console.log("🔄 AppStateListenerAndProvider");

		/*const game_instance = get_game_instance()
		console.warn(game_instance)*/

		// TODO improve state -> overarching state
		return (
			<AppStateContext.Provider value={this.state}>
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
