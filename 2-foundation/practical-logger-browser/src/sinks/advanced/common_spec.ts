import { expect } from 'chai'

import { ALL_LOG_LEVELS } from '@offirmo/practical-logger-core'

import { LIB } from '../../consts'

import { LEVEL_TO_COLOR_STYLE } from './common'


describe(`${LIB} / sinks / advanced - common`, () => {
	describe('LEVEL_TO_COLOR_STYLE', () => {
		it('should be correct', () => {
			expect(Object.keys(LEVEL_TO_COLOR_STYLE).sort().join(',')).to.equal([...ALL_LOG_LEVELS].sort().join(','))
		})
	})
})
