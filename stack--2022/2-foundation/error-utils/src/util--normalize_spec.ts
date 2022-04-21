import { expect } from 'chai'
import deep_freeze from 'deep-freeze-strict'

import {
	QUASI_STANDARD_ERROR_FIELDS,
	COMMON_ERROR_FIELDS,
	COMMON_ERROR_FIELDS_EXTENDED,
} from './fields'

import { XXError } from './types'
import { normalizeError } from './util--normalize'


describe(`common-error-fields - utils`, () => {

	describe('normalizeError', () => {
		const _demo_error = new Error('[Test!]')

		describe('when AD-HOC re-creating the error object', function() {

			it('should work and re-create only if the object is not already an error -- base', () => {
				let err = new Error('foo!')
				err = deep_freeze(err)

				const normalized_err = normalizeError(err)
				expect(normalized_err).to.equal(err) // NO re-creation
			})

			it('should work and re-create only if the object is not already an error -- advanced', () => {
				let xerr: any = new TypeError('foo!')
				xerr.details = {
					foo: 42
				}
				xerr = deep_freeze(xerr)

				const normalized_err = normalizeError(xerr)
				expect(normalized_err).to.equal(xerr) // NO re-creation
			})

			it('should work on anything -- undefined', () => {
				const normalized_err = normalizeError(undefined as any)
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error: "undefined" thrown!]')
			})

			it('should work on anything -- null', () => {
				const normalized_err = normalizeError(null as any)
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error: "null" thrown!]')
			})

			it('should work on anything -- number', () => {
				const normalized_err = normalizeError(-42 as any)
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error of type "number" thrown!]')
			})

			it('should work on anything -- string', () => {
				const normalized_err = normalizeError('foo' as any)
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error of type "string" thrown: "foo"!]')
			})

			it('should work on anything -- empty object', () => {
				const normalized_err = normalizeError({} as any)
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[object with no error shape thrown!]')
			})

			it('should work on anything -- vague object', () => {
				const badly_shaped = {message: 'foo!'} as any

				const normalized_err = normalizeError(badly_shaped)
				expect(normalized_err).not.to.equal(badly_shaped)

				expect(normalized_err instanceof Error).to.be.true
				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('foo!')
			})
		})

		describe('when ALWAYS re-creating the error object', function() {

			it('should work and preserve the constructor', () => {
				let xerr: any = new TypeError('foo!')
				xerr.details = {
					foo: 42
				}
				xerr = deep_freeze<any>(xerr)

				const normalized_err = normalizeError(xerr, {alwaysRecreate: true})
				expect(normalized_err).not.to.equal(xerr)
				expect(normalized_err instanceof Error).to.be.true

				;([...COMMON_ERROR_FIELDS_EXTENDED] as Array<keyof XXError>).forEach(f => {
					expect(normalized_err[f], `sub field "${f}"`).to.deep.equal(xerr[f])
				})
				/*console.log({
					original_proto: Object.getPrototypeOf(xerr),
					normalized_proto: Object.getPrototypeOf(normalized_err),
				})*/
				expect(Object.getPrototypeOf(normalized_err), 'proto').to.equal(Object.getPrototypeOf(xerr))
			})

			it('should work on anything -- undefined', () => {
				const normalized_err = normalizeError(undefined as any, {alwaysRecreate: true})
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error: "undefined" thrown!]')
			})

			it('should work on anything -- null', () => {
				const normalized_err = normalizeError(null as any, {alwaysRecreate: true})
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error: "null" thrown!]')
			})

			it('should work on anything -- number', () => {
				const normalized_err = normalizeError(-42 as any, {alwaysRecreate: true})
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error of type "number" thrown!]')
			})

			it('should work on anything -- string', () => {
				const normalized_err = normalizeError('foo' as any)
				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[non-error of type "string" thrown: "foo"!]')
			})

			it('should work on anything -- empty object', () => {
				const badly_shaped = {} as any

				const normalized_err = normalizeError(badly_shaped)
				expect(normalized_err).not.to.equal(badly_shaped)

				expect(normalized_err instanceof Error).to.be.true
				//console.log(normalized_err)

				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('[object with no error shape thrown!]')
			})

			it('should work on anything -- vague object', () => {
				const badly_shaped = {message: 'foo!'} as any

				const normalized_err = normalizeError(badly_shaped)
				expect(normalized_err).not.to.equal(badly_shaped)

				expect(normalized_err instanceof Error).to.be.true
				expect(Object.getPrototypeOf(normalized_err)).to.equal(Object.getPrototypeOf(_demo_error))
				expect(normalized_err.message).to.equal('foo!')
			})
		})
	})
})
