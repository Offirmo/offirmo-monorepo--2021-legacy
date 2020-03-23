import { expect } from 'chai'

import {
	get_human_readable_timestamp_days,
	get_human_readable_timestamp_seconds,
	get_human_readable_timestamp_minutes,
	get_human_readable_timestamp_millis,
	get_human_readable_timestamp_auto,
} from './date_generator'

declare const console: any

describe('date generation', function() {

	describe('millis', function() {

		it('should return correct timestamps up to the millisecond', function() {
			const stamp = get_human_readable_timestamp_millis(new Date())
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(23)
		})
	})

	describe('second()', function() {

		it('should return correct timestamps up to the second', function() {
			const stamp = get_human_readable_timestamp_seconds(new Date())
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(19)
		})
	})

	describe('minutes', function() {

		it('should return correct timestamps up to the minute', function() {
			const stamp = get_human_readable_timestamp_minutes(new Date())
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(16)
		})
	})

	describe('days', function() {

		it('should return correct timestamps up to the day', function() {
			const stamp = get_human_readable_timestamp_days(new Date())
			//console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(10)
		})
	})

	describe('auto', function() {

		it('should properly ignore the timezone', () => {
			const date1 = new Date(2019,11,16,20,38,8,123)
			expect(get_human_readable_timestamp_auto(date1), 'd1').to.equal('2019-12-16_20h38m08s123')

			/* is that even a real case?
			const date2 = new Date('2019-12-16T09:38:08.123Z')
			expect(get_human_readable_timestamp_auto(date2), 'd2').to.equal('2019-12-16_09h38m08s123')
			 */
		})
	})
})
