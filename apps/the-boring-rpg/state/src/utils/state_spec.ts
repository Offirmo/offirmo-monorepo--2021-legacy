import { expect } from 'chai'

import { LIB } from '../consts'

import { propagate_child_revision_increment_upward } from './state'

describe(`${LIB} - utils - state`, function() {

	describe('propagate_child_revision_increment_upward()', function() {

		it('should no touch the object if no change at all')

		it('should not touch the object if no sub-increments')

		it('should increment if sub-increments')

		it('should throw if already incremented')

		it('should throw if sub-incremented too much')
	})
})
