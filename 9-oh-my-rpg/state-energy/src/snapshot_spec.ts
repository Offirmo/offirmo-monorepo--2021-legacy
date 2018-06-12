import { expect } from 'chai'

import { LIB, SCHEMA_VERSION } from './consts'

import { get_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps'

import { round_float } from './utils'

import {
	State,
	Snapshot,
	create,
	use_energy,
	ENERGY_ROUNDING,
	get_snapshot,
} from '.'

describe('snapshot', function() {

	context('🆕  initial state', function() {

		it('should yield a correct snapshot', function() {
			const state = create()
			const snapshot = get_snapshot(state)

			expect(snapshot).to.deep.equal({
				available_energy: 7,
				available_energy_float: 7.,
				total_energy_refilling_ratio: 1, // fully refilled

				next_energy_refilling_ratio: 1,
				human_time_to_next: '',
			} as Snapshot)
		})
	})

	context('when fully depleted state', function() {

		context('depleted in one shot', function() {

			it('should yield a correct snapshot with 0', function() {
				let state = create()

				state = use_energy(state, 7)

				const snapshot = get_snapshot(state)

				expect(snapshot).to.deep.equal({
					available_energy: 0,
					available_energy_float: 0.,
					total_energy_refilling_ratio: 0,
					next_energy_refilling_ratio: 0.,
					human_time_to_next: '3h25',
				})
			})
		})

		context('depleted in consecutive shots', function() {

			it('should yield a correct snapshot with 0', function() {
				let state = create()

				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)
				state = use_energy(state, 1)

				const snapshot = get_snapshot(state)

				expect(snapshot).to.deep.equal({
					available_energy: 0,
					available_energy_float: 0.,
					total_energy_refilling_ratio: 0,
					next_energy_refilling_ratio: 0.,
					human_time_to_next: '3h25',
				})
			})
		})
	})

	context('when intermediate state', function() {

		it('should yield a correct snapshot', function() {
			let state = create()

			state = use_energy(state, 1)
			state = use_energy(state, 1)
			state = use_energy(state, 1)

			const snapshot = get_snapshot(state)

			expect(snapshot).to.deep.equal({
				available_energy: 4,
				available_energy_float: 4.,
				total_energy_refilling_ratio: round_float(4 / 7.),
				next_energy_refilling_ratio: 0.,
				human_time_to_next: '3h25',
			})
		})
	})
})
