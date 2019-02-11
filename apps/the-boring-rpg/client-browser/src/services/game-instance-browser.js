//import poll_window_variable from '@offirmo/poll-window-variable'
import { create_game_instance } from '@tbrpg/flux'

import { LS_KEYS } from './consts'
import SEC from './sec'
import { report_error } from './raven'

let game_instance

function get_backup_ls_key(v) {
	return `${LS_KEYS.savegame_backup}.v${v}`
}

SEC.xTry('loading savegame + creating game instance', ({logger}) => {
	logger.verbose(`State storage key = "${LS_KEYS.savegame}"`)

	let state = null

	// LS access can throw
	try {
		let ls_content = localStorage.getItem(LS_KEYS.savegame)
		if (ls_content)
			state = JSON.parse(ls_content)

		// backup
		localStorage.setItem(LS_KEYS.savegame_backup, JSON.stringify(state))
		if (state && state.schema_version) {
			localStorage.setItem(get_backup_ls_key(state.schema_version), JSON.stringify(state))
			for (let i = state.schema_version - 2; i > 0; --i) {
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
		get_latest_state: () => state,
		persist_state: new_state => {
			state = new_state // we are responsible for storing current state, see get_latest_state()
		},
	})

	let last_saved_ls = {}
	game_instance.model.subscribe('local-storage', () => {
		if (last_saved_ls.u_state === state.u_state) return // no need

		console.info(`💾 saving #${state.u_state.revision} to LocalStorage...`)
		localStorage.setItem(LS_KEYS.savegame, JSON.stringify(state))
		last_saved_ls = state
	})

	game_instance.reducers.on_start_session(
		// TODO params
	)
})

SEC.xTry('init client state', () => {
	//const netlifyIdentity = poll_window_variable('netlifyIdentity', { timeoutMs: 30 * 1000 })

	game_instance.view.set_state(() => ({
		// can change:
		mode: 'explore',
		recap_displayed: false,
		last_displayed_adventure_uuid: (() => {
			const last_adventure = game_instance.selectors.get_last_adventure()
			return last_adventure && last_adventure.uuid
		})(),
		// TODO improve to a new react-like chat
		changing_character_class: false,
		changing_character_name: false,
		redeeming_code: false,
	}))
})

export default function get() { return game_instance }
