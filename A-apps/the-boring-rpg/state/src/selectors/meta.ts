import { Immutable} from '@offirmo-private/ts-types'

import { State } from '../types'

/////////////////////

function has_account(state: Immutable<State>): boolean {
	return state.u_state.meta.is_logged_in
}

function is_alpha(): boolean {
	return true // TODO alpha
}

function is_player_since_alpha(state: Immutable<State>): boolean {
	return true // TODO check date
}

function is_registered_alpha_player(state: Immutable<State>): boolean {
	return state.u_state.meta.roles.includes('tbrpg:alpha')
}


export {
	has_account,
	is_alpha,
	is_player_since_alpha,
	is_registered_alpha_player,
}
