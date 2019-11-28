import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'

import {
	DEFAULT_SEED,
	create,

	set_seed,
	update_use_count,
	register_recently_used,

	get_prng,
	generate_random_seed,
	regenerate_until_not_recently_encountered,

	xxx_internal_reset_prng_cache,
} from '.'

describe('@oh-my-rpg/state-prng - utils', function() {
	beforeEach(xxx_internal_reset_prng_cache)

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

	describe('optional duplicate prevention', function() {
		const id = 'tails_or_head'

		// yes, that can happen
		it('should prevent repetition up to 0', () => {
			let state = create()

			const prng = get_prng(state)

			function gen() {
				const val = regenerate_until_not_recently_encountered({
					id,
					generate: () => 42,
					state,
				})

				state = register_recently_used(
					state,
					id,
					val,
					0,
				)
				return val
			}

			expect(gen(), 'gen 1').to.equal(42)
			expect(gen(), 'gen 2').to.equal(42)
			expect(gen(), 'gen 3').to.equal(42)
			expect(gen(), 'gen 4').to.equal(42)
		})

		it('should prevent repetition up to 1', () => {
			let state = create()

			const prng = get_prng(state)

			function gen() {
				const val = regenerate_until_not_recently_encountered({
					id,
					generate: () => Random.integer(0, 1)(prng),
					state,
				})

				state = register_recently_used(
					state,
					id,
					val,
					1,
				)
				return val
			}

			expect(gen(), 'gen 1').to.equal(1)
			expect(gen(), 'gen 2').to.equal(0)
			expect(gen(), 'gen 3').to.equal(1)
			expect(gen(), 'gen 4').to.equal(0)
		})

		it('should prevent repetition up to N', () => {
			let state = create()

			const prng = get_prng(state)
			state = register_recently_used(state, id, 0, 9)
			state = register_recently_used(state, id, 1, 9)
			state = register_recently_used(state, id, 2, 9)
			state = register_recently_used(state, id, 3, 9)
			state = register_recently_used(state, id, 4, 9)
			state = register_recently_used(state, id, 5, 9)
			state = register_recently_used(state, id, 6, 9)
			state = register_recently_used(state, id, 7, 9)
			state = register_recently_used(state, id, 8, 9)

			function gen() {
				const val = regenerate_until_not_recently_encountered({
					id,
					generate: () => Random.integer(0, 9)(prng),
					state,
					max_tries: 50, // need help
				})

				state = register_recently_used(
					state,
					id,
					val,
					9,
				)
				return val
			}

			expect(gen(), 'gen 1').to.equal(9)
			expect(gen(), 'gen 2').to.equal(0)
			expect(gen(), 'gen 3').to.equal(1)
		})

		it('should throw after too many attempts of avoiding repetition')

		it('should allow isolated named pools of non-repetition')
	})
})
