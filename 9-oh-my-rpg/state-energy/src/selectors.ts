import Fraction from 'fraction.js'

import { UState, TState } from "./types"
import { time_to_human} from "./utils"

/////////////////////

function get_energy_refilling_rate_per_s(u_state: Readonly<UState>): number {
	return (new Fraction(u_state.energy_refilling_rate_per_ms)).mul(1000).valueOf()
}

function get_available_energy_float(t_state: Readonly<TState>): number {
	const available_energy = new Fraction(t_state.available_energy)
	return available_energy.round(2).valueOf()
}

function get_human_time_to_next(u_state: Readonly<UState>, t_state: Readonly<TState>): string {
	const energy = new Fraction(t_state.available_energy)

	if (energy.compare(u_state.max_energy) >= 0)
		return ''

	const energy_refilling_rate_per_s = get_energy_refilling_rate_per_s(u_state)
	const available_energy_float = get_available_energy_float(t_state)
	const fractional = available_energy_float - Math.trunc(available_energy_float)
	const sec_until_next = Math.trunc((1 - fractional) / energy_refilling_rate_per_s)

	return time_to_human(sec_until_next)
}

/////////////////////

export {
	//get_energy_refilling_rate_per_s,
	get_available_energy_float,
	get_human_time_to_next,
}
