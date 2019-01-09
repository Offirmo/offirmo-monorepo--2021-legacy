import { expect } from 'chai'

import { LIB } from './consts'
import {
	create,
	use_energy,

	get_available_energy_float,
	get_human_time_to_next,
} from '.'

describe(`${LIB} - selectors`, function() {

	describe('get_available_energy_float()', function () {

		context('on initial state', function() {

			it('should yield a correct value', function() {
				const [ u_state, t_state ] = create()

				expect(get_available_energy_float(t_state)).to.equal(7)
			})
		})

		context('on a fully depleted state', function() {

			context('depleted in one shot', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create()

					t_state = use_energy([u_state, t_state], 7)

					expect(get_available_energy_float(t_state)).to.equal(0.)
				})
			})

			context('depleted in consecutive shots', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create()

					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)

					expect(get_available_energy_float(t_state)).to.equal(0.)
				})
			})
		})

		context('on an intermediate state', function() {

			it('should yield a correct value', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)

				expect(get_available_energy_float(t_state)).to.equal(4.)
			})
		})
	})

	describe('get_human_time_to_next()', function () {

		context('on initial state', function() {

			it('should yield a correct value', function () {
				const [u_state, t_state] = create()

				expect(get_human_time_to_next(u_state, t_state)).to.equal('')
			})
		})

		context('on a fully depleted state', function() {

			context('depleted in one shot', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create()

					t_state = use_energy([u_state, t_state], 7)

					expect(get_human_time_to_next(u_state, t_state)).to.equal('3h25')
				})
			})

			context('depleted in consecutive shots', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create()

					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)
					t_state = use_energy([u_state, t_state], 1)

					expect(get_human_time_to_next(u_state, t_state)).to.equal('3h25')
				})
			})
		})

		context('on an intermediate state', function() {

			it('should yield a correct value', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)
				t_state = use_energy([u_state, t_state], 1)

				expect(get_human_time_to_next(u_state, t_state)).to.equal('3h25')
			})
		})
	})

})
