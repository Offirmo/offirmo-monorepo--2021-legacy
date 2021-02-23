import { expect } from 'chai'
import { DateTime as LuxonDateTime, IANAZone } from 'luxon'

import {
	get_params,
	Params,
	_unsafe_get_system_timezone,
	get_default_timezone,
} from '../params'
import {
	get_compact_date,
	get_human_readable_timestamp_days,
	get_human_readable_timestamp_seconds,
	get_human_readable_timestamp_minutes,
	get_human_readable_timestamp_millis,
	get_human_readable_timestamp_auto,
	get_timestamp_utc_ms_from,
	_get_exif_datetime,

	create_better_date,
	create_better_date_from_ExifDateTime,
	change_tz,
	create_better_date_from_utc_tms,
	create_better_date_from_symd,
	create_better_date_obj,

	assertㆍBetterDateㆍdeepㆍequal,
} from './better-date'

describe('Better Date', function() {

	describe('LuxonDateTime', function () {

		it('should have the expected API', () => {
			const _lx = LuxonDateTime.fromObject({
				year: 2000,
				month: 1, // 1 = Jan
				day: 11,
				hour: 12,
				minute: 12,
				second: 14,
				millisecond: 156,
				zone: 'Etc/GMT',
			})
			//console.log(_lx)
			expect(_lx.isValid).to.be.true
			expect(_lx.toRFC2822()).to.equal('Tue, 11 Jan 2000 12:12:14 +0000')
		})
	})

	describe('utilities', function () {

		describe('_unsafe_get_system_timezone()', function() {

			it('should work', () => {
				const current_tz = _unsafe_get_system_timezone()
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
				const system_tz = _unsafe_get_system_timezone()
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
				//const system_tz = _unsafe_get_system_timezone()
				//console.log({ test_params, dt: test_params.default_timezones, system_tz })

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
				const system_tz = _unsafe_get_system_timezone()
				test_params.default_timezones = [
					{
						date_utc_ms: Number(Date.UTC(1826, 1)),
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
		const TEST_DATE = create_better_date_obj({
			year: 2003,
			month: 4,
			day: 5,
			hour: 6,
			minute: 7,
			second: 8,
			milli: 9,
			tz: 'Indian/Kerguelen', // random not GMT, not UTC, not my system
		})
		/*const TEST_DATE_UTC = create_better_date_obj({
			year: 2003,
			month: 4,
			day: 5,
			hour: 6,
			minute: 7,
			second: 8,
			milli: 9,
		})*/

		describe('get_timestamp_utc_ms_from()', function() {

			it('should work', () => {
				// https://www.epochconverter.com/timezones?q=1049504828009&tz=Indian%2FKerguelen
				expect(get_timestamp_utc_ms_from(TEST_DATE)).to.equal(1049504828009)
			})

			it('should work - reflexive', () => {
				const TEST_TMS = 1234567890
				const ut = create_better_date_from_utc_tms(TEST_TMS, 'tz:auto')
				expect(get_timestamp_utc_ms_from(ut)).to.equal(TEST_TMS)
			})
		})

		describe('get_compact_date()', function() {

			it('should work', () => {
				expect(get_compact_date(TEST_DATE, 'tz:embedded')).to.equal(20030405)
			})
		})

		describe('get_human_readable_timestamp_days()', function() {

			it('should return correct timestamps up to the day', function() {
				const stamp = get_human_readable_timestamp_days(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(10)
				expect(stamp).to.equal('2003-04-05')
			})
		})

		describe('get_human_readable_timestamp_minutes()', function() {

			it('should return correct timestamps up to the minute', function() {
				const stamp = get_human_readable_timestamp_minutes(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(16)
				expect(stamp).to.equal('2003-04-05_06h07')
			})
		})

		describe('get_human_readable_timestamp_second()', function() {

			it('should return correct timestamps up to the second', function() {
				const stamp = get_human_readable_timestamp_seconds(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(19)
				expect(stamp).to.equal('2003-04-05_06h07m08')
			})
		})

		describe('get_human_readable_timestamp_millis()', function() {

			it('should return correct timestamps up to the millisecond', function() {
				const stamp = get_human_readable_timestamp_millis(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(23)
				expect(stamp).to.equal('2003-04-05_06h07m08s009')
			})
		})

		describe('get_human_readable_timestamp_auto()', function() {

			it('should work', function() {
				const stamp = get_human_readable_timestamp_auto(TEST_DATE, 'tz:embedded')
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(23)
				expect(stamp).to.equal('2003-04-05_06h07m08s009')
			})

			it('should properly ignore the timezone')/* => { no longer needed ATM
				const date1 = create_better_date_compat(2019,11,16,20,38,8,123)
				expect(get_human_readable_timestamp_auto(date1, 'tz:embedded'), 'd1').to.equal('2019-12-16_20h38m08s123')
				//expect(get_human_readable_timestamp_auto(date1, 'tz:xxx'), 'd2').to.equal('2019-12-16_20h38m08s123')
				throw new Error('NIMP!')

				// is that even a real case?
				const date2 = new Date('2019-12-16T09:38:08.123Z')
				expect(get_human_readable_timestamp_auto(date2), 'd2').to.equal('2019-12-16_09h38m08s123')
			})*/
		})

		describe('_get_exif_datetime', function () {

			it('should behave as expected', () => {
				const date = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
				const exif_datetime = _get_exif_datetime(date)
				const date2 = create_better_date_from_ExifDateTime(exif_datetime)
				assertㆍBetterDateㆍdeepㆍequal(date, date2)
			})
		})
	})

	describe('factories', function() {

		describe('create_better_date_from_symd()', function () {

			it('should work', () => {
				const bd1 = create_better_date_from_symd(20000101, 'tz:auto')
				expect(get_human_readable_timestamp_auto(bd1, 'tz:embedded')).to.equal('2000-01-01')
			})
		})
	})

	describe('reducers', function() {

		describe('change_tz()', function() {

			it('should work', () => {
				const kg_date = create_better_date_obj({
					year: 2003,
					month: 4,
					day: 5,
					hour: 6,
					minute: 7,
					second: 8,
					milli: 9,
					tz: 'Indian/Kerguelen', // random not GMT, not UTC, not my system
				})
				expect(get_human_readable_timestamp_auto(kg_date, 'tz:embedded')).to.equal('2003-04-05_06h07m08s009')

				const UTC_date = change_tz(kg_date, 'UTC')

				// no change, we didn't change the human components
				expect(get_human_readable_timestamp_auto(UTC_date, 'tz:embedded')).to.equal('2003-04-05_06h07m08s009')
			})
		})
	})
})
