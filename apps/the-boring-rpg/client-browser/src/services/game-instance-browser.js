import { Enum } from 'typescript-string-enums'
import bowser from 'bowser'

import { create_game_instance } from '@tbrpg/flux'

import SEC from './sec'
import { init } from './user_account'
import {StorageKey} from '../../../interfaces/src'


let game_instance = null

export const ACCOUNT_STATE = Enum(
	'waiting_for_lib', // needed?
	'pending',
	'not_logged_in',
	'logged_in',
	'error', // needed?
)

const INITIAL_APP_STATE = {
	// can change:
	mode: 'explore',
	recap_displayed: false,
	last_displayed_adventure_uuid: '(see below)',
	model: null, // will be initialized on instance creation
	login_state: ACCOUNT_STATE.waiting_for_lib,
	logged_in_user: null, // so far

	// TODO improve to a new declarative chat
	changing_character_class: false,
	changing_character_name: false,
	redeeming_code: false,
}

const storage = {
	//TbrpgStorage {
	async warm_up() {},
	async cool_down() {},
	set_item(key, value) {
		window.localStorage.setItem(`the-boring-rpg.${key}`, value)
	},
	get_item(key) {
		return window.localStorage.getItem(`the-boring-rpg.${key}`)
	},
}

// migration TODO
/*
window.localStorage.removeItem('the-boring-rpg.savegame-bkp.v11')
window.localStorage.removeItem('the-boring-rpg.savegame-bkp.v10')
window.localStorage.removeItem('the-boring-rpg.savegame-bkp.v9')
window.localStorage.removeItem('the-boring-rpg.savegame-bkp.v8')
window.localStorage.removeItem('the-boring-rpg.savegame-bkp.v7')
window.localStorage.removeItem('the-boring-rpg.savegame-bkp.v6')
*/

SEC.xTry('creating game instance', ({SEC, logger}) => {
	game_instance = create_game_instance({
		SEC,
		storage,
		app_state: {
			...INITIAL_APP_STATE,
		},
	})

	// init
	game_instance.view.set_state(state => {
		const last_adventure = game_instance.queries.get_last_adventure()
		return {
			last_displayed_adventure_uuid: last_adventure && last_adventure.uuid,
		}
	})

	const is_web_diversity_supporter = bowser.name === 'Firefox'
	game_instance.commands.on_start_session(is_web_diversity_supporter)

	init(SEC, game_instance)
})

export default function get() { return game_instance }
