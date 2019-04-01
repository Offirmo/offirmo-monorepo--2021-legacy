import Fraction from 'fraction.js'

import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { LIB, TICK_MS } from './consts'
import { UState, TState } from './types'
import { time_to_human } from './utils'

////////////////////////////////////

function get_current_energy_refilling_rate_per_ms(u_state: Readonly<UState>, t_state: Readonly<TState>, ): Fraction {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_current_energy_refilling_rate_per_ms() called on outdated state!`)
	}

	const { C1, total_energy_consumed_so_far } = u_state
	const total_energy_refilled_so_far = total_energy_consumed_so_far + get_available_energy_int(t_state)

	if (total_energy_refilled_so_far === 0)
		return new Fraction(100_000, 1) // = immediate. To aavoid dividing by 0

	const final_energy_refilling_rate_per_ms = new Fraction(u_state.final_energy_refilling_rate_per_ms)

	return new Fraction(C1, total_energy_refilled_so_far).add(final_energy_refilling_rate_per_ms)
}

////////////

/*function get_energy_refilling_rate_per_s(u_state: Readonly<UState>): Fraction {
	return (new Fraction(u_state.energy_refilling_rate_per_ms)).mul(1000)
}*/

function get_milliseconds_to_next(u_state: Readonly<UState>, t_state: Readonly<TState>): Fraction {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_milliseconds_to_next() called on outdated state!`)
	}

	const energy = new Fraction(t_state.available_energy)

	if (energy.compare(u_state.max_energy) >= 0)
		return new Fraction(NaN) // or should throw?

	const energy_refilling_rate_per_ms = get_current_energy_refilling_rate_per_ms(u_state, t_state)
	const available_energy = new Fraction(t_state.available_energy)
	const fractional_available_energy = available_energy.mod(1)
	//console.log('fractional_available_energy', fractional_available_energy.valueOf())
	//console.log('remaining fractional_available_energy', (new Fraction(1)).sub(fractional_available_energy).valueOf())

	// time to next = (1 - frac) / refilling
	return (new Fraction(1)).sub(fractional_available_energy).div(energy_refilling_rate_per_ms)
}

function get_human_time_to_next(u_state: Readonly<UState>, t_state: Readonly<TState>): string {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_human_time_to_next() called on outdated state!`)
	}

	const energy = new Fraction(t_state.available_energy)

	if (energy.compare(u_state.max_energy) >= 0)
		return ''

	const millisec_until_next = get_milliseconds_to_next(u_state, t_state)

	return time_to_human(Math.ceil(millisec_until_next.div(1000).valueOf()))
}

////////////

function get_available_energy_float(t_state: Readonly<TState>): number {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_available_energy_float() called on outdated state!`)
	}

	const available_energy = new Fraction(t_state.available_energy)
	return available_energy.floor(2).valueOf()
}

function get_available_energy_int(t_state: Readonly<TState>): number {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_available_energy_int() called on outdated state!`)
	}

	return Math.floor(get_available_energy_float(t_state))
}

////////////////////////////////////

export {
	get_current_energy_refilling_rate_per_ms,
	get_milliseconds_to_next,
	get_human_time_to_next,
	get_available_energy_float,
}
