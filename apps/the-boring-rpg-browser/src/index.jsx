import React from 'react'
import 'babel-polyfill'
import ReactDOM from 'react-dom'
//import 'react-circular-progressbar/dist/styles.css'

import './services/raven'
import './index.css'
import Root from './components/root'

// TODO remove
import get_game_instance from './services/game-instance-browser'
import GameContext from './game-context'

ReactDOM.render(
	<GameContext.Provider value={get_game_instance()}>
		<Root />
	</GameContext.Provider>,
	document.getElementById('root'),
)
