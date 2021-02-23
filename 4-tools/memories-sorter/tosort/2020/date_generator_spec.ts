import { expect } from 'chai'

import { get_current_timezone } from './params'
import {
	get_human_readable_timestamp_days,
	get_human_readable_timestamp_seconds,
	get_human_readable_timestamp_minutes,
	get_human_readable_timestamp_millis,
	get_human_readable_timestamp_auto,
} from './date_generator'

//declare const console: any

describe('date generator', function() {
	// Note: Where Date is called as a constructor with more than one argument,
	// the specified arguments represent local time.
	// If UTC is desired, use new Date(Date.UTC(...)) with the same arguments.
	const TEST_DATE = new Date(
		2003,
		4, // 0-based
		5,
		6,
		7,
		8,
		9
	)
	const ZONE_GMT = 'Etc/GMT'

	context('when using the base TZ', function() {

	})


	describe('days', function() {

		it('should return correct timestamps up to the day', function() {
			const stamp = get_human_readable_timestamp_days(TEST_DATE, ZONE_GMT)
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(10)
			expect(stamp).to.equal('2003-05-05')
		})
	})

	describe('minutes', function() {

		it('should return correct timestamps up to the minute', function() {
			const stamp = get_human_readable_timestamp_minutes(TEST_DATE, ZONE_GMT)
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(16)
			expect(stamp).to.equal('2003-05-05_06h07')
		})
	})

	describe('second()', function() {

		it('should return correct timestamps up to the second', function() {
			const stamp = get_human_readable_timestamp_seconds(TEST_DATE, ZONE_GMT)
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(19)
			expect(stamp).to.equal('2003-05-05_06h07m08')
		})
	})

	describe('millis', function() {

		it('should return correct timestamps up to the millisecond', function() {
			const stamp = get_human_readable_timestamp_millis(TEST_DATE, ZONE_GMT)
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
