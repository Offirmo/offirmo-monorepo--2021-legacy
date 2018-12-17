import { expect } from 'chai'

import { LIB, SCHEMA_VERSION } from './consts'

import { get_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps'

import { round_float } from './utils'

import {
	Derived,
	create,
	use_energy,
	ENERGY_ROUNDING,
	get_derived,
} from '.'

describe('@oh-my-rpg/state-energy - derived', function() {

	context('🆕  initial state', function() {

		it('should yield a correct snapshot', function() {
			const [ u_state, t_state ] = create()
			const derived = get_derived(u_state, t_state)

			expect(derived).to.deep.equal({
				// TODO
				/*available_energy: 7,
				available_energy_float: 7.,
				total_energy_refilling_ratio: 1, // fully refilled

				next_energy_refilling_ratio: 1,
				human_time_to_next: '',*/
			} as Derived)
		})
	})

	context('when fully depleted state', function() {

		context('depleted in one shot', function() {

			it('should yield a correct snapshot with 0', function() {
				let [ u_state, t_state ] = create()

				;[ u_state, t_state ] = use_energy(u_state, t_state, 7)

				const derived = get_derived(u_state, t_state)

				expect(derived).to.deep.equal({
					available_energy: 0,
					available_energy_float: 0.,
					total_energy_refilling_ratio: 0,
					next_energy_refilling_ratio: 0.,
					human_time_to_next: '3h25',
				} as Derived)
			})
		})

		context('depleted in consecutive shots', function() {

			it('should yield a correct snapshot with 0', function() {
				let [ u_state, t_state ] = create()

				;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
				;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
				;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
				;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
				;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
				;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
				;[ u_state, t_state ] = use_energy(u_state, t_state, 1)

				const derived = get_derived(u_state, t_state)

				expect(derived).to.deep.equal({
					available_energy: 0,
					available_energy_float: 0.,
					total_energy_refilling_ratio: 0,
					next_energy_refilling_ratio: 0.,
					human_time_to_next: '3h25',
				} as Derived)
			})
		})
	})

	context('when intermediate state', function() {

		it('should yield a correct snapshot', function() {
			let [ u_state, t_state ] = create()

			;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
			;[ u_state, t_state ] = use_energy(u_state, t_state, 1)
			;[ u_state, t_state ] = use_energy(u_state, t_state, 1)

			const derived = get_derived(u_state, t_state)

			expect(derived).to.deep.equal({
				available_energy: 4,
				available_energy_float: 4.,
				total_energy_refilling_ratio: round_float(4 / 7.),
				next_energy_refilling_ratio: 0.,
				human_time_to_next: '3h25',
			} as Derived)
		})
	})
})
