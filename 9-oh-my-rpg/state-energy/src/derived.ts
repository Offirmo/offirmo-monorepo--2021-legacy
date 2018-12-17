import { parse_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps'

import { LIB } from './consts'



// only valid on a specific date
/*interface Snapshot {
	available_energy: number
	available_energy_float: number
	total_energy_refilling_ratio: number // 0-1, 1 = fully refilled

	next_energy_refilling_ratio: number // 0-1, 1 = n/a (fully refilled)
	human_time_to_next: string

	//is_well_rested: boolean
	//good_rest_refilling_ratio: number // 0-1, 1 = fully rested
}

/*

	last_date: HumanReadableTimestampUTCMs
	last_available_energy_float: number
	*/

import {
	UState,
	TState,
	Derived,
} from './types'

import { round_float } from './utils'

const ENERGY_ROUNDING = 1_000_000

function time_to_human(seconds: number): string {
	let human_time = ''

	const s = seconds % 60
	const m = ((seconds - s) / 60) % 60
	const h = (seconds - s - m*60) / 3600

	if (h) human_time += `${h}h`
	if (m) {
		human_time += `${m}`
		if (!h) human_time += 'm'
	}
	if (s && !(h && m)) {
		human_time += `${s}`
		if (!h && !m) human_time += 's'
	}

	return human_time
}

const DEBUG = false
function get_derived(
	u_state: Readonly<UState>,
	t_state: Readonly<TState>,
): Readonly<Derived> {
	if (DEBUG) console.log('\nstarting derived computation', { u_state, t_state })

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

	// compute time-to-next energy if applicable
	if (snapshot.available_energy < state.max_energy) {
		const dec = energy_float - Math.trunc(energy_float)
		const sec_until_next = Math.trunc((1 - dec) / ENERGY_REFILLING_RATE_PER_S)
		snapshot.human_time_to_next = time_to_human(sec_until_next)
		snapshot.next_energy_refilling_ratio = round_float(dec, ENERGY_ROUNDING)
	}

	return snapshot*/
	return {}
}


export {
	ENERGY_ROUNDING,
	get_derived,
}
