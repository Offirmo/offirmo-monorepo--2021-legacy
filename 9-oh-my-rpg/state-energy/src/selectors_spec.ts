import { expect } from 'chai'
import sinon from 'sinon'
import Fraction from 'fraction.js'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { dump_prettified_any } from '@offirmo-private/prettify-any'

import {LIB, TICK_MS} from './consts'
import {
	UState,
	TState,

	create,
	use_energy,
	update_to_now,

	get_current_energy_refilling_rate_per_ms,
	get_milliseconds_to_next,
	get_available_energy_float,
	get_human_time_to_next,
} from '.'


// TODO fix energy limit
describe.skip(`${LIB} - selectors`, function() {
	beforeEach(function () {
		this.clock = sinon.useFakeTimers()
	})
	afterEach(function () {
		this.clock.restore()
	})

	describe('get_current_energy_refilling_rate_per_ms()', function() {
		const EXPECTED_ESTABLISHED_ENERGY_REFILL_PER_DAY = 7

		// simple wrapper for tests
		function get_energy_refill_rate(u_state: Readonly<UState>, t_state: Readonly<TState> ) {
			const per_ms = get_current_energy_refilling_rate_per_ms(u_state, t_state)

			return {
				per_day(): number {
					return per_ms.mul(1000 * 3600 * 24).floor(2).valueOf()
				},
				per_hour(): number {
					return per_ms.mul(1000 * 3600).floor(4).valueOf()
				},
				per_min(): number {
					return per_ms.mul(1000 * 60).floor(4).valueOf()
				},
				per_s(): number {
					return per_ms.mul(1000).floor(4).valueOf()
				},
				per_ms(): number {
					return per_ms.floor(6).valueOf()
				},
				raw: per_ms,
			}
		}

		it('should slowly ramp-up for onboarding - demo', () => {
			let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

			for(let i = 0; i < 50 ; ++i) {
				u_state = {
					...u_state,
					total_energy_consumed_so_far: i,
				}
				/*t_state = {
					...t_state,
					available_energy: {
						n: 7,
						d: 1,
					},
				}*/

				const cerr = get_current_energy_refilling_rate_per_ms(u_state, t_state)
				const ttn = (new Fraction(1))
					.div(get_current_energy_refilling_rate_per_ms(u_state, t_state))
					.round(0)
				/*
				console.log(`#${`${i}`.padStart(3)}: refilling rate = ${cerr}/ms`)
				console.log(`                     = ${get_energy_refill_rate(u_state, t_state).per_s()}/s = ${get_energy_refill_rate(u_state, t_state).per_day()}/day`)
				//console.log(`        TTN = ${get_milliseconds_to_next(u_state, t_state)}ms`)
				console.log(`        TTN = ${ttn.div(1000).round(3)}s = ${ttn}ms`)
				 */
			}
		})

		it(`should tends towards ${EXPECTED_ESTABLISHED_ENERGY_REFILL_PER_DAY}`, () => {
			let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

			u_state = {
				...u_state,
				total_energy_consumed_so_far: 1_000, // should be established by this time
			}
			dump_prettified_any('u', u_state)
			console.log(get_energy_refill_rate(u_state, t_state))
			expect(get_energy_refill_rate(u_state, t_state).per_day()).to.equal(EXPECTED_ESTABLISHED_ENERGY_REFILL_PER_DAY)
		})

		it('should slowly ramp-up for onboarding', () => {
			let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

			const rate_0 = get_energy_refill_rate(u_state, t_state)
			expect(rate_0.per_s(), 'initial').to.be.at.least(1)

			u_state = {
				...u_state,
				total_energy_consumed_so_far: 10,
			}
			const rate_10 = get_energy_refill_rate(u_state, t_state)
			expect(rate_10.per_s(), '10a').to.be.below(rate_0.per_s())
			expect(rate_10.per_min(), '10b').to.be.above(1)

			u_state = {
				...u_state,
				total_energy_consumed_so_far: 30,
			}
			expect(get_energy_refill_rate(u_state, t_state).per_min(), '30a').to.be.below(rate_10.per_s())
			expect(get_energy_refill_rate(u_state, t_state).per_hour(), '30b').to.be.above(1)
		})
	})

	describe('get_milliseconds_to_next()', function() {

		context('on full state', function() {

			it('should throw', function() {
				const [ u_state, t_state ] = create(get_UTC_timestamp_ms())

				expect(() => get_milliseconds_to_next(u_state, t_state)).to.throw()
			})
		})

		context('on a fully depleted state', function() {

			context('depleted in one shot', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

					t_state = {
						...t_state,
						available_energy: {
							n: 0,
							d: 1,
						},
					}

					expect(get_available_energy_float(t_state)).to.equal(0.)
				})
			})

			context('depleted in consecutive shots', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

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

		context('on an intermediate state', function() {

			it('should yield a correct value - rounded', function() {
				let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

				t_state = {
					...t_state,
					available_energy: {
						n: 4,
						d: 1,
					},
				}

				expect(get_available_energy_float(t_state)).to.equal(4.)
			})

			it('should yield a correct value - unrounded', function() {
				let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

				t_state = {
					...t_state,
					available_energy: {
						n: 1234567,
						d: 333333,
					},
				}

				expect(get_available_energy_float(t_state)).to.equal(3.7)
			})
		})
	})

	describe('get_available_energy_float()', function () {

		context('on initial state', function() {

			it('should yield a correct value', function() {
				const [ u_state, t_state ] = create(get_UTC_timestamp_ms())

				expect(get_available_energy_float(t_state)).to.equal(7)
			})
		})

		context('on a fully depleted state', function() {

			context('depleted in one shot', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

					t_state = {
						...t_state,
						available_energy: {
							n: 0,
							d: 1,
						},
					}

					expect(get_available_energy_float(t_state)).to.equal(0.)
				})
			})

			context('depleted in consecutive shots', function() {

				it('should yield a correct value', function() {
					let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

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

		context('on an intermediate state', function() {

			it('should yield a correct value - rounded', function() {
				let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

				t_state = {
					...t_state,
					available_energy: {
						n: 4,
						d: 1,
					},
				}

				expect(get_available_energy_float(t_state)).to.equal(4.)
			})

			it('should yield a correct value - unrounded', function() {
				let [ u_state, t_state ] = create(get_UTC_timestamp_ms())

				t_state = {
					...t_state,
					available_energy: {
						n: 1234567,
						d: 333333,
					},
				}

				expect(get_available_energy_float(t_state)).to.equal(3.7)
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

		context('on a fully depleted state (established)', function() {

			it('should yield a correct value', function() {
				let [ u_state, t_state ] = create()

				u_state = {
					...u_state,
					total_energy_consumed_so_far: 1000,
				}

				;[ u_state, t_state ] = use_energy([u_state, t_state], 7)

				//dump_prettified_any('s', { u_state, t_state })
				expect(get_human_time_to_next(u_state, t_state)).to.equal('3h 25m 42s')
			})
		})

		context('on an intermediate state (established)', function() {

			it('should yield a correct value', function() {
				let [ u_state, t_state ] = create()

				u_state = {
					...u_state,
					total_energy_consumed_so_far: 1000,
				}

				let now = new Date(2017, 1, 1, 1, 0, 0)
				;[ u_state, t_state ] = use_energy([ u_state, t_state ], 1, +now)
				/*dump_prettified_any('+0', {
					now: get_UTC_timestamp_ms(now),
					t_state,
					aef: get_available_energy_float(t_state),
					ttn: get_human_time_to_next(u_state, t_state),
				})*/
				expect(get_human_time_to_next(u_state, t_state), '+0').to.equal('3h 25m 42s')

				now = new Date(2017, 1, 1, 1, 0, 1)
				t_state = update_to_now([ u_state, t_state ], +now)
				/*dump_prettified_any('+1s', {
					now: get_UTC_timestamp_ms(now),
					t_state,
					aef: get_available_energy_float(t_state),
					ttn: get_human_time_to_next(u_state, t_state),
				})*/
				expect(get_human_time_to_next(u_state, t_state), '+1s').to.equal('3h 25m 41s')

				now = new Date(2017, 1, 1, 1, 1, 0)
				t_state = update_to_now([ u_state, t_state ], +now)
				/*dump_prettified_any('+1s', {
					now: get_UTC_timestamp_ms(now),
					t_state,
					aef: get_available_energy_float(t_state),
					ttn: get_human_time_to_next(u_state, t_state),
				})*/
				expect(get_human_time_to_next(u_state, t_state), '+1m').to.equal('3h 24m 42s')

				now = new Date(2017, 1, 1, 2, 0, 0)
				t_state = update_to_now([ u_state, t_state ], +now)
				expect(get_human_time_to_next(u_state, t_state), '+1h').to.equal('2h 25m 42s')
			})
		})
	})
})
