import React from 'react'

import get_game_instance from '../services/game-instance-browser'

const game_instance = get_game_instance()

const DEFAULT_VALUE = {}
const AppStateContext = React.createContext(DEFAULT_VALUE)

let subscribedId = 0
class AppStateListenerAndProvider extends React.Component {
	state = {
		uber_state: {},
	}

	componentDidMount() {
		this.unsubscribe = game_instance.subscribe(() => {
			this.id = ++subscribedId
			console.log(`🔄 AppStateListenerAndProvider #${this.id}: updating on uber state change`, game_instance.view.get_state())
			this.setState({
				uber_state: game_instance.view.get_state()
			})
		})
	}
	componentWillUnmount () {
		this.unsubscribe()
	}

	render() {
		console.log(`🔄 AppStateListenerAndProvider #${this.id}`);

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
