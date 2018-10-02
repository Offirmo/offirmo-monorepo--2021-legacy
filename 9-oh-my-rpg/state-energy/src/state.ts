/////////////////////

import deepFreeze from 'deep-freeze-strict'

import { get_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
} from './types'

import { get_snapshot } from './snapshot'
import { parse_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps'

/////////////////////


function create(): Readonly<State> {
	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		max_energy: 7,
		base_energy_refilling_rate_per_day: 7,

		last_date: get_human_readable_UTC_timestamp_ms(new Date(0)),
		last_available_energy_float: 7.,
	}
}

/////////////////////
// date can be forced for testing reasons,

function use_energy(state: Readonly<State>, qty: number = 1, date: Date = new Date()): Readonly<State> {
	if (date < parse_human_readable_UTC_timestamp_ms(state.last_date))
		throw new Error(`${LIB}: time went backward! (cheating attempt?)`)

	const snapshot = get_snapshot(state, date)

	if (qty > snapshot.available_energy) {
		//console.error({state, qty, snapshot})
		throw new Error(`${LIB}: not enough energy left!`)
	}

	state = {
		...state,

		revision: state.revision + 1,

		last_date: get_human_readable_UTC_timestamp_ms(date),
		last_available_energy_float: snapshot.available_energy_float - qty,
	}

	return state
}

// can be used as a punishment
function loose_all_energy(state: Readonly<State>, date: Date = new Date()): Readonly<State> {
	state = {
		...state,

		revision: state.revision + 1,

		last_date: get_human_readable_UTC_timestamp_ms(date),
		last_available_energy_float: 0.,
	}

	return state
}

// TODO time elapse
function replenish_energy(state: Readonly<State>, date: Date = new Date()): Readonly<State> {
	state = {
		...state,

		revision: state.revision + 1,

		last_date: get_human_readable_UTC_timestamp_ms(date),
		last_available_energy_float: state.max_energy * 1.,
	}

	return state
}

/////////////////////

export {
	State,

	create,

	use_energy,
	loose_all_energy,
	replenish_energy,
}

/////////////////////
