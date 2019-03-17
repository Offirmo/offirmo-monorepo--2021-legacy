import bowser from 'bowser'

//import poll_window_variable from '@offirmo/poll-window-variable'
import { create_game_instance } from '@tbrpg/flux'

import { LS_KEYS } from './consts'
import SEC from './sec'
import { report_error } from './raven'

let game_instance

const INITIAL_APP_STATE = {
	// can change:
	mode: 'explore',
	recap_displayed: false,
	last_displayed_adventure_uuid: '(see below)',
	model: null,

	// TODO improve to a new declarative chat
	changing_character_class: false,
	changing_character_name: false,
	redeeming_code: false,
}

SEC.xTry('creating game instance', ({logger}) => {
	game_instance = create_game_instance({
		SEC,
		local_storage: window.localStorage,
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

	const is_web_diversity_supporter = bowser.name === 'firefox'
	game_instance.commands.on_start_session(is_web_diversity_supporter)
})

export default function get() { return game_instance }
