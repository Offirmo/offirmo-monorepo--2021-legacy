import { expect } from 'chai'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	UState,
	TState,
	create,
	use_energy,
	restore_energy,

	get_derived,
} from '.'
import { get_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps'

describe('@oh-my-rpg/state-energy - reducer', function() {

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			let [ u_state, t_state ] = create()

			expect(u_state, 'u').to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				max_energy: 7,
				base_energy_refilling_rate_per_day: 7,

				last_date: 'ts1_19700101_00h00:00.000',
				last_available_energy_float: 7.,
			})
			expect(t_state, 't').to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				max_energy: 7,
				base_energy_refilling_rate_per_day: 7,

				last_date: 'ts1_19700101_00h00:00.000',
				last_available_energy_float: 7.,
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

				const derived = get_derived([ u_state, t_state ])

				expect(derived.available_energy).to.equal(4)
			})

			it('should memorize the usage', function() {
				let [ u_state, t_state ] = create()

				const date = new Date()
				t_state = use_energy([ u_state, t_state ], 1, date)
				t_state = use_energy([ u_state, t_state ], 1, date)
				t_state = use_energy([ u_state, t_state ], 1, date)

				expect(state.last_available_energy_float).to.equal(1)
				expect(state.last_date).to.equal(get_human_readable_UTC_timestamp_ms(date))
			})

			it('should discard irrelevant usages if any', function() {
				let state = create()

				// outdated usages
				state = use_energy(state, 4, new Date(2017, 1, 1))
				state = use_energy(state, 4, new Date(2017, 1, 2))
				state = use_energy(state, 4, new Date(2017, 1, 3))
				state = use_energy(state, 4, new Date(2017, 1, 4))
				state = use_energy(state, 4, new Date(2017, 1, 5))
				state = use_energy(state, 4, new Date(2017, 1, 6))
				state = use_energy(state, 4, new Date(2017, 1, 7))

				// now let's do it
				state = use_energy(state, 1, new Date(Date.UTC(2018, 1, 1, 1)))
				state = use_energy(state, 1, new Date(Date.UTC(2018, 1, 1, 2)))
				state = use_energy(state, 1, new Date(Date.UTC(2018, 1, 1, 3)))

				expect(get_snapshot(state, new Date(Date.UTC(2018, 1, 1, 3))).available_energy).to.equal(4)
				expect(state.last_available_energy_float).to.be.above(4.)
				expect(state.last_available_energy_float).to.be.below(5.)
				expect(state.last_date).to.equal('ts1_20180201_03h00:00.000')
			})
		})

		context('when not having enough energy', function() {

			it('should throw', function() {
				let state = create()

				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)

				expect(() => use_energy(state, 1)).to.throw('not enough energy')
			})
		})
	})

	describe('energy replenishment', function() {

		context('when not going over the limit', function() {

			it('should increment energy correctly', function() {
				let state = create()

				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)

				expect(get_snapshot(state).available_energy).to.equal(4)

				state = restore_energy(state, 2)

				expect(get_snapshot(state).available_energy).to.equal(6)
			})
		})

		context('when going over the limit', function() {

			it('should increment but cap', function() {
				let state = create()

				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)

				expect(get_snapshot(state).available_energy).to.equal(4)

				state = restore_energy(state)

				expect(get_snapshot(state).available_energy).to.equal(7) // max
			})
		})
	})

	describe('natural replenishment', function() {

		it('should not allow playing more than X times in 24 hours - case 1', function() {

				let state = create()

				// all at once
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))

				// not yet
				expect(get_snapshot(state, new Date(2017, 1, 1, 23)).available_energy).to.be.below(7)
				// 24h elapsed
				expect(get_snapshot(state, new Date(2017, 1, 2, 0)).available_energy).to.equal(7)
			})

		it('should not allow playing more than X times in 24 hours - case 2', function() {

			let state = create()

			// time to time but less than full reload
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))
			state = use_energy(state, 1, new Date(2017, 1, 1, 1))
			state = use_energy(state, 1, new Date(2017, 1, 1, 2))

			state = use_energy(state, 1, new Date(2017, 1, 1, 5))
			state = use_energy(state, 1, new Date(2017, 1, 1, 6))

			state = use_energy(state, 1, new Date(2017, 1, 1, 9))
			state = use_energy(state, 1, new Date(2017, 1, 1, 10))

			// not yet
			expect(get_snapshot(state, new Date(2017, 1, 1, 23)).available_energy).to.be.below(7)
			// 24h elapsed +1min for rounding reasons
			expect(get_snapshot(state, new Date(2017, 1, 2, 0, 1)).available_energy).to.equal(7)
		})

		it('should not allow playing more than X times in 24 hours - case 3', function() {

				let state = create()

				// inefficient play, last one too late
				state = use_energy(state, 1, new Date(2017, 1, 1, 0))
				state = use_energy(state, 1, new Date(2017, 1, 1, 3, 30))
				state = use_energy(state, 1, new Date(2017, 1, 1, 7))
				state = use_energy(state, 1, new Date(2017, 1, 1, 10, 30))
				state = use_energy(state, 1, new Date(2017, 1, 1, 14))
				state = use_energy(state, 1, new Date(2017, 1, 1, 17, 30))
				state = use_energy(state, 1, new Date(2017, 1, 1, 21))

				// not yet
				expect(get_snapshot(state, new Date(2017, 1, 1, 23)).available_energy).to.be.below(7)
				// 24h elapsed
				expect(get_snapshot(state, new Date(2017, 1, 2, 0)).available_energy).to.be.below(7)
			})

		// case 1 = a wrong implementation I did first
		it('should not be exploitable - case 1', function() {
			let state = create()

			// burst to 0
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))
			state = use_energy(state, 1, new Date(2017, 1, 1, 0))

			// the play as soon as energy is restored, 7 times
			state = use_energy(state, 1, new Date(2017, 1, 1, 3, 30))
			state = use_energy(state, 1, new Date(2017, 1, 1, 7))
			state = use_energy(state, 1, new Date(2017, 1, 1, 10, 30))
			state = use_energy(state, 1, new Date(2017, 1, 1, 14))
			state = use_energy(state, 1, new Date(2017, 1, 1, 17, 30))
			state = use_energy(state, 1, new Date(2017, 1, 1, 21))
			state = use_energy(state, 1, new Date(2017, 1, 2, 0, 30))

			// bingo, energy is at 7 again
			expect(get_snapshot(state, new Date(2017, 1, 2, 4)).available_energy).to.be.below(7)
		})
	})
})
