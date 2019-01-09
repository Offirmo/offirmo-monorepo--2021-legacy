import { expect } from 'chai'

import { LIB } from './consts'
import {
	Derived,
	create,
	use_energy,
	get_derived,
} from '.'

describe(`${LIB} - derived`, function() {

	context('🆕  initial state', function() {

		it('should yield a correct snapshot', function() {
			const [ u_state, t_state ] = create()
			const derived = get_derived(u_state, t_state)

			expect(derived).to.deep.equal({
				available_energy_int: 7,
				available_energy_float: 7.,
				human_time_to_next: "",
				next_energy_refilling_ratio: 0.,
			} as Derived)
		})
	})

	context('when fully depleted state', function() {

		context('depleted in one shot', function() {

			it('should yield a correct snapshot with 0', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([u_state, t_state], 7)

				const derived = get_derived(u_state, t_state)

				expect(derived).to.deep.equal({
					available_energy_int: 0,
					available_energy_float: 0.,
					human_time_to_next: '3h25',
					next_energy_refilling_ratio: 0.,
				} as Derived)
			})
		})

		context('depleted in consecutive shots', function() {

			it('should yield a correct snapshot with 0', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)

				const derived = get_derived(u_state, t_state)

				expect(derived).to.deep.equal({
					available_energy_int: 0,
					available_energy_float: 0.,
					human_time_to_next: '3h25',
					next_energy_refilling_ratio: 0.,
				} as Derived)
			})
		})
	})

	context('when intermediate state', function() {

		it('should yield a correct snapshot', function() {
			let [ u_state, t_state ] = create()

			t_state = use_energy([u_state, t_state], 1)
			t_state = use_energy([u_state, t_state], 1)
			t_state = use_energy([u_state, t_state], 1)

			const derived = get_derived(u_state, t_state)

			expect(derived).to.deep.equal({
				available_energy_int: 4,
				available_energy_float: 4.,
				next_energy_refilling_ratio: 0.,
				human_time_to_next: '3h25',
			} as Derived)
		})
	})
})
