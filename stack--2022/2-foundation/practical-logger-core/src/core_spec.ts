import { expect } from 'chai'

import {
	LIB,
} from './consts'

import {
	create,
	checkLevel,
} from './core'


describe(`${LIB} - core`, () => {

	describe('create()', () => {
		it('should work with no params', () => {
			const logger = create()
			logger.fatal('Hello!')
		})
	})

	describe('checkLevel()', () => {
		it('should throw if not a level', () => {
			expect(() => checkLevel('foo')).to.throw('Not a valid log level')
		})
	})

	// TODO should be compatible with bunyan
	// https://github.com/trentm/node-bunyan#log-record-fields
})
