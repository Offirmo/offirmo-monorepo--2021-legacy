import assert from 'tiny-invariant'
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

	// allow an "onboarding" regeneration rate:
	// where energy regenerates faster at the beginning
	// Formula: https://www.desmos.com/calculator/s1kpakvnjw
	//                                        onboarding_coeff
	// refilling rate = floor(--------------------------------------------- + final_energy_refilling_rate_per_ms)
	//                        total_energy_refilled_so_far^onboarding_power

	const { total_energy_consumed_so_far } = u_state
	const total_energy_refilled_so_far = total_energy_consumed_so_far + get_available_energy_int(t_state)

	if (total_energy_refilled_so_far === 0)
		return new Fraction(1, 1) // = to avoid dividing by 0

	const onboarding_coeff = 10
	const onboarding_power = 4
	const established_energy_refilling_rate_per_ms = new Fraction(
		// 7/24h, in ms
		7,
		24 * 3600 * 1000,
	)

	const onboarding_energy_refilling_rate_per_ms = new Fraction(
		onboarding_coeff,
		Math.pow(total_energy_refilled_so_far, onboarding_power)
	)

	return (
		onboarding_energy_refilling_rate_per_ms
		.add(established_energy_refilling_rate_per_ms)
		// for rounding reasons, we floor() the result
		// established = 7/day = ~0.000000081028970/ms
		.floor(12) // seen dropping the /day rate at 10
	)
}

////////////

function get_milliseconds_to_next(u_state: Readonly<UState>, t_state: Readonly<TState>): number {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		/*console.log('outdated:', {
			TICK_MS,
			't_state.timestamp_ms': t_state.timestamp_ms,
			UTC_timestamp_ms: get_UTC_timestamp_ms()
		})*/
		console.warn(`${LIB}.get_milliseconds_to_next() called on outdated state!`)
	}

	const available_energy = new Fraction(t_state.available_energy)

	if (available_energy.compare(u_state.max_energy) >= 0)
		throw new Error(`${LIB}.get_milliseconds_to_next() called with no next!`)

	const energy_refilling_rate_per_ms = get_current_energy_refilling_rate_per_ms(u_state, t_state)
	const fractional_available_energy = available_energy.mod(1)
	//console.log('fractional_available_energy', fractional_available_energy.valueOf())
	//console.log('remaining fractional_available_energy', (new Fraction(1)).sub(fractional_available_energy).valueOf())

	// time to next = (1 - frac) / refilling
	const ttn =(
		(new Fraction(1))
			.sub(fractional_available_energy)
			.div(energy_refilling_rate_per_ms)
			.round(0)
			.valueOf()
	)

	// if 0, sth is wrong
	assert(ttn > 0, `${LIB}.get_milliseconds_to_next() should never return 0!`)

	return ttn
}

function get_human_time_to_next(u_state: Readonly<UState>, t_state: Readonly<TState>): string {
	if (t_state.timestamp_ms + TICK_MS < get_UTC_timestamp_ms()) {
		console.warn(`${LIB}.get_human_time_to_next() called on outdated state!`)
	}

	const energy = new Fraction(t_state.available_energy)

	if (energy.compare(u_state.max_energy) >= 0)
		return ''

	const millisec_until_next = get_milliseconds_to_next(u_state, t_state)
	const sec_until_next = Math.ceil(millisec_until_next / 1000.)
	return time_to_human(sec_until_next)
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
