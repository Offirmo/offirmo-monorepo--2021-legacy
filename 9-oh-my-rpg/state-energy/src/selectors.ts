import Fraction from 'fraction.js'

import { get_UTC_timestamp_ms } from '@offirmo/timestamps'

import { LIB, TICK_MS } from './consts'
import { UState, TState } from "./types"
import { time_to_human} from "./utils"

/////////////////////

function get_energy_refilling_rate_per_s(u_state: Readonly<UState>): Fraction {
	return (new Fraction(u_state.energy_refilling_rate_per_ms)).mul(1000)
}

function get_available_energy_float(t_state: Readonly<TState>): number {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_available_energy_float called on outdated state!`)
	}

	const available_energy = new Fraction(t_state.available_energy)
	return available_energy.round(2).valueOf()
}

function get_human_time_to_next(u_state: Readonly<UState>, t_state: Readonly<TState>): string {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_available_energy_float called on outdated state!`)
	}

	const energy = new Fraction(t_state.available_energy)

	if (energy.compare(u_state.max_energy) >= 0)
		return ''

	const energy_refilling_rate_per_s = get_energy_refilling_rate_per_s(u_state)
	const available_energy = new Fraction(t_state.available_energy)
	const fractional_available_energy = available_energy.mod(1)
	//console.log('fractional_available_energy', fractional_available_energy.valueOf())
	//console.log('remaining fractional_available_energy', (new Fraction(1)).sub(fractional_available_energy).valueOf())
	// time to next = (1 - frac) / refilling
	const sec_until_next = (new Fraction(1)).sub(fractional_available_energy).div(energy_refilling_rate_per_s)

	return time_to_human(Math.ceil(sec_until_next.valueOf()))
}

/////////////////////

export {
	//get_energy_refilling_rate_per_s,
	get_available_energy_float,
	get_human_time_to_next,
}
