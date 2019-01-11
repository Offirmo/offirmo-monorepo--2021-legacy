import { State } from '../types'

/////////////////////

function has_account(state: Readonly<State>): boolean {
	return false // TODO
}

function is_alpha(): boolean {
	return true
}

function is_player_since_alpha(state: Readonly<State>): boolean {
	return true // TODO check date
}

function is_registered_alpha_player(state: Readonly<State>): boolean {
	return true // TODO
}


export {
	has_account,
	is_alpha,
	is_player_since_alpha,
	is_registered_alpha_player,
}
