import { expect } from 'chai'
import { get_UTC_timestamp_ms } from '@offirmo/timestamps'
import { dump_pretty_json } from '@offirmo/prettify-json'

import { LIB } from './consts'
import {
	create,
	use_energy,
	update_to_now,

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

					expect(get_available_energy_float(t_state)).to.equal(7.)

					t_state = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(6.)
					t_state = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(5.)
					t_state = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(4.)
					t_state = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(3.)
					t_state = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(2.)
					t_state = use_energy([u_state, t_state], 1)
					expect(get_available_energy_float(t_state)).to.equal(1.)
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

			it('should yield a correct value', function() {
				let [ u_state, t_state ] = create()

				t_state = use_energy([u_state, t_state], 7)

				expect(get_human_time_to_next(u_state, t_state)).to.equal('3h 25m 43s')
			})
		})

		context('on an intermediate state', function() {

			it('should yield a correct value', function() {
				let [ u_state, t_state ] = create()

				let now = new Date(2017, 1, 1, 1, 0, 0)
				t_state = use_energy([ u_state, t_state ], 1, +now)
				/*dump_pretty_json('+0', {
					now: get_UTC_timestamp_ms(now),
					t_state,
					aef: get_available_energy_float(t_state),
					ttn: get_human_time_to_next(u_state, t_state),
				})*/
				expect(get_human_time_to_next(u_state, t_state), '+0').to.equal('3h 25m 43s')

				now = new Date(2017, 1, 1, 1, 0, 1)
				t_state = update_to_now([ u_state, t_state ], +now)
				/*dump_pretty_json('+1s', {
					now: get_UTC_timestamp_ms(now),
					t_state,
					aef: get_available_energy_float(t_state),
					ttn: get_human_time_to_next(u_state, t_state),
				})*/
				expect(get_human_time_to_next(u_state, t_state), '+1s').to.equal('3h 25m 42s')

				now = new Date(2017, 1, 1, 1, 1, 0)
				t_state = update_to_now([ u_state, t_state ], +now)
				/*dump_pretty_json('+1s', {
					now: get_UTC_timestamp_ms(now),
					t_state,
					aef: get_available_energy_float(t_state),
					ttn: get_human_time_to_next(u_state, t_state),
				})*/
				expect(get_human_time_to_next(u_state, t_state), '+1m').to.equal('3h 24m 43s')

				now = new Date(2017, 1, 1, 2, 0, 0)
				t_state = update_to_now([ u_state, t_state ], +now)
				expect(get_human_time_to_next(u_state, t_state), '+1h').to.equal('2h 25m 43s')
			})
		})
	})
})
