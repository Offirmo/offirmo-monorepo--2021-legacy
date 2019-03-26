import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	DEFAULT_SEED,
	create,

	set_seed,
	update_use_count,

	get_prng,
	generate_random_seed,

	xxx_internal_reset_prng_cache,
} from '.'

describe('@oh-my-rpg/state-prng - get', function() {
	beforeEach(xxx_internal_reset_prng_cache)

	it('should return a working PRNG engine', function() {
		const state = create()

		const prng = get_prng(state)

		expect(Random.integer(0, 10)(prng), 'random 1').to.equal(2)
		expect(Random.integer(0, 10)(prng), 'random 2').to.equal(5)
		expect(Random.integer(0, 10)(prng), 'random 3').to.equal(7)
		expect(Random.integer(0, 10)(prng), 'random 4').to.equal(0)
		expect(Random.integer(0, 10)(prng), 'random 5').to.equal(0)
		expect(Random.integer(0, 10)(prng), 'random 6').to.equal(3)
		expect(Random.integer(0, 10)(prng), 'random 7').to.equal(6)
		expect(Random.integer(0, 10)(prng), 'random 8').to.equal(10)
	})

	it('should return a repeatable PRNG engine', function() {
		let state = create()

		let prng = get_prng(state)
		expect(Random.integer(0, 10)(prng), 'random 1').to.equal(2)
		expect(Random.integer(0, 10)(prng), 'random 2').to.equal(5)
		state = update_use_count(state, prng)
		expect(Random.integer(0, 10)(prng), 'random 3a').to.equal(7)
		expect(Random.integer(0, 10)(prng), 'random 4a').to.equal(0)

		xxx_internal_reset_prng_cache()
		prng = get_prng(state)
		expect(Random.integer(0, 10)(prng), 'random 3b').to.equal(7)
		expect(Random.integer(0, 10)(prng), 'random 4b').to.equal(0)
	})
})
