import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import {
	QUASI_STANDARD_ERROR_FIELDS,
	COMMON_ERROR_FIELDS,
	COMMON_ERROR_FIELDS_EXTENDED,
} from './fields'

import { createError } from './util--create'
import { normalizeError } from './util--normalize'
import {XXError} from './types'


describe.only(`common-error-fields - utils`, () => {

	describe('createError()', () => {
		it('should work', () => {
			const err = createError('foo', {
				statusCode: 555,
				foo: 42,
				framesToPop: 3,
			})

			expect(err.message).to.equal('Error: foo')

			expect(err.statusCode).to.equal(555)
			expect(err.details?.statusCode).to.be.undefined

			expect(err.details?.foo).to.equal(42)
			expect((err as any).foo).to.be.undefined

			expect(err.details?.framesToPop).to.be.undefined
			expect(err.framesToPop).to.equal(4) // +1 added
		})

		it('should add "error" in the message if not present', () => {
			const err = createError('foo!')
			expect(err.message).to.equal('Error: foo!')
		})

		it('should NOT add "error" in the message present', () => {
			const err = createError('Some eRRor!')
			expect(err.message).to.equal('Some eRRor!')
		})
	})

	describe('normalizeError', () => {

		it('should work and preserve the constructor', () => {
			let xerr: any = new TypeError('foo!')
			xerr.details = {
				foo: 42
			}
			xerr = deepFreeze(xerr)

			const nerr = normalizeError(xerr)

			;([...COMMON_ERROR_FIELDS_EXTENDED] as Array<keyof XXError>).forEach(f => {
				expect(nerr[f]).to.deep.equal(xerr[f])
			})
			expect(Object.getPrototypeOf(nerr)).to.equal(Object.getPrototypeOf(xerr))
		})
	})
})
