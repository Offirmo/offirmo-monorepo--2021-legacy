"use strict";

import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'

const { create_game_instance } = require('@oh-my-rpg/state-the-boring-rpg')

import { LS_KEYS } from './services/consts'
import { SEC } from './services/init'
import { App } from './components/app'

const workspace = {
	version: VERSION,
	verbose: true, // XXX
	state: null,
	SEC,
}

SEC.xTry('loading savegame', ({logger}) => {
	logger.verbose(`Storage key: "${LS_KEYS.savegame}"`)
	const lscontent = localStorage.getItem(LS_KEYS.savegame)

	let state = null
	try {
		if (lscontent)
			state = JSON.parse(lscontent)
	}
	catch (err) {
		// no need
	}

	const instance = create_game_instance({
		SEC,
		get_latest_state: () => state,
		update_state: new_state => {
			state = new_state // needed?
			localStorage.setItem(LS_KEYS.savegame, JSON.stringify(state))
		},
	})

	workspace.instance = instance
})


ReactDOM.render(
	<App workspace={workspace}/>,
	document.getElementById('root')
)
