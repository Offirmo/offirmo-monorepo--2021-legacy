/////////////////////

import assert from 'tiny-invariant'
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { Random, MT19937 } from '@offirmo/random'
import { generate_uuid } from '@offirmo-private/uuid'

import { get_logger } from '@tbrpg/definitions'

import { LIB, SCHEMA_VERSION } from './consts'
import { MT19937WithSeed, State } from './types'

/////////////////////

const DEFAULT_SEED = 987

function create(seed: number = DEFAULT_SEED): Immutable<State> {
	return {
		schema_version: SCHEMA_VERSION,
		uuid: generate_uuid(),
		revision: 0,

		seed, // up to the caller to change it
		use_count: 0,

		recently_encountered_by_id: {},
	}
}

/////////////////////

function set_seed(state: Immutable<State>, seed: number): Immutable<State> {
	return {
		...state,

		seed,
		use_count: 0, // back to 0

		revision: state.revision + 1,
	}
}

function update_use_count(state: Immutable<State>, prng: MT19937, options: any = {}): Immutable<State> {
	assert(
		(prng as MT19937WithSeed)._seed === state.seed,
		`${LIB}: update PRNG state: different seed (different prng?)!`,
	)

	const new_use_count = prng.getUseCount()

	if (new_use_count === state.use_count) {
		if (!options.I_swear_I_really_cant_know_whether_the_rng_was_used) {
			const err = new Error(`[Warning] ${LIB}: update PRNG state: count hasn't changed = no random was generated! This is most likely a bug, check your code!`).stack
			get_logger().warn('update_use_count no change!', { err })
		}
		return state
	}

	assert(
		new_use_count > state.use_count,
		`${LIB}: update PRNG state: count is <= previous count, this is unexpected! Check your code!`,
	)

	return {
		...state,

		use_count: new_use_count,

		revision: state.revision + 1,
	}
}

function register_recently_used(state: Immutable<State>, id: string, value: number | string, max_memory_size: number): Immutable<State> {
	if (max_memory_size === 0)
		return state

	let recently_encountered = state.recently_encountered_by_id[id] || []
	recently_encountered = recently_encountered.concat(value).slice(-max_memory_size)

	return {
		...state,

		recently_encountered_by_id: {
			...state.recently_encountered_by_id,

			[id]: recently_encountered,
		},

		revision: state.revision + 1,
	}
}

/////////////////////

export {
	State,
	DEFAULT_SEED,
	create,

	set_seed,
	update_use_count,
	register_recently_used,
}

/////////////////////
