import { expect } from 'chai'

import { LIB } from '../consts'
import { Params, get_params } from '../params'
import { create_better_date, create_better_date_compat, get_timestamp_utc_ms } from './better-date'

import {
	get_current_timezone,
	get_default_timezone,
} from './params'

describe(`${LIB} - params derivation`, function() {

	describe('get_current_timezone()', function() {

		it('should work', () => {
			const current_tz = get_current_timezone()
			console.log({ current_tz })
			expect(current_tz).to.be.a('string')
			expect(current_tz.length).to.be.at.least(5)
		})
	})

	describe('get_default_timezone()', function() {
		let test_params: Params = get_params()
		const now = create_better_date()

		beforeEach(() => {
			test_params = JSON.parse(JSON.stringify(get_params()))
			test_params.default_timezones = []
		})

		it('should work - empty array', () => {
			const system_tz = get_current_timezone()
			const default_tz = get_default_timezone(now, test_params)
			//console.log({ test_params, system_tz, default_tz })
			expect(default_tz).to.equal(system_tz)
		})

		it('should work - real case', () => {
			test_params.default_timezones = [
				// order expected
				//
				{
					date_utc_ms: get_timestamp_utc_ms(create_better_date_compat(1826, 0)),
					new_default: 'Europe/Paris',
				},
				{
					date_utc_ms: get_timestamp_utc_ms(create_better_date_compat(2009, 7, 10)),
					new_default: 'Asia/Bangkok',
				},
				{
					date_utc_ms: get_timestamp_utc_ms(create_better_date_compat(2010, 6, 8)),
					new_default: 'Europe/Paris',
				},
				{
					date_utc_ms: get_timestamp_utc_ms(create_better_date_compat(2017, 6, 14)),
					new_default: 'Australia/Sydney',
				},
			].sort((a, b) => a.date_utc_ms - b.date_utc_ms)
			const system_tz = get_current_timezone()
			//console.log({ test_params, dt: test_params.default_timezones, system_tz })

			const default_tz_2001 = get_default_timezone(create_better_date_compat(2001, 0), test_params)
			expect(default_tz_2001, '2001').to.equal('Europe/Paris')

			const default_tz_2009_08_09 = get_default_timezone(create_better_date_compat(2009, 7, 9), test_params)
			expect(default_tz_2009_08_09).to.equal('Europe/Paris')
			const default_tz_2009_08_10 = get_default_timezone(create_better_date_compat(2009, 7, 10), test_params)
			expect(default_tz_2009_08_10).to.equal('Asia/Bangkok')

			const default_tz_2010_07_08 = get_default_timezone(create_better_date_compat(2010, 6, 8), test_params)
			expect(default_tz_2010_07_08).to.equal('Europe/Paris')

			const default_tz_2018 = get_default_timezone(create_better_date_compat(2018, 0), test_params)
			expect(default_tz_2018, '2018').to.equal('Australia/Sydney')

			const default_tz_now = get_default_timezone(now, test_params)
			expect(default_tz_now, 'now').to.equal('Australia/Sydney')
		})

		it('should warn - real case', () => {
			const system_tz = get_current_timezone()
			test_params.default_timezones = [
				{
					date_utc_ms: get_timestamp_utc_ms(create_better_date_compat(1826, 0)),
					new_default: system_tz === 'Europe/Paris' ? 'Asia/Bangkok' : 'Europe/Paris',
				},
			].sort((a, b) => a.date_utc_ms - b.date_utc_ms)
			//console.log({ test_params, dt: test_params.default_timezones, system_tz })

			const default_tz_now = get_default_timezone(now, test_params)
			// TODO spy logger.warn
		})
	})
})
