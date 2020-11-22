import { expect } from 'chai'

import {
	get_current_year,
	_get_system_timezone,
	get_default_timezone,

	create_better_date,
	create_better_date_compat,
	get_human_readable_timestamp_days,
	get_human_readable_timestamp_seconds,
	get_human_readable_timestamp_minutes,
	get_human_readable_timestamp_millis,
	get_human_readable_timestamp_auto, get_timestamp_utc_ms,
} from './better-date'
import { get_params, Params } from '../params'

describe('Better Date', function() {

	describe('utilities', function () {

		describe('get_current_year()', function() {

			it('should work', () => {
				const current_year = get_current_year()
				console.log({ current_year })
				expect(current_year).to.be.a('number')
				expect(current_year).to.be.within(1900, 2100)
			})
		})

		describe('_get_system_timezone()', function() {

			it('should work', () => {
				const current_tz = _get_system_timezone()
				console.log({ current_tz })
				expect(current_tz).to.be.a('string')
				expect(current_tz.length).to.be.at.least(5)
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
				const system_tz = _get_system_timezone()
				const default_tz = get_default_timezone(now_utc_ms, test_params)
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
				//const system_tz = _get_system_timezone()
				//console.log({ test_params, dt: test_params.default_timezones, system_tz })

				const default_tz_2001 = get_default_timezone(get_timestamp_utc_ms(create_better_date_compat(2001, 0)), test_params)
				expect(default_tz_2001, '2001').to.equal('Europe/Paris')

				const default_tz_2009_08_09 = get_default_timezone(get_timestamp_utc_ms(create_better_date_compat(2009, 7, 9)), test_params)
				expect(default_tz_2009_08_09).to.equal('Europe/Paris')
				const default_tz_2009_08_10 = get_default_timezone(get_timestamp_utc_ms(create_better_date_compat(2009, 7, 10)), test_params)
				expect(default_tz_2009_08_10).to.equal('Asia/Bangkok')

				const default_tz_2010_07_08 = get_default_timezone(get_timestamp_utc_ms(create_better_date_compat(2010, 6, 8)), test_params)
				expect(default_tz_2010_07_08).to.equal('Europe/Paris')

				const default_tz_2018 = get_default_timezone(get_timestamp_utc_ms(create_better_date_compat(2018, 0)), test_params)
				expect(default_tz_2018, '2018').to.equal('Australia/Sydney')

				const default_tz_now = get_default_timezone(now_utc_ms, test_params)
				expect(default_tz_now, 'now').to.equal('Australia/Sydney')
			})

			it('should warn - real case', () => {
				const system_tz = _get_system_timezone()
				test_params.default_timezones = [
					{
						date_utc_ms: get_timestamp_utc_ms(create_better_date_compat(1826, 0)),
						new_default: system_tz === 'Europe/Paris' ? 'Asia/Bangkok' : 'Europe/Paris',
					},
				].sort((a, b) => a.date_utc_ms - b.date_utc_ms)
				//console.log({ test_params, dt: test_params.default_timezones, system_tz })

				const default_tz_now = get_default_timezone(now_utc_ms, test_params)
				// TODO spy logger.warn
			})
		})
	})

	describe('selectors', function() {
		const TEST_DATE = create_better_date({
			year: 2003,
			month: 5,
			day: 5,
			hour: 6,
			minute: 7,
			second: 8,
			milli: 9,
			tz: 'Etc/GMT',
		})

		describe('get_timestamp_utc_ms()', function() {

			it('should work')
		})

		describe('get_compact_date()', function() {

			it('should work')
		})

		describe('get_human_readable_timestamp_days()', function() {

			it('should return correct timestamps up to the day', function() {
				const stamp = get_human_readable_timestamp_days(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(10)
				expect(stamp).to.equal('2003-05-05')
			})
		})

		describe('get_human_readable_timestamp_minutes()', function() {

			it('should return correct timestamps up to the minute', function() {
				const stamp = get_human_readable_timestamp_minutes(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(16)
				expect(stamp).to.equal('2003-05-05_06h07')
			})
		})

		describe('get_human_readable_timestamp_second()', function() {

			it('should return correct timestamps up to the second', function() {
				const stamp = get_human_readable_timestamp_seconds(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(19)
				expect(stamp).to.equal('2003-05-05_06h07m08')
			})
		})

		describe('get_human_readable_timestamp_millis()', function() {

			it('should return correct timestamps up to the millisecond', function() {
				const stamp = get_human_readable_timestamp_millis(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(23)
				expect(stamp).to.equal('2003-05-05_06h07m08.009')
			})
		})

		describe('get_human_readable_timestamp_auto()', function() {

			it('should properly ignore the timezone', () => {
				const date1 = create_better_date_compat(2019,11,16,20,38,8,123)
				expect(get_human_readable_timestamp_auto(date1, 'tz:embedded'), 'd1').to.equal('2019-12-16_20h38m08s123')
				expect(get_human_readable_timestamp_auto(date1, 'tz:xxx'), 'd2').to.equal('2019-12-16_20h38m08s123')

				/* is that even a real case?
				const date2 = new Date('2019-12-16T09:38:08.123Z')
				expect(get_human_readable_timestamp_auto(date2), 'd2').to.equal('2019-12-16_09h38m08s123')
				 */
			})
		})
	})

	describe('factories', function() {

		describe('create_better_date_compat()', function() {

		})
	})
})
