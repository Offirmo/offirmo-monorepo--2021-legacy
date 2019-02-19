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
	last_displayed_adventure_uuid: 'TODO',
	model: null,

	// TODO improve to a new react-like chat
	changing_character_class: false,
	changing_character_name: false,
	redeeming_code: false,
}

function get_backup_ls_key(v) {
	return `${LS_KEYS.savegame_backup}.v${v}`
}

SEC.xTry('loading savegame + creating game instance', ({logger}) => {
	logger.verbose(`State storage key = "${LS_KEYS.savegame}"`)

	let initial_model = null

	// LS access can throw
	try {
		let ls_content = localStorage.getItem(LS_KEYS.savegame)
		if (ls_content)
			initial_model = JSON.parse(ls_content)

		// backup
		localStorage.setItem(LS_KEYS.savegame_backup, JSON.stringify(initial_model))
		if (initial_model && initial_model.schema_version) {
			localStorage.setItem(get_backup_ls_key(initial_model.schema_version), JSON.stringify(initial_model))
			for (let i = initial_model.schema_version - 2; i > 0; --i) {
				const key = get_backup_ls_key(i)
				if (localStorage.getItem(key)) {
					console.log('cleaning old backup = v', i)
					localStorage.removeItem(key)
				}
			}
		}
	}
	catch (err) {
		report_error(err)
	}

	game_instance = create_game_instance({
		SEC,
		app_state: {
			...INITIAL_APP_STATE,
			model: initial_model,
		}
	})

	game_instance.view.set_state(state => {
		const last_adventure = game_instance.queries.get_last_adventure()
		return {
			last_displayed_adventure_uuid: last_adventure && last_adventure.uuid,
		}
	})

	let last_saved_ls = {}
	game_instance.model.subscribe('local-storage', () => {
		if (last_saved_ls.u_state === initial_model.u_state) return // no need

		console.info(`💾 saving #${initial_model.u_state.revision} to LocalStorage...`)
		localStorage.setItem(LS_KEYS.savegame, JSON.stringify(initial_model))
		last_saved_ls = initial_model
	})

	const is_web_diversity_supporter = bowser.name === 'firefox'
	game_instance.commands.on_start_session(is_web_diversity_supporter)
})

/*
SEC.xTry('init client state', () => {
	//const netlifyIdentity = poll_window_variable('netlifyIdentity', { timeoutMs: 30 * 1000 })

	game_instance.view.set_state(() => ({
		// can change:
		mode: 'explore',
		recap_displayed: false,
		last_displayed_adventure_uuid: (() => {
			const last_adventure = game_instance.queries.get_last_adventure()
			return last_adventure && last_adventure.uuid
		})(),
		// TODO improve to a new react-like chat
		changing_character_class: false,
		changing_character_name: false,
		redeeming_code: false,
	}))
})
*/

export default function get() { return game_instance }
