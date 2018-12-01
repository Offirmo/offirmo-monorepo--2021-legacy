import React, { StrictMode } from 'react'
import 'babel-polyfill'
import ReactDOM from 'react-dom'
//import 'react-circular-progressbar/dist/styles.css'

import './services/raven'
import './index.css'
import Root from './components/router'
import { GameStateListenerAndProvider } from './context/game-state'

// XXX
import GameContext, { game_instance } from './game-context'

ReactDOM.render(
	<StrictMode>
		<GameContext.Provider value={game_instance}>
			<GameStateListenerAndProvider>
				<Root />
			</GameStateListenerAndProvider>
		</GameContext.Provider>
	</StrictMode>,
	document.getElementById('root'),
)
