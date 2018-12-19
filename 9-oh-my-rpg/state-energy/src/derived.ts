import Fraction from 'fraction.js'

import { LIB } from './consts'

import {
	UState,
	TState,
	Derived,
} from './types'

import { round_float, time_to_human } from './utils'

const ENERGY_ROUNDING = 1_000_000


const DEBUG = false
function get_derived(
	// no array to ease memoization
	u_state: Readonly<UState>,
	t_state: Readonly<TState>,
): Readonly<Derived> {
	if (DEBUG) console.log('\nstarting derived computation', { u_state, t_state })

	const ENERGY_REFILLING_RATE_PER_S = (new Fraction(u_state.energy_refilling_rate_per_ms)).mul(1000).valueOf()
	const energy = new Fraction(t_state.available_energy)
	const available_energy_float = energy.round(2).valueOf()
	const available_energy_int = Math.trunc(available_energy_float)

	// compute time-to-next energy if applicable
	let human_time_to_next = ''
	let next_energy_refilling_ratio = 0
	if (energy.compare(u_state.max_energy) < 0) {
		const dec = available_energy_float - Math.trunc(available_energy_float)
		const sec_until_next = Math.trunc((1 - dec) / ENERGY_REFILLING_RATE_PER_S)
		human_time_to_next = time_to_human(sec_until_next)
		next_energy_refilling_ratio = round_float(dec, ENERGY_ROUNDING)
	}

	/*
	// base = all max
	const MAX_ENERGY_FLOAT = parseFloat(state.max_energy as any)
	const snapshot: Snapshot = {
		available_energy: state.max_energy,
		available_energy_float: MAX_ENERGY_FLOAT,
		total_energy_refilling_ratio: 1,
		next_energy_refilling_ratio: 1,
		human_time_to_next: '',
	}

	const t1 = parse_human_readable_UTC_timestamp_ms(state.last_date)
	let energy_float = state.last_available_energy_float

	const ENERGY_REFILLING_RATE_PER_S = state.base_energy_refilling_rate_per_day / (24 * 3600)

	const t2 = now
	if (DEBUG) console.log('⚡️ advancing energy consumption:\n', {date: t2})

	// restore energy consumed since last time
	const elapsed_time_s = ((t2 as any) - (t1 as any)) / 1000.
	if (elapsed_time_s < 0)
		throw new Error(`${LIB}: internal error, past usages in incorrect order!`)
	const restored_energy_float = elapsed_time_s * ENERGY_REFILLING_RATE_PER_S
	energy_float = Math.min(energy_float + restored_energy_float, MAX_ENERGY_FLOAT)
	if (DEBUG) console.log('restored energy at this date:', {elapsed_time_s, restored_energy_float, energy_float})

	snapshot.available_energy = Math.trunc(energy_float)
	// restrict resolution for simplicity and testability
	snapshot.available_energy_float = round_float(energy_float, ENERGY_ROUNDING)
	snapshot.total_energy_refilling_ratio = round_float(energy_float / MAX_ENERGY_FLOAT)
*/
	return {
		available_energy_int,
		available_energy_float,
		human_time_to_next,
		next_energy_refilling_ratio,
	}
}


export {
	ENERGY_ROUNDING,
	get_derived,
}
