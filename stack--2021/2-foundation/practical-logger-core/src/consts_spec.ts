import { expect } from 'chai'

import {
	LIB,
	LOG_LEVEL_TO_INTEGER,
	ALL_LOG_LEVELS,
	LOG_LEVEL_TO_HUMAN,
} from './consts'


describe(`${LIB} - consts`, () => {

	describe('LOG_LEVEL_TO_INTEGER', () => {
		it('should be correct', () => {
			const keys = Object.keys(LOG_LEVEL_TO_INTEGER)
			expect(keys).to.have.lengthOf(14)
		})
	})

	describe('ALL_LOG_LEVELS', () => {
		it('should be correct', () => {
			expect(ALL_LOG_LEVELS).to.have.lengthOf(14)
			expect([...ALL_LOG_LEVELS].sort().join(',')).to.equal(Object.keys(LOG_LEVEL_TO_INTEGER).sort().join(','))
		})
	})

	describe('LOG_LEVEL_TO_HUMAN', () => {
		it('should be correct', () => {
			expect(Object.keys(LOG_LEVEL_TO_HUMAN).sort().join(',')).to.equal(Object.keys(LOG_LEVEL_TO_INTEGER).sort().join(','))
			Object.entries(LOG_LEVEL_TO_HUMAN).forEach(([ll, h]) => {
				expect(h).to.be.a('string')
				expect(h.startsWith(ll), `${h} starts with ${ll}`).to.be.true
			})
		})
	})
})
