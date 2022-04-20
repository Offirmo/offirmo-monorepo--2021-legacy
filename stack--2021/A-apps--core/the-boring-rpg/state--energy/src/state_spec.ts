import { expect } from 'chai'
import sinon from 'sinon'
import { TEST_TIMESTAMP_MS } from '@offirmo-private/timestamps'
import { dump_prettified_any } from '@offirmo-private/prettify-any'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	create,
	update_to_now,
	use_energy,
	lose_all_energy,
	restore_energy,

	get_available_energy_float,
} from '.'

const SECOND_ms = 1000
const HOUR_ms = 3600 * SECOND_ms

describe(`${LIB} - reducer`, function() {
	beforeEach(function () {
		this.clock = sinon.useFakeTimers()
	})
	afterEach(function () {
		this.clock.restore()
	})

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			const [ u_state, t_state ] = create()

			expect(u_state, 'u').to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				max_energy: 7,
				total_energy_consumed_so_far: 0,
			})
			expect(t_state, 't').to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				timestamp_ms: 0, // 1970
				available_energy: {
					n: u_state.max_energy,
					d: 1,
				},
			})
		})

		describe('testability', function () {

			it('should allow passing a forced time', function() {
				const [ u_state, t_state ] = create(TEST_TIMESTAMP_MS)
				expect(t_state.timestamp_ms).to.equal(TEST_TIMESTAMP_MS)
			})

			context('when using sinon', function() {
				beforeEach(function () {
					this.clock = sinon.useFakeTimers(TEST_TIMESTAMP_MS)
				})
				afterEach(function () {
					this.clock.restore()
				})

				it('should be affected by useFakeTimers()', function() {
					const t_state = update_to_now(create())
					expect(t_state.timestamp_ms).to.equal(TEST_TIMESTAMP_MS)
				})
			})
		})
	})

	// 2nd most crucial method after create
	describe('update_to_now() = natural replenishment', function() {
		it('should work on a T=0 freshly created state', function() {
			let [ u_state, t_state ] = create()

			//dump_prettified_any('s', { u_state, t_state })
			//expect(get_available_energy_float(t_state)).to.equal(7.)

			t_state = update_to_now([ u_state, t_state ])

			//dump_prettified_any('s', { u_state, t_state })
			expect(get_available_energy_float(t_state)).to.equal(7.)
		})

		it('should not allow playing more than X times in 24 hours - case 1', function() {
			let [ u_state, t_state ] = create()

			// move to established mode
			u_state = {
				...u_state,
				total_energy_consumed_so_far: 1000,
			}

			// all in short sequence
			this.clock.tick(+new Date(2017, 1, 1, 1, 1, 1))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)

			// not yet
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 1, 23))
			expect(get_available_energy_float(t_state)).to.be.below(7.)

			// ok, 24h elapsed since 1st play
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 2))
			expect(get_available_energy_float(t_state)).to.equal(7.)
		})

		it('should not allow playing more than X times in 24 hours - case 2', function() {
			let [ u_state, t_state ] = create()

			// move to established mode
			u_state = {
				...u_state,
				total_energy_consumed_so_far: 1000,
			}

			// time to time but less than full reload
			this.clock.tick(+new Date(2017, 1, 1, 1, 1, 1))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			expect(get_available_energy_float(t_state), 'p3').to.be.within(4., 5.)

			this.clock.tick(3 * HOUR_ms) // not enough to refill 1 energy
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			expect(get_available_energy_float(t_state), 'p4').to.be.within(3., 4.)
			this.clock.tick(1 * SECOND_ms)
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			expect(get_available_energy_float(t_state), 'p5').to.be.within(2., 3.)

			this.clock.tick(4 * HOUR_ms) // 2 energy refilled due to all waits combined
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			expect(get_available_energy_float(t_state), 'p6').to.be.within(3., 4.)
			this.clock.tick(1 * HOUR_ms) // no energy refilled
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
			expect(get_available_energy_float(t_state), 'p7').to.be.within(2., 3.)

			// not yet
			this.clock.tick(+new Date(2017, 1, 1, 23) - this.clock.now)
			t_state = update_to_now([ u_state, t_state ] )
			expect(get_available_energy_float(t_state)).to.be.below(7.)

			// 24h elapsed since 1st play
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 2))
			expect(get_available_energy_float(t_state)).to.equal(7.)
		})

		it('should not allow playing more than X times in 24 hours - case 3', function() {
			let [ u_state, t_state ] = create()

			// move to established mode
			u_state = {
				...u_state,
				total_energy_consumed_so_far: 1000,
			}

			// inefficient play, always too late
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 3, 30))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 7))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 10, 30))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 14))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 17, 30))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 21))

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

			// move to established mode
			u_state = {
				...u_state,
				total_energy_consumed_so_far: 1000,
			}

			// burst to 0
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 0))

			// then play as soon as energy is restored, waiting 7 times x 3h25+
			// check
			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 1, 3, 30))
			expect(get_available_energy_float(t_state), 'A').to.be.above(1.)

			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 3, 30))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 7))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 10, 30))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 14))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 17, 30))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 1, 21))
			;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +new Date(2017, 1, 2, 0, 30))

			expect(get_available_energy_float(t_state), 'B').to.be.below(1.) // but not 0 since extra time passed

			t_state = update_to_now([ u_state, t_state ], +new Date(2017, 1, 2, 4))
			expect(get_available_energy_float(t_state), 'C').to.be.below(7.)
		})
	})

	describe('use_energy()', function() {

		context('when having enough energy', function() {

			it('should decrement energy correctly', function() {
				let [ u_state, t_state ] = create()

				//dump_prettified_any('s', { u_state, t_state })
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				//dump_prettified_any('s', { u_state, t_state })
				expect(get_available_energy_float(t_state)).to.equal(6.)

				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				expect(get_available_energy_float(t_state)).to.equal(5.)

				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				expect(get_available_energy_float(t_state)).to.equal(4.)
			})

			it('should decrement energy correctly (explicit dates)', function() {
				let [ u_state, t_state ] = create(+new Date(2017, 0))

				// switch to established mode
				u_state = {
					...u_state,
					total_energy_consumed_so_far: 1000,
				}

				// all good, we are consuming less than 7/day
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 1))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 2))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 3))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 4))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 5))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 6))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 7))

				expect(u_state.total_energy_consumed_so_far).to.equal(1000 + 28)

				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +Date.UTC(3000, 1, 1, 1))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +Date.UTC(3000, 1, 1, 2))
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +Date.UTC(3000, 1, 1, 3))

				t_state = update_to_now([ u_state, t_state ], +Date.UTC(3000, 1, 1, 4))
				expect(t_state.timestamp_ms).to.equal(+Date.UTC(3000, 1, 1, 4))

				expect(Math.trunc(get_available_energy_float(t_state))).to.equal(4)
				expect(get_available_energy_float(t_state)).to.be.above(4.)
				expect(get_available_energy_float(t_state)).to.be.below(5.)
			})

			it('should not change on abnormal date', function() {
				const [ u_state, t_state ] = create(+new Date(2018, 0))

				expect(() => use_energy([ u_state, t_state ], 4, +new Date(2017, 1, 1))).to.throw('time went backward')
			})

			describe('depleting in one shot', function() {

				it('should yield a correct final energy value', function() {
					let [ u_state, t_state ] = create()

					;[ u_state, t_state ] = use_energy([u_state, t_state], 7)

					expect(get_available_energy_float(t_state)).to.equal(0.)
				})
			})

			describe('depleting in consecutive shots', function() {

				it('should yield a correct final energy value', function() {
					let [ u_state, t_state ] = create()

					expect(get_available_energy_float(t_state)).to.equal(7.)

					;[ u_state, t_state ] = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(6.)
					;[ u_state, t_state ] = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(5.)
					;[ u_state, t_state ] = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(4.)
					;[ u_state, t_state ] = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(3.)
					;[ u_state, t_state ] = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(2.)
					;[ u_state, t_state ] = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(1.)
					;[ u_state, t_state ] = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(0.)
				})
			})
		})

		context('when not having enough energy', function() {

			it('should throw', function() {
				let [ u_state, t_state ] = create()

				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)

				expect(() => use_energy([ u_state, t_state ], 1)).to.throw('not enough energy')
			})
		})
	})

	describe('lose_all_energy()', function() {
		it('should work on a full state', function() {
			let [ u_state, t_state ] = create()

			expect(get_available_energy_float(t_state)).to.equal(7.)

			t_state = lose_all_energy([u_state, t_state])

			expect(get_available_energy_float(t_state)).to.equal(0.)
		})
	})

	describe('restore_energy() = artificial energy replenishment', function() {

		context('when not going over the limit', function() {

			it('should increment energy correctly', function() {
				let [ u_state, t_state ] = create()

				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)

				expect(get_available_energy_float(t_state)).to.equal(4.)

				t_state = restore_energy([ u_state, t_state ], 2)

				expect(get_available_energy_float(t_state)).to.equal(6.)
			})
		})

		context('when going over the limit', function() {

			it('should increment but cap', function() {
				let [ u_state, t_state ] = create()

				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1)

				expect(get_available_energy_float(t_state)).to.equal(4.)

				t_state = restore_energy([ u_state, t_state ], 10)

				expect(get_available_energy_float(t_state)).to.equal(7.) // max
			})
		})
	})

})
