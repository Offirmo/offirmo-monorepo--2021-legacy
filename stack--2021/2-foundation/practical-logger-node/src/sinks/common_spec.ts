import { expect } from 'chai'

import { ALL_LOG_LEVELS } from '@offirmo/practical-logger-core'

import { LIB } from '../consts'

import { LEVEL_TO_ASCII, LEVEL_TO_STYLIZE } from './common'


describe(`${LIB} / sinks - common`, () => {

	describe('LEVEL_TO_ASCII', () => {

		it('should be correct', () => {
			expect(Object.keys(LEVEL_TO_ASCII).sort().join(',')).to.equal([...ALL_LOG_LEVELS].sort().join(','))
		})
	})

	describe('LEVEL_TO_STYLIZE', () => {

		it('should be correct', () => {
			expect(Object.keys(LEVEL_TO_STYLIZE).sort().join(',')).to.equal([...ALL_LOG_LEVELS].sort().join(','))
		})
	})
})
