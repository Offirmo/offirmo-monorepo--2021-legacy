import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'
import { xxx_test_unrandomize_element } from '@tbrpg/definitions'

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

describe('@oh-my-rpg/state-prng - reducer', function() {
	beforeEach(xxx_internal_reset_prng_cache)

	describe('🆕  initial value', function() {

		it('should have correct defaults', function() {
			const state = xxx_test_unrandomize_element(create())

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				'uuid': 'uu1~test~test~test~test~',
				revision: 0,

				seed: DEFAULT_SEED,
				use_count: 0,

				recently_encountered_by_id: {},
			})
		})
	})

	describe('🌰  set seed', function() {

		it('should work and reset use count')
	})

	describe('update after use', function() {

		it('should correctly persist prng state', function() {
			let state = create()

			const prng = get_prng(state)
			expect(Random.integer(0, 10)(prng), 'random 1').to.equal(2)
			expect(Random.integer(0, 10)(prng), 'random 2').to.equal(5)

			state = update_use_count(state, prng)
			expect(state.use_count).to.equal(2)
		})
	})
})
