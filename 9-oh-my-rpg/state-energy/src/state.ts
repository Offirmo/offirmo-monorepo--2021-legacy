/////////////////////

import Fraction from 'fraction.js'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo/timestamps'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	UState,
	TState,
} from './types'

//import { parse_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps'

/////////////////////

// roughly the amount of time for a change to be worth a display
const TICK_MS = 500

/////////////////////

function create(): [ Readonly<UState>, Readonly<TState> ] {
	const u_state: UState = {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		max_energy: 7,

		energy_refilling_rate_per_ms: {
			// 7/24h, in ms
			n: 7,
			d: 24 * 3600 * 1000,
		}
	}

	const t_state: TState = {
		schema_version: SCHEMA_VERSION,

		timestamp_ms: get_UTC_timestamp_ms(new Date(0)),
		available_energy: {
			n: u_state.max_energy,
			d: 1,
		}
	}

	return [ u_state, t_state ]
}

/////////////////////
// date can be forced for testing reasons,

function update_to_now(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms()
): Readonly<TState> {
	const elapsed_time_ms = now_ms - t_state.timestamp_ms

	if (elapsed_time_ms < 0) {
		// time went backward? Must be a time saving.
		// just do nothing while time is note positive again
		return t_state
	}

	if (elapsed_time_ms < TICK_MS)
		return t_state

	// TODO derived?
	const energy_gain_per_ms = new Fraction(u_state.energy_refilling_rate_per_ms)
	const energy_gained_since_last_time = energy_gain_per_ms.mul(elapsed_time_ms)
	let energy = (new Fraction(t_state.available_energy)).add(energy_gained_since_last_time)
	if (energy.compare(u_state.max_energy) > 0)
		energy = new Fraction(u_state.max_energy)

	return {
		...t_state,

		timestamp_ms: t_state.timestamp_ms + elapsed_time_ms,

		available_energy: {
			n: energy.n,
			d: energy.d,
		}
	}
}


function use_energy(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	qty: number = 1,
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms()
): Readonly<TState> {
	if (now_ms < t_state.timestamp_ms)
		throw new Error(`${LIB}: time went backward! (cheating attempt?)`)

	t_state = update_to_now([u_state, t_state], now_ms)

	const available_energy = new Fraction(t_state.available_energy).sub(qty)
	if (available_energy.s < 0) {
		//console.error({state, qty, snapshot})
		throw new Error(`${LIB}: not enough energy left!`)
	}

	t_state = {
		...t_state,

		available_energy: {
			n: available_energy.n,
			d: available_energy.d,
		}
	}

	return t_state
}


// can be used as a punishment
function loose_all_energy(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	qty: number = 1,
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms()
): Readonly<TState> {
	t_state = {
		...t_state,

		timestamp_ms: now_ms,

		available_energy: {
			n: 0,
			d: 1,
		}
	}

	return t_state
}


// seldom used, for ex. by secret codes or for tests
function restore_energy(
	[ u_state, t_state ]: [ Readonly<UState>, Readonly<TState> ],
	qty: number = 1,
	now_ms: TimestampUTCMs = get_UTC_timestamp_ms()
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
		}
	}

	return t_state
}


/////////////////////

export {
	create,

	update_to_now,

	use_energy,
	loose_all_energy,
	restore_energy,
}

/////////////////////
