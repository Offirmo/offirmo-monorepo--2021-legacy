import { expect } from 'chai'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	UState,
	TState,

	create,
	update_to_now,
	use_energy,
	restore_energy,

	get_available_energy_float,
} from '.'

describe(`${LIB} - reducer`, function() {

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			let [ u_state, t_state ] = create()

			expect(u_state, 'u').to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				max_energy: 7,

				energy_refilling_rate_per_ms: {
					n: 7,
					d: 24 * 3600 * 1000,
				}
			})
			expect(t_state, 't').to.deep.equal({
				schema_version: SCHEMA_VERSION,

				timestamp_ms: 0, // 1970
				available_energy: {
					n: u_state.max_energy,
					d: 1,
				}
			})
		})
	})

	describe('energy usage', function() {

		context('when having enough energy', function() {

			it('should decrement energy correctly', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)

				expect(get_available_energy_float(t_state)).to.equal(4.)
			})

			it('should not change on abnormal date', function() {
				let [ u_state, t_state ] = create()

				// outdated usages
				t_state = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 1))
				t_state = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 2))
				t_state = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 3))
				t_state = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 4))
				t_state = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 5))
				t_state = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 6))
				t_state = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 7))

				// now let's do it
				t_state = use_energy([ u_state, t_state ], 1, +Date.UTC(3000, 1, 1, 1))
				t_state = use_energy([ u_state, t_state ], 1, +Date.UTC(3000, 1, 1, 2))
				t_state = use_energy([ u_state, t_state ], 1, +Date.UTC(3000, 1, 1, 3))

				t_state = update_to_now([ u_state, t_state ], +Date.UTC(3000, 1, 1, 4))

				expect(Math.trunc(get_available_energy_float(t_state))).to.equal(4)
				expect(get_available_energy_float(t_state)).to.be.above(4.)
				expect(get_available_energy_float(t_state)).to.be.below(5.)

				expect(t_state.timestamp_ms).to.equal(+Date.UTC(3000, 1, 1, 4))
			})
		})

		context('when not having enough energy', function() {

			it('should throw', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)

				expect(() => use_energy([ u_state, t_state ], 1)).to.throw('not enough energy')
			})
		})
	})

	describe('energy replenishment', function() {

		context('when not going over the limit', function() {

			it('should increment energy correctly', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)

				expect(get_available_energy_float(t_state)).to.equal(4.)

				t_state = restore_energy([ u_state, t_state ], 2)

				expect(get_available_energy_float(t_state)).to.equal(6.)
			})
		})

		context('when going over the limit', function() {

			it('should increment but cap', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)
				t_state = use_energy([ u_state, t_state ], 1)

				expect(get_available_energy_float(t_state)).to.equal(4.)

				t_state = restore_energy([ u_state, t_state ], 10)

				expect(get_available_energy_float(t_state)).to.equal(7.) // max
			})
		})
	})

	describe('natural replenishment', function() {

		it('should not allow playing more than X times in 24 hours - case 1', function() {
			let [ u_state, t_state ] = create()

			// all in short sequence
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 1))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 2))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 3))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 4))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 5))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 6))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 7))

			// not yet
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 1, 23))
			expect(get_available_energy_float(t_state)).to.be.below(7.)

			// 24h elapsed since 1st play
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 2))
			expect(get_available_energy_float(t_state)).to.equal(7.)
		})

		it('should not allow playing more than X times in 24 hours - case 2', function() {
			let [ u_state, t_state ] = create()

			// time to time but less than full reload
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 1))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 2))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 1, 1, 3))

			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 3, 1, 4))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 3, 1, 5))

			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 7, 1, 6))

			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 8, 1, 7))

			// not yet
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 1, 23))
			expect(get_available_energy_float(t_state)).to.be.below(7.)

			// 24h elapsed since 1st play
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 2))
			expect(get_available_energy_float(t_state)).to.equal(7.)
		})

		it('should not allow playing more than X times in 24 hours - case 3', function() {
			let [ u_state, t_state ] = create()

			// inefficient play, always too late
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 3, 30))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 7))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 10, 30))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 14))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 17, 30))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 21))

			// not yet
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 1, 23))
			expect(get_available_energy_float(t_state), 'A').to.be.below(7.)

			// 24h elapsed since 1st play, still not regenerated
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 0))
			expect(get_available_energy_float(t_state), 'B').to.be.below(7.)

			// 3h25+ elapsed since last play
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 0, 30))
			expect(get_available_energy_float(t_state), 'C').to.equal(7.)
		})

		// case 1 = a wrong implementation I did first
		it('should not be exploitable - case 1', function() {
			let [ u_state, t_state ] = create()

			// burst to 0
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))

			// then play as soon as energy is restored, waiting 7 times x 3h25+
			// check
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 1, 3, 30))
			expect(get_available_energy_float(t_state), 'A').to.be.above(1.)

			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 3, 30))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 7))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 10, 30))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 14))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 17, 30))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 21))
			t_state = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 2, 0, 30))

			expect(get_available_energy_float(t_state), 'B').to.be.below(1.) // but not 0 since extra time passed

			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 4))
			expect(get_available_energy_float(t_state), 'C').to.be.below(7.)
		})
	})
})
