import assert from 'tiny-invariant'
import { expect } from 'chai'

import {
	CURRENT_YEAR,
	get_params,
	Params,
	_UNSAFE_CURRENT_SYSTEM_TIMEZONE,
	get_default_timezone,
} from './params'

describe('Params', function() {

	describe('get_params()', function() {
		assert(!get_params().expect_perfect_state, 'code should not be in debug mode')

		it('should work')
	})

	describe('utilities', function () {

		describe('get_current_year()', function () {

			it('should work', () => {
				//console.log({ CURRENT_YEAR })
				expect(CURRENT_YEAR).to.be.a('number')
				expect(CURRENT_YEAR).to.be.within(1900, 2100) // wide
				expect(CURRENT_YEAR).to.be.within(2020, 2025) // practical while I'm the only dev
			})
		})

		describe('_UNSAFE_CURRENT_SYSTEM_TIMEZONE', function() {

			it('should work', () => {
				const current_tz = _UNSAFE_CURRENT_SYSTEM_TIMEZONE
				//console.log({ current_tz })
				expect(current_tz).to.be.a('string')
				expect(current_tz.length).to.be.at.least(5)
				expect(current_tz).to.equal('Australia/Sydney') // practical while I'm the only dev TODO improve
			})
		})

		describe('get_default_timezone()', function() {
			let test_params: Params = get_params()
			const now_utc_ms = Number(new Date())

			beforeEach(() => {
				test_params = JSON.parse(JSON.stringify(get_params()))
				test_params.default_timezones = []
			})

			it('should work - empty array', () => {
				const system_tz = _UNSAFE_CURRENT_SYSTEM_TIMEZONE
				const default_tz = get_default_timezone(now_utc_ms, test_params)
				//console.log({ test_params, system_tz, default_tz })
				expect(default_tz).to.equal(system_tz)
			})

			it('should work - real case', () => {
				test_params.default_timezones = [
					// order expected
					//
					{
						date_utc_ms: Number(Date.UTC(1826, 0)),
						new_default: 'Europe/Paris',
					},
					{
						date_utc_ms: Number(Date.UTC(2009, 7, 10)),
						new_default: 'Asia/Bangkok',
					},
					{
						date_utc_ms: Number(Date.UTC(2010, 6, 8)),
						new_default: 'Europe/Paris',
					},
					{
						date_utc_ms: Number(Date.UTC(2017, 6, 14)),
						new_default: 'Australia/Sydney',
					},
				].sort((a, b) => a.date_utc_ms - b.date_utc_ms)
				//console.log({ test_params, dt: test_params.default_timezones, _UNSAFE_CURRENT_SYSTEM_TIMEZONE })

				// before 1970 = negative timestamp
				const default_tz_1900 = get_default_timezone(Number(Date.UTC(1900, 0)), test_params)
				expect(default_tz_1900, '1900').to.equal('Europe/Paris')

				const default_tz_2001 = get_default_timezone(Number(Date.UTC(2001, 0)), test_params)
				expect(default_tz_2001, '2001').to.equal('Europe/Paris')

				const default_tz_2009_08_09 = get_default_timezone(Number(Date.UTC(2009, 7, 9)), test_params)
				expect(default_tz_2009_08_09).to.equal('Europe/Paris')
				const default_tz_2009_08_10 = get_default_timezone(Number(Date.UTC(2009, 7, 10)), test_params)
				expect(default_tz_2009_08_10).to.equal('Asia/Bangkok')

				const default_tz_2010_07_08 = get_default_timezone(Number(Date.UTC(2010, 6, 8)), test_params)
				expect(default_tz_2010_07_08).to.equal('Europe/Paris')

				const default_tz_2018 = get_default_timezone(Number(Date.UTC(2018, 0)), test_params)
				expect(default_tz_2018, '2018').to.equal('Australia/Sydney')

				const default_tz_now = get_default_timezone(now_utc_ms, test_params)
				expect(default_tz_now, 'now').to.equal('Australia/Sydney')
			})

			it('should warn - real case', () => {
				test_params.default_timezones = [
					{
						date_utc_ms: Number(Date.UTC(1826, 1)),
						new_default: _UNSAFE_CURRENT_SYSTEM_TIMEZONE === 'Europe/Paris' ? 'Asia/Bangkok' : 'Europe/Paris',
					},
				].sort((a, b) => a.date_utc_ms - b.date_utc_ms)
				//console.log({ test_params, dt: test_params.default_timezones, system_tz })

				const default_tz_now = get_default_timezone(now_utc_ms, test_params)
				// TODO spy logger.warn
			})
		})
	})
})
