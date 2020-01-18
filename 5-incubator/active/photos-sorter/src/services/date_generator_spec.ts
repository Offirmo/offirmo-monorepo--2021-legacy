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
			const stamp = get_human_readable_timestamp_millis()
			console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(23)
		})
	})

	describe('second()', function() {

		it('should return correct UTC timestamps up to the second', function() {
			const stamp = get_human_readable_timestamp_seconds()
			console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(19)
		})
	})

	describe('minutes', function() {

		it('should return correct UTC timestamps up to the minute', function() {
			const stamp = get_human_readable_timestamp_minutes()
			console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(16)
		})
	})

	describe('days', function() {

		it('should return correct UTC timestamps up to the day', function() {
			const stamp = get_human_readable_timestamp_days()
			console.log(stamp)
			expect(stamp).to.be.a('string')
			expect(stamp.length).to.equal(10)
		})
	})
})
