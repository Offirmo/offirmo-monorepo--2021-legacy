import { expect } from 'chai'
import * as Luxon from 'luxon'
import { DateTime as LuxonDateTime } from 'luxon'

import {
	_get_exif_datetime,
	get_compact_date,
	get_human_readable_timestamp_auto,
	get_human_readable_timestamp_days,
	get_human_readable_timestamp_millis,
	get_human_readable_timestamp_minutes,
	get_human_readable_timestamp_seconds,
	get_members_for_serialization,
	get_timestamp_utc_ms_from,
	get_embedded_timezone,

	compare_utc,
	is_deep_equal,
	min, max,

	create_better_date,
	create_better_date_from_ExifDateTime,
	create_better_date_from_utc_tms,
	create_better_date_from_symd,
	create_better_date_obj,
	reinterpret_with_different_tz,

	add_days_to_simple_date,
	get_elapsed_days_between_ordered_simple_dates,

	assertㆍBetterDateㆍdeepㆍequal,
} from './better-date'
import { get_params } from '../params'

describe('Better Date', function() {
	const PARAMS = {
		...get_params(),
		default_timezones: [
			// if no time zone, infer it according to this timetable
			// Expected to be in order
			{
				date_utc_ms: Number(Date.UTC(get_params().date_lower_boundⳇₓyear, 0)),
				new_default: 'Indian/Kerguelen',
			},
		],
	}

	describe('BetterDate type and operators', function() {

		describe('prerequisites', function () {

			describe('underlying lib [LuxonDateTime]', function () {

				it('should have the expected API', () => {
					const _lx = LuxonDateTime.fromObject({
							year: 2000,
							month: 1, // 1 = Jan
							day: 11,
							hour: 12,
							minute: 12,
							second: 14,
							millisecond: 156,
						},
						{
							zone: 'Etc/GMT',
						})
					//console.log(_lx)
					expect(_lx.isValid).to.be.true
					expect(_lx.toRFC2822()).to.equal('Tue, 11 Jan 2000 12:12:14 +0000')
				})

				it('should recognize Etc/GMT', () => {
					const z = new Luxon.IANAZone('Etc/GMT')
					expect(z.isValid).to.be.true
				})

				it('should recognize UTC+10', () => {
					//const z = new Luxon.IANAZone('UTC+10')
					const _lx = LuxonDateTime.fromObject({
							year: 2000,
							month: 1, // 1 = Jan
							day: 11,
							hour: 12,
							minute: 12,
							second: 14,
							millisecond: 156,
						},
						{
							zone: 'UTC+10',
						})
					//console.log(_lx)
					expect(_lx.isValid).to.be.true
					expect(_lx.toRFC2822()).to.equal('Tue, 11 Jan 2000 12:12:14 +1000')
				})
			})
		})

		describe('selectors', function () {
			const TEST_DATE_EXPLICIT_TZ = create_better_date_obj({
				year: 2003,
				month: 4,
				day: 5,
				hour: 6,
				minute: 7,
				second: 8,
				milli: 9,
				tz: 'Indian/Kerguelen', // random not GMT, not UTC, not my system
			})
			const TEST_DATE_AUTO_TZ = create_better_date_obj({
				year: 2003,
				month: 4,
				day: 5,
				hour: 6,
				minute: 7,
				second: 8,
				milli: 9,
				tz: 'tz:auto',
			})

			describe('get_timestamp_utc_ms_from()', function () {

				it('should work', () => {
					// https://www.epochconverter.com/timezones?q=1049504828009&tz=Indian%2FKerguelen
					expect(get_timestamp_utc_ms_from(TEST_DATE_EXPLICIT_TZ)).to.equal(1049504828009)
				})

				it('should work - reflexive', () => {
					const TEST_TMS = 1234567890
					const ut = create_better_date_from_utc_tms(TEST_TMS, 'tz:auto')
					expect(get_timestamp_utc_ms_from(ut)).to.equal(TEST_TMS)
				})
			})

			describe('get_compact_date()', function () {

				it('should work', () => {
					expect(get_compact_date(TEST_DATE_EXPLICIT_TZ, 'tz:embedded')).to.equal(20030405)
				})

				it('should work - taking tz into account', () => {
					// real case
					const TEST_DATE = create_better_date_obj({
						year: 2011,
						month: 4,
						day: 21,
						hour: 23,
						minute: 42,
						tz: 'Europe/Paris',
					})
					expect(get_compact_date(TEST_DATE, 'tz:embedded')).to.equal(20110421)
					expect(get_compact_date(TEST_DATE, 'Australia/Sydney')).to.equal(20110422)
				})
			})

			describe('get_human_readable_timestamp_days()', function () {

				it('should return correct timestamps up to the day', function () {
					const stamp = get_human_readable_timestamp_days(TEST_DATE_EXPLICIT_TZ, 'tz:embedded')
					//console.log(stamp)
					expect(stamp).to.be.a('string')
					expect(stamp.length).to.equal(10)
					expect(stamp).to.equal('2003-04-05')
				})

				// TODO test tz
			})

			describe('get_human_readable_timestamp_minutes()', function () {

				it('should return correct timestamps up to the minute', function () {
					const stamp = get_human_readable_timestamp_minutes(TEST_DATE_EXPLICIT_TZ, 'tz:embedded')
					//console.log(stamp)
					expect(stamp).to.be.a('string')
					expect(stamp.length).to.equal(16)
					expect(stamp).to.equal('2003-04-05_06h07')
				})
			})

			describe('get_human_readable_timestamp_second()', function () {

				it('should return correct timestamps up to the second', function () {
					const stamp = get_human_readable_timestamp_seconds(TEST_DATE_EXPLICIT_TZ, 'tz:embedded')
					//console.log(stamp)
					expect(stamp).to.be.a('string')
					expect(stamp.length).to.equal(19)
					expect(stamp).to.equal('2003-04-05_06h07m08')
				})
			})

			describe('get_human_readable_timestamp_millis()', function () {

				it('should return correct timestamps up to the millisecond', function () {
					const stamp = get_human_readable_timestamp_millis(TEST_DATE_EXPLICIT_TZ, 'tz:embedded')
					//console.log(stamp)
					expect(stamp).to.be.a('string')
					expect(stamp.length).to.equal(23)
					expect(stamp).to.equal('2003-04-05_06h07m08s009')
				})
			})

			describe('get_human_readable_timestamp_auto()', function () {

				it('should work', function () {
					const stamp = get_human_readable_timestamp_auto(TEST_DATE_EXPLICIT_TZ, 'tz:embedded')
					//console.log(stamp)
					expect(stamp).to.be.a('string')
					expect(stamp.length).to.equal(23)
					expect(stamp).to.equal('2003-04-05_06h07m08s009')
				})
			})

			describe('_get_exif_datetime', function () {

				it('should behave as expected -- tz auto', () => {
					const date = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625, PARAMS)
					const exif_datetime = _get_exif_datetime(date)
					expect(exif_datetime.zone).to.equal('Indian/Kerguelen')
					const date2 = create_better_date_from_ExifDateTime(exif_datetime)
					assertㆍBetterDateㆍdeepㆍequal(date, date2)
				})

				it('should behave as expected - tz explicit', () => {
					const date = create_better_date('PST', 2017, 10, 20, 5, 1, 44, 625, PARAMS)
					const exif_datetime = _get_exif_datetime(date)
					expect(exif_datetime.zone).to.equal('PST')
					const date2 = create_better_date_from_ExifDateTime(exif_datetime)
					assertㆍBetterDateㆍdeepㆍequal(date, date2)
				})
			})

			describe('get_members_for_serialization()', function () {

				it('should work -- explicit tz', () => {
					const members = get_members_for_serialization(TEST_DATE_EXPLICIT_TZ)
					const reconstructed = create_better_date_obj(members)
					assertㆍBetterDateㆍdeepㆍequal(TEST_DATE_EXPLICIT_TZ, reconstructed)
				})

				it('should work -- auto tz', () => {
					const members = get_members_for_serialization(TEST_DATE_AUTO_TZ)
					const reconstructed = create_better_date_obj(members)
					assertㆍBetterDateㆍdeepㆍequal(TEST_DATE_AUTO_TZ, reconstructed)
				})
			})
		})

		describe('operators', function () {
			const TEST_DATE_1 = create_better_date_obj({
				year: 2003,
				month: 4,
				day: 5,
				hour: 6,
				minute: 7,
				second: 8,
				milli: 9,
				tz: 'UTC+10',
			})
			const TEST_DATE_1_copy = create_better_date_obj({
				year: 2003,
				month: 4,
				day: 5,
				hour: 6,
				minute: 7,
				second: 8,
				milli: 9,
				tz: 'UTC+10',
			})
			const TEST_DATE_1_alt_tz = create_better_date_obj({
				year: 2003,
				month: 4,
				day: 5,
				hour: 8, // +2
				minute: 7,
				second: 8,
				milli: 9,
				tz: 'UTC+12', // +2
			})
			const TEST_DATE_2_nearly_1 = create_better_date_obj({
				year: 2003,
				month: 4,
				day: 5,
				hour: 6,
				minute: 7,
				second: 8,
				milli: 9,
				tz: 'UTC+11', // not same tz = different date! 1h BEFORE
			})
			const TEST_DATE_3 = create_better_date_obj({
				year: 2013,
				month: 4,
				day: 5,
				hour: 6,
				minute: 7,
				second: 8,
				milli: 9,
				tz: 'UTC+10',
			})

			describe('compare_utc()', function () {

				it('should work', () => {
					const t1_utc = get_timestamp_utc_ms_from(TEST_DATE_1)
					const t2_utc = get_timestamp_utc_ms_from(TEST_DATE_2_nearly_1)
					const t3_utc = get_timestamp_utc_ms_from(TEST_DATE_3)
					expect(t2_utc).to.be.below(t1_utc)
					expect(t3_utc).to.be.above(t1_utc)
					expect(t3_utc).to.be.above(t2_utc)

					// identity
					expect(compare_utc(TEST_DATE_1, TEST_DATE_1), 'id1').to.equal(0)
					expect(compare_utc(TEST_DATE_3, TEST_DATE_3), 'id2').to.equal(0)

					// deep equality
					expect(compare_utc(TEST_DATE_1, TEST_DATE_1_copy), 'de1').to.equal(0)
					expect(compare_utc(TEST_DATE_1_copy, TEST_DATE_1), 'de2').to.equal(0)

					// moment equality while different tz
					expect(compare_utc(TEST_DATE_1, TEST_DATE_1_alt_tz), 'et1').to.equal(0)
					expect(compare_utc(TEST_DATE_1_alt_tz, TEST_DATE_1), 'et2').to.equal(0)

					// equality of everything but TZ
					expect(compare_utc(TEST_DATE_1, TEST_DATE_2_nearly_1), 'tz+1a').to.be.above(0)
					expect(compare_utc(TEST_DATE_2_nearly_1, TEST_DATE_1), 'tz+1b').to.be.below(0)

					// not equal
					expect(compare_utc(TEST_DATE_1, TEST_DATE_3), 'ne1').to.be.below(0)
					expect(compare_utc(TEST_DATE_3, TEST_DATE_1), 'ne2').to.be.above(0)
				})
			})

			describe('is_deep_equal()', function () {

				it('should work', () => {
					// identity
					expect(is_deep_equal(TEST_DATE_1, TEST_DATE_1)).to.be.true
					expect(is_deep_equal(TEST_DATE_3, TEST_DATE_3)).to.be.true

					// deep equality
					expect(is_deep_equal(TEST_DATE_1, TEST_DATE_1_copy)).to.be.true
					expect(is_deep_equal(TEST_DATE_1_copy, TEST_DATE_1)).to.be.true

					// moment equality while different tz
					expect(is_deep_equal(TEST_DATE_1, TEST_DATE_1_alt_tz)).to.be.false
					expect(is_deep_equal(TEST_DATE_1_alt_tz, TEST_DATE_1)).to.be.false

					// equality of everything but TZ
					expect(is_deep_equal(TEST_DATE_1, TEST_DATE_2_nearly_1)).to.be.false
					expect(is_deep_equal(TEST_DATE_2_nearly_1, TEST_DATE_1)).to.be.false

					// not equal
					expect(is_deep_equal(TEST_DATE_1, TEST_DATE_3)).to.be.false
					expect(is_deep_equal(TEST_DATE_3, TEST_DATE_1)).to.be.false
				})
			})

			describe('min', function () {

				it('should work', () => {
					// identity
					;(() => {
						const _min = min(TEST_DATE_1, TEST_DATE_1)
						expect(is_deep_equal(_min, TEST_DATE_1), 'id1').to.be.true
					})()
					;(() => {
						const _min = min(TEST_DATE_3, TEST_DATE_3)
						expect(is_deep_equal(_min, TEST_DATE_3), 'id2').to.be.true
					})()

					// deep equality, careful of the order
					;(() => {
						const _min = min(TEST_DATE_1, TEST_DATE_1_copy)
						expect(is_deep_equal(_min, TEST_DATE_1), 'de1').to.be.true
					})()
					;(() => {
						const _min = min(TEST_DATE_1_copy, TEST_DATE_1)
						expect(is_deep_equal(_min, TEST_DATE_1_copy), 'de2').to.be.true
					})()

					// moment equality while different tz, careful of the order
					;(() => {
						const _min = min(TEST_DATE_1, TEST_DATE_1_alt_tz)
						expect(is_deep_equal(_min, TEST_DATE_1), 'me1').to.be.true
					})()
					;(() => {
						const _min = min(TEST_DATE_1_alt_tz, TEST_DATE_1)
						expect(is_deep_equal(_min, TEST_DATE_1_alt_tz), 'me2').to.be.true
					})()

					// equality of everything but TZ
					;(() => {
						const _min = min(TEST_DATE_1, TEST_DATE_2_nearly_1)
						expect(is_deep_equal(_min, TEST_DATE_2_nearly_1), 'tz+1a').to.be.true
					})()
					;(() => {
						const _min = min(TEST_DATE_2_nearly_1, TEST_DATE_1)
						expect(is_deep_equal(_min, TEST_DATE_2_nearly_1), 'tz+1b').to.be.true
					})()

					// not equal
					;(() => {
						const _min = min(TEST_DATE_1, TEST_DATE_3)
						expect(is_deep_equal(_min, TEST_DATE_1), 'ne1').to.be.true
					})()
					;(() => {
						const _min = min(TEST_DATE_3, TEST_DATE_1)
						expect(is_deep_equal(_min, TEST_DATE_1), 'ne2').to.be.true
					})()
				})
			})

			describe('max', function () {

				it('should work', () => {
					// sanity check, it's a minor variant of min
					const _max = max(TEST_DATE_1, TEST_DATE_3)
					expect(is_deep_equal(_max, TEST_DATE_3)).to.be.true
				})

				it('should work -- bug', () => {
					const TEST_DATE_A = create_better_date_obj({
						year: 2011,
						month: 4,
						day: 20,
						hour: 22,
						minute: 42,
						second: 48,
						milli: 0,
						tz: 'tz:auto',
					})
					expect(get_timestamp_utc_ms_from(TEST_DATE_A) === 1303332168000)

					const TEST_DATE_B = create_better_date_obj({
						year: 2011,
						month: 4,
						day: 21,
						hour: 4,
						minute: 42,
						second: 44,
						milli: 0,
						tz: 'tz:auto',
					})
					expect(get_timestamp_utc_ms_from(TEST_DATE_B) === 1303324964000)

					expect(max(TEST_DATE_B, TEST_DATE_A)).to.equal(TEST_DATE_B)
					expect(min(TEST_DATE_B, TEST_DATE_A)).to.equal(TEST_DATE_A)
				})
			})
		})

		describe('factories', function () {

			describe('create_better_date_from_utc_tms()', function () {

				it('should work -- tz auto', () => {
					const bd1 = create_better_date_from_utc_tms(1278547200000, 'tz:auto')
					expect(bd1._has_explicit_timezone).to.be.false
					expect(get_human_readable_timestamp_auto(bd1, 'tz:embedded')).to.equal('2010-07-08_02h00')
					expect(get_timestamp_utc_ms_from(bd1)).to.equal(1278547200000)
				})

				it('should work -- tz explicit', () => {
					const bd1 = create_better_date_from_utc_tms(1278547200000, 'Indian/Kerguelen')
					expect(bd1._has_explicit_timezone).to.be.true
					expect(get_embedded_timezone(bd1)).to.equal('Indian/Kerguelen')
					expect(get_human_readable_timestamp_auto(bd1, 'tz:embedded')).to.equal('2010-07-08_05h00')
					expect(get_timestamp_utc_ms_from(bd1)).to.equal(1278547200000)
				})
			})

			describe('create_better_date_from_symd()', function () {

				it('should work -- tz auto', () => {
					const bd1 = create_better_date_from_symd(20000101, 'tz:auto')
					expect(bd1._has_explicit_timezone).to.be.false
					expect(get_human_readable_timestamp_auto(bd1, 'tz:embedded')).to.equal('2000-01-01')
				})

				it('should work -- tz explicit', () => {
					const bd1 = create_better_date_from_symd(20000101, 'Indian/Kerguelen')
					expect(bd1._has_explicit_timezone).to.be.true
					expect(get_embedded_timezone(bd1)).to.equal('Indian/Kerguelen')
					expect(get_human_readable_timestamp_auto(bd1, 'tz:embedded')).to.equal('2000-01-01')
				})

				it('should detect errors', () => {
					expect(
						() => create_better_date_from_symd(20000100, 'tz:auto')
					).to.throw('out of range')
				})
			})

			describe('create_better_date()', function () {

				it('should reject when not enough members', () => {
					expect(() => create_better_date('tz:auto')).to.throw('not enough defined params')
				})

				describe(`with tz === 'tz:auto'`, function () {

					it('should work and pick the default tz', () => {
						const date = create_better_date('tz:auto', 2016, 11, 21, 9, 8, 7, 654, PARAMS)
						expect(date._has_explicit_timezone).to.be.false
						const tz = get_embedded_timezone(date)
						expect(tz).to.equal('Indian/Kerguelen') // auto from PARAMS
					})

					it('should be reversible', () => {
						const date1 = create_better_date('tz:auto', 2016, 11, 21, 9, 8, 7, 654, PARAMS)
						//console.log(date1)
						const tms1 = get_timestamp_utc_ms_from(date1)
						const date2 = create_better_date_from_utc_tms(tms1, 'tz:auto', PARAMS)
						const tms2 = get_timestamp_utc_ms_from(date2)
						expect(tms2).to.equal(tms1)

						const tz1 = get_embedded_timezone(date1)
						const tz2 = get_embedded_timezone(date2)
						expect(tz1).to.equal('Indian/Kerguelen')
						expect(tz2).to.equal('Indian/Kerguelen')

						assertㆍBetterDateㆍdeepㆍequal(date1, date2)
					})
				})

				describe(`with tz === explicit`, function () {

					it('should work and use the given tz', () => {
						const date = create_better_date('Europe/Paris', 2016, 11, 21, 9, 8, 7, 654)
						expect(date._has_explicit_timezone).to.be.true
						const tz = get_embedded_timezone(date)
						expect(tz).to.equal('Europe/Paris')
					})
				})
			})

			describe('create_better_date_obj()', function () {

				it('should reject when not enough members', () => {
					expect(() => create_better_date_obj({
						tz: 'tz:auto',
					})).to.throw('not enough defined params')
				})
			})
		})

		describe('reducers', function () {

			describe('reinterpret_with_different_tz()', function () {

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

					const UTC_date = reinterpret_with_different_tz(kg_date, 'UTC')

					// no change, we didn't change the human components
					expect(get_human_readable_timestamp_auto(UTC_date, 'tz:embedded')).to.equal('2003-04-05_06h07m08s009')
				})
			})
		})
	})

	describe('symd', function() {

		describe('reducers', function() {

			describe('add_days_to_simple_date()', function() {

				context('when adding 0', function () {

					it('should work', () => {
						const symd = 20340304
						expect(add_days_to_simple_date(symd, 0)).to.equal(20340304)
						expect(add_days_to_simple_date(symd, -0)).to.equal(20340304)

					})
				})

				context('when adding', function () {

					it('should work - trivial case', () => {
						expect(add_days_to_simple_date(20220204, 1)).to.equal(20220205)
						expect(add_days_to_simple_date(20220204, 10)).to.equal(20220214)
						expect(add_days_to_simple_date(20220204, 40)).to.equal(20220316)
					})

					it('should work - limits', () => {
						expect(add_days_to_simple_date(20001231, 1)).to.equal(20010101)
						expect(add_days_to_simple_date(20001231, 365)).to.equal(20011231)
						expect(add_days_to_simple_date(20001231, 366)).to.equal(20020101)
					})

					it('should work - corner cases', () => {
						expect(add_days_to_simple_date(20220228, 1)).to.equal(20220301)
					})
				})

				context('when substracting', function () {

					it('should work - trivial case', () => {
						expect(add_days_to_simple_date(20220205, -1)).to.equal(20220204)
						expect(add_days_to_simple_date(20220214, -10)).to.equal(20220204)
						expect(add_days_to_simple_date(20220316, -40)).to.equal(20220204)
					})

					it('should work - limits', () => {
						expect(add_days_to_simple_date(20010101, -1)).to.equal(20001231)
						expect(add_days_to_simple_date(20011231, -365)).to.equal(20001231)
						expect(add_days_to_simple_date(20020101, -366)).to.equal(20001231)
					})

					it('should work - corner cases', () => {
						expect(add_days_to_simple_date(20220301, -1)).to.equal(20220228)
					})
				})
			})

			describe('get_elapsed_days_between_ordered_simple_dates()', function() {

				it('should work - trivial case', () => {
					expect(get_elapsed_days_between_ordered_simple_dates(20220204, 20220205)).to.equal(1)
					expect(get_elapsed_days_between_ordered_simple_dates(20220204, 20220214)).to.equal(10)
					expect(get_elapsed_days_between_ordered_simple_dates(20220204, 20220316)).to.equal(40)
				})

				it('should work - limits', () => {
					expect(get_elapsed_days_between_ordered_simple_dates(20001231, 20010101)).to.equal(1)
					expect(get_elapsed_days_between_ordered_simple_dates(20001231, 20011231)).to.equal(365)
					expect(get_elapsed_days_between_ordered_simple_dates(20001231, 20020101)).to.equal(366)
				})

				it('should work - corner cases', () => {
					expect(get_elapsed_days_between_ordered_simple_dates(20220228, 20220301)).to.equal(1)
				})
			})
		})
	})
})
