/////////////////////

import assert from 'tiny-invariant'
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { Random, MT19937 } from '@offirmo/random'

import { get_logger } from '@tbrpg/definitions'

import { LIB } from './consts'
import { MT19937WithSeed, State } from './types'

/////////////////////

// get_prng() is an ideal checkpoint to detect a lot of bugs and misuses.
// We offer several implementations, dev (checking) and prod.
// TODO optimized version? (thanks to uuid)
let mode = 'dev' // TODO default to prod, later

/////////////////////

// inefficient but simple version
function get_prng_simple(state: Immutable<State>): MT19937WithSeed {
	const prng: MT19937WithSeed = Random.engines.mt19937().seed(state.seed)
	prng._seed = state.seed
	prng.discard(state.use_count)

	return prng
}

/////////////////////

// since
// - we MUST use only one, repeatable PRNG
// - we can't store the prng in the state
// - we must configure it once at start
// we use a global cache to not having to recreate the prng each time.
// Also, we control that the usage conforms to those expectations.

let cached_prngs: {
	[k: string]: MT19937WithSeed | null
} = {}

function xxx_internal_reset_prng_cache() {
	assert(mode === 'dev', `${LIB}: dev utils require dev mode!`)
	cached_prngs = {}
}

// WARNING this method has expectations ! (see above)
function get_prng_dev(state: Immutable<State>): MT19937WithSeed {
	/*console.trace('get PRNG', {
     state,
     cached_prng,
     'cached_prng.getUseCount()': cached_prng.getUseCount(),
 })*/
	const key = state.uuid

	const cached_prng = cached_prngs[key]

	if (!cached_prng) {
		cached_prngs[key] = get_prng_simple(state)
		return cached_prngs[key]!
	}

	if (cached_prng._seed !== state.seed) {
		// ok, a reseed happened, allowed
		cached_prng.seed(state.seed)
		cached_prng._seed = state.seed // maintain this extra property TODO improve the lib instead
		assert(cached_prng.getUseCount() === 0, 'freshly re-seeded prng')
	}

	if (cached_prng.getUseCount() !== state.use_count) {
		// should never happen, this is the bug what we are after
		const msg = `${LIB}: get_prng(): unexpected case: mismatching use_count!`
		get_logger().error(msg, {
			cached_use_count: cached_prng.getUseCount(),
			required_use_count: state.use_count,
		})
		throw new Error(msg)
	}

	return cached_prng
}

/////////////////////

function get_prng(state: Immutable<State>): MT19937WithSeed {
	if (mode === 'dev')
		return get_prng_dev(state)

	return get_prng_simple(state)
}

function switch_mode(new_mode: 'prod' | 'dev'): void {
	mode = new_mode
}

/////////////////////

export {
	switch_mode,

	get_prng,

	// exposed for testability, do not use !
	xxx_internal_reset_prng_cache,
}

/////////////////////
