import React from 'react'

import get_game_instance from '../services/game-instance'

const DEFAULT_VALUE = {}

const GameStateContext = React.createContext(DEFAULT_VALUE)

class GameStateListenerAndProvider extends React.Component {
	state = {}

	componentDidMount() {
		this.unsubscribe = get_game_instance().subscribe(() => {
			console.log('🔄 GameStateListener: updating on game state change')
			this.setState({})
		})
	}
	componentWillUnmount () {
		this.unsubscribe()
	}

	render() {
		console.log("🔄 GameStateListener");

		// TODO improve state -> overarching state
		return (
			<GameStateContext.Provider value={get_game_instance().get_latest_state()}>
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
