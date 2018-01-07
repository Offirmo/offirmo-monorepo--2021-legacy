import { expect } from 'chai'

import {
	get_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_ms_v1,
	get_human_readable_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_minutes,
} from '.'


describe('timestamps', function() {

	describe('get_UTC_timestamp_ms()', function() {

		it('should return correct UTC unix timestamps in ms', function() {
			for(let i = 0; i < 10; ++i) {
				const stamp = get_UTC_timestamp_ms()
				console.log(stamp)
				expect(stamp).to.be.a('number')
				expect(stamp).to.be.within(
					1510177449000, // 2017
					4665851049000 // 2117
				)
			}
		})
	})

	describe('get_human_readable_UTC_timestamp_ms_v1()', function() {

		it('should return correct UTC timestamps', function() {
			for(let i = 0; i < 10; ++i) {
				const stamp = get_human_readable_UTC_timestamp_ms_v1()
				console.log(stamp)
				expect(stamp).to.be.a('string')
			}
		})
	})

	describe('get_human_readable_UTC_timestamp_ms()', function() {

		it('should return correct UTC timestamps up to the millisecond', function() {
			for(let i = 0; i < 10; ++i) {
				const stamp = get_human_readable_UTC_timestamp_ms()
				console.log(stamp)
				expect(stamp).to.be.a('string')
			}
		})
	})

	describe('get_human_readable_UTC_timestamp_minutes()', function() {

		it('should return correct UTC timestamps up to the minute', function() {
			for(let i = 0; i < 10; ++i) {
				const stamp = get_human_readable_UTC_timestamp_minutes()
				console.log(stamp)
				expect(stamp).to.be.a('string')
			}
		})
	})
})
