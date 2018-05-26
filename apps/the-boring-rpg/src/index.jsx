"use strict";

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import 'react-circular-progressbar/dist/styles.css'

import './index.css'
import Root from './components/root'

import GameContext, { game_instance } from './game-context'


ReactDOM.render(
	<GameContext.Provider value={game_instance}>
		<Root />
	</GameContext.Provider>,
	document.getElementById('root'),
)
