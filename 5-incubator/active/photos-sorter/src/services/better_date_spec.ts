import { expect } from 'chai'

import { get_current_timezone } from './params'
import {
	create_better_date,
	get_human_readable_timestamp_days,
	get_human_readable_timestamp_seconds,
	get_human_readable_timestamp_minutes,
	get_human_readable_timestamp_millis,
	get_human_readable_timestamp_auto,
} from './better-date'

describe('Better Date', function() {

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


	describe('days', function() {

		it('should return correct timestamps up to the day', function() {
			const stamp = get_human_readable_timestamp_days(TEST_DATE)
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(10)
			expect(stamp).to.equal('2003-05-05')
		})
	})

	describe('minutes', function() {

		it('should return correct timestamps up to the minute', function() {
			const stamp = get_human_readable_timestamp_minutes(TEST_DATE)
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(16)
			expect(stamp).to.equal('2003-05-05_06h07')
		})
	})

	describe('second()', function() {

		it('should return correct timestamps up to the second', function() {
			const stamp = get_human_readable_timestamp_seconds(TEST_DATE)
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(19)
			expect(stamp).to.equal('2003-05-05_06h07m08')
		})
	})

	describe('millis', function() {

		it('should return correct timestamps up to the millisecond', function() {
			const stamp = get_human_readable_timestamp_millis(TEST_DATE)
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(23)
			expect(stamp).to.equal('2003-05-05_06h07m08.009')
		})
	})

	describe('auto', function() {

		it('should properly ignore the timezone', () => {
			const date1 = new Date(2019,11,16,20,38,8,123)
			expect(get_human_readable_timestamp_auto(date1, ZONE_GMT), 'd1').to.equal('2019-12-16_20h38m08s123')
			expect(get_human_readable_timestamp_auto(date1, get_current_timezone()), 'd1').to.equal('2019-12-16_20h38m08s123')

			/* is that even a real case?
			const date2 = new Date('2019-12-16T09:38:08.123Z')
			expect(get_human_readable_timestamp_auto(date2), 'd2').to.equal('2019-12-16_09h38m08s123')
			 */
		})
	})
})
