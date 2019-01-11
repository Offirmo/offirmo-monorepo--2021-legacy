import {
	get_available_energy_float as _get_available_energy_float,
	get_human_time_to_next,
} from '@oh-my-rpg/state-energy'

import { State } from '../types'

/////////////////////

function get_available_energy_float(state: Readonly<State>): number {
	return _get_available_energy_float(state.energy[1])
}

function get_human_time_to_next_energy(state: Readonly<State>): string {
	return get_human_time_to_next(...state.energy)
}

/////////////////////

export {
	get_available_energy_float,
	get_human_time_to_next_energy,
}
