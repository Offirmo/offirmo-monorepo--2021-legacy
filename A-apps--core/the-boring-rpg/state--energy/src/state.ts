/////////////////////

import assert from 'tiny-invariant'
import Fraction from 'fraction.js'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { get_logger } from '@tbrpg/definitions'

import { LIB, SCHEMA_VERSION, TICK_MS } from './consts'
import { UState, TState } from './types'
import {
	get_milliseconds_to_next,
	get_human_time_to_next,
	get_current_energy_refilling_rate_per_ms, get_available_energy_float,
} from './selectors'

const DEBUG = false

/////////////////////

// TODO now should be set through sinon, no need
function create(now_ms?: TimestampUTCMs): [ Readonly<UState>, Readonly<TState> ] {
	const u_state: UState = {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		max_energy: 7,
		total_energy_consumed_so_far: 0,
	}

	const t_state: TState = {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		timestamp_ms: now_ms || 0, // 0 makes it easier for unit tests
		available_energy: {
			n: u_state.max_energy,
			d: 1,
		},
	}

	return [ u_state, t_state ]
}

/////////////////////
// date can be forced for testing reasons,

function update_to_now(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms(),
): Readonly<TState> {
	const elapsed_time_ms = now_ms - t_state.timestamp_ms
	if (DEBUG) console.log('- UTN: starting...')

	assert(now_ms === 0 || now_ms > 10_000, `${LIB}.update_to_now(): Wrong new Date(value) usage?`)

	if (elapsed_time_ms < 0) {
		// time went backward? Must be a "daylight saving".
		get_logger().warn(`${LIB}.update_to_now(): Time went backward. Daylight saving?`)
		// just do nothing while time is not positive again
		return t_state
	}

	if (elapsed_time_ms < TICK_MS) {
		if (DEBUG) console.log('       less than a tick.')
		//console.warn('E.update_to_now: high frequency, skipping')
		return t_state
	}

	let available_energy = new Fraction(t_state.available_energy)
	const initial_available_energy = new Fraction(t_state.available_energy)

	/* NOOOOOOO!
	 * update_to_now is prelude to energy manipulation
	 * if not updating the "now" prop, removing energy while keeping an old time may yield full energy immediately
	 * this is not what we want!!!
	if (available_energy.compare(u_state.max_energy) >= 0) {
		console.log('E.update_to_now: energy already max', available_energy.compare(u_state.max_energy))
		return t_state
	}
	*/

	t_state = {
		...t_state,
		timestamp_ms: now_ms,
	}

	/*console.log({
		available_energy: t_state.available_energy,
		max_energy: u_state.max_energy,
		comp: available_energy.compare(u_state.max_energy),
	})*/

	// due to onboarding,
	// energy refill rate may change at each rounded energy re-gained.
	// we need to refill energy 1 by 1
	let time_left_to_process_ms = elapsed_time_ms
	let safety_counter = 10
	let energy_gain_per_ms = new Fraction(1)
	let energy_gained_in_this_iteration = new Fraction(1)
	while(time_left_to_process_ms > 0) {
		if (DEBUG) console.log(`       - time left to process: ${time_left_to_process_ms}ms...`)
		safety_counter--
		assert(safety_counter > 0, 'UTN: infinite loop?')

		if (DEBUG) console.log(`         available energy: ${available_energy.valueOf()}`)

		if (available_energy.compare(u_state.max_energy) >= 0) {
			if (DEBUG) console.log('         energy is full, no need to refill further')
			time_left_to_process_ms = 0
			continue
		}

		// there is energy to refill

		const time_to_next_ms = get_milliseconds_to_next(u_state, t_state)
		if (DEBUG) console.log(`         time to next = ${time_to_next_ms}ms`)
		if (DEBUG) console.log(`                      = ${get_human_time_to_next(u_state, t_state)}`)

		const time_handled_in_this_iteration_ms = Math.min(time_left_to_process_ms, time_to_next_ms)

		if (time_handled_in_this_iteration_ms === time_to_next_ms) {
			// try to avoid rounding issues
			const new_energy = (new Fraction(available_energy)).add(1).floor(0)
			energy_gained_in_this_iteration = (new Fraction(new_energy)).sub(available_energy)
			available_energy = new_energy
		}
		else {
			energy_gain_per_ms = get_current_energy_refilling_rate_per_ms(u_state, t_state)
			energy_gained_in_this_iteration = energy_gain_per_ms.mul(time_handled_in_this_iteration_ms)
			available_energy = available_energy.add(energy_gained_in_this_iteration)
		}
		if (DEBUG) console.log(`         time handled = ${time_handled_in_this_iteration_ms}ms`)
		if (DEBUG) console.log(`         refilled energy = +${energy_gained_in_this_iteration.valueOf()}`)
		assert(energy_gained_in_this_iteration.valueOf() > 0, 'UTN: no energy gain in a loop!')
		time_left_to_process_ms -= time_handled_in_this_iteration_ms
		if (DEBUG) console.log(`         energy refilled to: ${available_energy.valueOf()}`)
		t_state = {
			...t_state,
			available_energy: {
				n: available_energy.n,
				d: available_energy.d,
			},
		}
	}

	if (available_energy.compare(u_state.max_energy) > 0) {
		// too big: cap it
		available_energy = new Fraction(u_state.max_energy)
	}

	if (DEBUG) console.log(`       done! available energy = ${available_energy.valueOf()}`)
	if (DEBUG) console.log(`             refilled energy = +${available_energy.sub(initial_available_energy).valueOf()}`)

	return {
		...t_state,

		available_energy: {
			n: available_energy.n,
			d: available_energy.d,
		},

		// no revision upgrade, this is just a time change
	}
}


function use_energy(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	qty: number = 1,
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms(),
): [ Readonly<UState>, Readonly<TState> ] {
	if (now_ms < t_state.timestamp_ms)
		throw new Error(`${LIB}: time went backward! (cheating attempt?)`)

	t_state = update_to_now([u_state, t_state], now_ms)

	const available_energy = new Fraction(t_state.available_energy).sub(qty)
	if (available_energy.s < 0) {
		throw new Error(`${LIB}: not enough energy left!`)
	}

	u_state = {
		...u_state,

		total_energy_consumed_so_far: u_state.total_energy_consumed_so_far + qty,

		revision: u_state.revision + 1,
	}
	t_state = {
		...t_state,

		available_energy: {
			// don't store sign
			n: available_energy.n,
			d: available_energy.d,
		},

		revision: t_state.revision + 1,
	}

	return [ u_state, t_state ]
}


// can be used as a punishment
function lose_all_energy(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	qty: number = 1,
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms(),
): Readonly<TState> {
	t_state = {
		...t_state,

		timestamp_ms: now_ms,

		available_energy: {
			n: 0,
			d: 1,
		},

		revision: t_state.revision + 1,
	}

	return t_state
}


// seldom used, for ex. by secret codes or for tests
function restore_energy(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	qty: number = 1,
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms(),
): Readonly<TState> {

	t_state = update_to_now([u_state, t_state], now_ms)

	let available_energy = new Fraction(t_state.available_energy).add(qty)
	if (available_energy.compare(u_state.max_energy) > 0)
		available_energy = new Fraction(u_state.max_energy)

	t_state = {
		...t_state,

		available_energy: {
			n: available_energy.n,
			d: available_energy.d,
		},
	}

	return t_state
}


/////////////////////

export {
	create,

	update_to_now,

	use_energy,
	lose_all_energy,
	restore_energy,
}

/////////////////////
