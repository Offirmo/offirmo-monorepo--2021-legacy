"use strict";

import React from 'react';
import { create_game_instance } from '@oh-my-rpg/state-the-boring-rpg'

import { LS_KEYS } from './services/consts'
import { SEC } from './services/init'
import { GameInstanceProvider } from './components/context/game-instance-provider'
import TheBoringRPGComponent from './component'

const workspace = {
	version: 'TODO',
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
	instance.set_client_state(() => ({
		alpha_warning_displayed: false,
		recap_displayed: false,
		last_displayed_adventure_uuid: (() => {
			const { last_adventure } = state
			return last_adventure && last_adventure.uuid
		})()
	}))

	workspace.instance = instance
})


export default function TheBoringRPGConnected() {
	return (
		<GameInstanceProvider instance={workspace.instance}>
			<TheBoringRPGComponent />
		</GameInstanceProvider>
	)
}
