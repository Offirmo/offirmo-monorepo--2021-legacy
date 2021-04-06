import { Immutable} from '@offirmo-private/ts-types'

import {
	get_available_energy_float as _get_available_energy_float,
	get_human_time_to_next,
} from '@oh-my-rpg/state-energy'

import { State, TState } from '../types'

/////////////////////

function get_available_energy_float(t_state: Immutable<TState>): number {
	return _get_available_energy_float(t_state.energy)
}

function get_human_time_to_next_energy({u_state, t_state}: Immutable<State>): string {
	return get_human_time_to_next(u_state.energy, t_state.energy)
}

/////////////////////

export {
	get_available_energy_float,
	get_human_time_to_next_energy,
}
