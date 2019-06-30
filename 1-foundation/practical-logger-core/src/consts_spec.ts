import { expect } from 'chai'

import {
	LOG_LEVEL_TO_HUMAN, LOG_LEVEL_TO_INTEGER,
	LIB
} from './consts'


describe(`${LIB} - consts`, () => {

	describe('LOG_LEVEL_TO_INTEGER', () => {
		it('should be correct', () => {
			const keys = Object.keys(LOG_LEVEL_TO_INTEGER)
			expect(keys).to.have.lengthOf(14)
		})
	})

	describe('LOG_LEVEL_TO_HUMAN', () => {
		it('should be correct', () => {
			expect(Object.keys(LOG_LEVEL_TO_HUMAN).sort().join(',')).to.equal(Object.keys(LOG_LEVEL_TO_INTEGER).sort().join(','))
		})
	})
})
