"use strict";

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import Root from './components/root'
//import Root from './components/universe-anchor/connected'

import GameContext, { game_instance } from './game-context'


ReactDOM.render(
	<GameContext.Provider value={game_instance}>
		<Root />
	</GameContext.Provider>,
	document.getElementById('root'),
)
