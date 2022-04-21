import { expect } from 'chai'

import {
	QUASI_STANDARD_ERROR_FIELDS,
	COMMON_ERROR_FIELDS,
} from './fields'

describe(`common-error-fields - fields`, () => {

	describe('QUASI_STANDARD_ERROR_FIELDS', () => {

		it('should be healthy', () => {
			expect(QUASI_STANDARD_ERROR_FIELDS.has('message')).to.be.true
			expect(QUASI_STANDARD_ERROR_FIELDS.has('name')).to.be.true
			expect(QUASI_STANDARD_ERROR_FIELDS.has('stack')).to.be.true
		})
	})

	describe('COMMON_ERROR_FIELDS', () => {

		it('should contain the standard error fields', () => {
			for (let field of QUASI_STANDARD_ERROR_FIELDS.keys()) {
				expect(QUASI_STANDARD_ERROR_FIELDS.has(field)).to.be.true
				expect(COMMON_ERROR_FIELDS.has(field)).to.be.true
			}
		})

		it('should contain extra fields', () => {
			//console.log(COMMON_ERROR_FIELDS)
			expect(COMMON_ERROR_FIELDS.size).to.be.above(QUASI_STANDARD_ERROR_FIELDS.size)
		})
	})
})
