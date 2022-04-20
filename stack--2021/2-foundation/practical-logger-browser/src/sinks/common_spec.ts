import { expect } from 'chai'

import { ALL_LOG_LEVELS } from '@offirmo/practical-logger-core'

import { LIB } from '../consts'

import { LEVEL_TO_CONSOLE_METHOD } from './common'


describe(`${LIB} / sinks - common`, () => {
	describe('LEVEL_TO_CONSOLE_METHOD', () => {
		it('should be correct', () => {
			expect(Object.keys(LEVEL_TO_CONSOLE_METHOD).sort().join(',')).to.equal([...ALL_LOG_LEVELS].sort().join(','))
		})
	})
})
