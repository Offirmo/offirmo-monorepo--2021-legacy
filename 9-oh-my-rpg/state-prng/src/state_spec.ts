import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'

import { LIB_ID, SCHEMA_VERSION } from './consts'

import {
	DEFAULT_SEED,
	create,

	set_seed,
	update_use_count,

	get_prng,
	generate_random_seed,

	xxx_internal_reset_prng_cache,
} from '.'

describe('🎲  Persistable PRNG state - reducer', function() {
	beforeEach(xxx_internal_reset_prng_cache)

	describe('🆕  initial value', function() {

		it('should have correct defaults', function() {
			const state = create()

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				seed: DEFAULT_SEED,
				use_count: 0,
			})
		})
	})

	describe('🌰  set seed', function() {

		it('should work and reset use count')
	})

	describe('update after use', function() {

		it('should correctly persist prng state', function() {
			let state = create()

			let prng = get_prng(state)
			expect(Random.integer(0, 10)(prng), 'random 1').to.equal(2)
			expect(Random.integer(0, 10)(prng), 'random 2').to.equal(5)

			state = update_use_count(state, prng)
			expect(state.use_count).to.equal(2)
		})
	})

	describe('get_prng', function() {

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

	describe('generate_random_seed', function() {

		it('should return a random seed', function () {
			const s1 = generate_random_seed()
			const s2 = generate_random_seed()
			const s3 = generate_random_seed()

			expect(s1).not.to.equal(s2)
			expect(s1).not.to.equal(s3)
			expect(s2).not.to.equal(s3)
		})
	})
})
