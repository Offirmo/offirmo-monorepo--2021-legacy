import React from 'react'

import get_game_instance from '../services/game-instance-browser'

const DEFAULT_VALUE = {}

const GameStateContext = React.createContext(DEFAULT_VALUE)

class GameStateListenerAndProvider extends React.Component {
	state = {}

	componentDidMount() {
		this.unsubscribe = get_game_instance().subscribe(() => {
			console.log('🔄 GameStateListener: updating on game state change')
			this.setState({
				...get_game_instance().model.get_state()
			})
		})
	}
	componentWillUnmount () {
		this.unsubscribe()
	}

	render() {
		console.log("🔄 GameStateListener");

		/*const game_instance = get_game_instance()
		console.warn(game_instance)*/

		// TODO improve state -> overarching state
		return (
			<GameStateContext.Provider value={this.state}>
				{this.props.children}
			</GameStateContext.Provider>
		)
	}
}


export default GameStateContext

export {
	GameStateContext,
	GameStateListenerAndProvider,
}
