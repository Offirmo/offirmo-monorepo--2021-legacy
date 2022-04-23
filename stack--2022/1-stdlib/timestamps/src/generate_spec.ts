import { expect } from 'chai'
import * as sinon from 'sinon'

import {
	get_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_seconds,
	get_human_readable_UTC_timestamp_minutes,
	get_human_readable_UTC_timestamp_days,
	TEST_TIMESTAMP_MS,
} from '.'

declare const console: any

describe('@offirmo-private/timestamps', function() {

	describe('get_UTC_timestamp_ms()', function() {

		it('should return correct UTC unix timestamps in ms', function() {
			//console.log(get_UTC_timestamp_ms())

			for(let i = 0; i < 10; ++i) {
				const stamp = get_UTC_timestamp_ms()
				//console.log(stamp)
				expect(stamp).to.be.a('number')
				expect(stamp).to.be.within(
					1510177449000, // 2017
					4665851049000, // 2117
				)
			}
		})

		describe('testability', function () {
			it('should allow passing a forced time', function() {
				const date = new Date(TEST_TIMESTAMP_MS)
				expect(Number(date)).to.equal(TEST_TIMESTAMP_MS)
				const stamp = get_UTC_timestamp_ms(date)
				expect(stamp).to.equal(TEST_TIMESTAMP_MS)
			})

			context('when using sinon', function() {
				beforeEach(function () {
					;(this as any).clock = sinon.useFakeTimers(TEST_TIMESTAMP_MS)
				})
				afterEach(function () {
					;(this as any).clock.restore()
				})

				it('should be affected by useFakeTimers()', function() {
					// test sinon itself
					const date = new Date()
					expect(Number(date)).to.equal(TEST_TIMESTAMP_MS)

					// and us
					const stamp = get_UTC_timestamp_ms()
					expect(stamp).to.equal(TEST_TIMESTAMP_MS)
				})
			})
		})
	})

	describe('get_human_readable_UTC_timestamp_ms()', function() {

		it('should return correct UTC timestamps up to the millisecond', function() {
			//console.log(get_human_readable_UTC_timestamp_ms())

			for(let i = 0; i < 10; ++i) {
				const stamp = get_human_readable_UTC_timestamp_ms()
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(21)
			}
		})
	})

	describe('get_human_readable_UTC_timestamp_seconds()', function() {

		it('should return correct UTC timestamps up to the second', function() {
			//console.log(get_human_readable_UTC_timestamp_seconds())

			for(let i = 0; i < 10; ++i) {
				const stamp = get_human_readable_UTC_timestamp_seconds()
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(17)
			}
		})
	})

	describe('get_human_readable_UTC_timestamp_minutes()', function() {

		it('should return correct UTC timestamps up to the minute', function() {
			//console.log(get_human_readable_UTC_timestamp_minutes())

			for(let i = 0; i < 10; ++i) {
				const stamp = get_human_readable_UTC_timestamp_minutes()
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(14)
			}
		})
	})

	describe('get_human_readable_UTC_timestamp_days()', function() {

		it('should return correct UTC timestamps up to the day', function() {
			//console.log(get_human_readable_UTC_timestamp_days())

			for(let i = 0; i < 10; ++i) {
				const stamp = get_human_readable_UTC_timestamp_days()
				//console.log(stamp)
				expect(stamp).to.be.a('string')
				expect(stamp.length).to.equal(8)
			}
		})
	})
})
