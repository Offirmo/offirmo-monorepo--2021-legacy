import { expect } from 'chai'
import deep_freeze from 'deep-freeze-strict'

import {
	QUASI_STANDARD_ERROR_FIELDS,
	COMMON_ERROR_FIELDS,
	COMMON_ERROR_FIELDS_EXTENDED,
} from './fields'

import { XXError } from './types'

import { createError } from './util--create'


describe(`common-error-fields - utils`, () => {

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

		describe('message', function() {

			it('should add "error" in the message if not present', () => {
				const err = createError('foo!')
				expect(err.message).to.equal('Error: foo!')
			})

			it('should NOT add "error" in the message present', () => {
				const err = createError('Some eRRor!')
				expect(err.message).to.equal('Some eRRor!')
			})

			it('should pick the message from the attributes if present', () => {
				const err = createError('', {
					message: 'foo!',
				})
				expect(err.message).to.equal('Error: foo!')
				expect(err).not.to.have.deep.property('details.message')
			})
		})

		describe('attributes', function() {
			it('should attach the attributes at the correct place', () => {
				const err = createError('test!', {
					name: 'TEST_NAME', // will be ignored and lost
					message: 'TEST_MSG', // idem
					stack: 'TST_STACK', // idem

					// leftovers, should be added in details (pre)
					bar: 33,

					// should stay as is
					code: '1234', // rem: string type according to nodejs doc
					statusCode: 567,
					shouldRedirect: false,
					framesToPop: 3,
					details: {
						foo: 42,
					},
					_temp: {
						SEC: {},
						statePath: 'TEST_STATE_PATH',
					},

					// leftovers, should be added in details (post)
					logicalStack: 'TST_LOGICAL_STACK',

				}, TypeError)

				const expected = {
					name: 'TypeError',
					message: 'TypeError: test!',
					stack: err.stack,
					code: '1234', // rem: string type according to nodejs doc
					statusCode: 567,
					shouldRedirect: false,
					framesToPop: 4, // +1 added
					details: {
						bar: 33,
						foo: 42,
						logicalStack: 'TST_LOGICAL_STACK',
					},
					_temp: {
						SEC: {},
						statePath: 'TEST_STATE_PATH',
					},
				}
				COMMON_ERROR_FIELDS_EXTENDED.forEach((k: keyof XXError) => {
					expect(err, k).to.have.property(k)
					expect(err[k], k).to.deep.equal(expected[k])
				})
				Object.keys(err).forEach(k => {
					expect(expected, k).to.have.property(k)
				})
			})
		})
	})
})
