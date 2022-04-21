import { expect } from 'chai'
import { LogDetails } from '@offirmo/practical-logger-types'

import { LIB } from './consts'
import { normalizeArguments } from './normalize-args'
import { XXError } from '@offirmo/error-utils'

describe(`${LIB} - normalize args`, () => {
	function getNormalizedMessage(...args: any[]): string {
		return normalizeArguments(arguments)[0]
	}
	function getNormalizedDetails(...args: any[]): LogDetails {
		return normalizeArguments(arguments)[1]
	}
	const err: XXError = new Error('err_msg!')
	err.statusCode = 1234
	err.details = {
		hello: 42,
	}

	describe('normalization of arg[0] = message', () => {

		context('on nominal calls', () => {
			it('should work', () => {
				expect(getNormalizedMessage('foo'), 'n1').to.equal('foo')
				expect(getNormalizedMessage('foo', {bar: 42}), 'n2').to.equal('foo')

				expect(getNormalizedMessage('problem', {err}), 'e1').to.equal('problem')
				expect(getNormalizedMessage(undefined, {err}), 'e2').to.equal('err_msg!')
				expect(getNormalizedMessage('problem', {err, bar: 42}), 'e3').to.equal('problem')
			})
		})

		context('on tolerated calls', () => {
			it('should work', () => {
				expect(getNormalizedMessage(err), 'only direct error').to.equal('err_msg!')
				expect(getNormalizedMessage('problem', err), 'direct error as details').to.equal('problem')
				expect(getNormalizedMessage({bar: 42}), 'direct details').to.equal('(no message)')
				expect(getNormalizedMessage({bar: 42, message: 'hello'}), 'direct details + integrated message').to.equal('hello')
			})
		})

		context('on bad calls', () => {
			it('should work', () => {
				expect(
					getNormalizedMessage()
					, '<- none',
				).to.equal('(no message)')
				expect(
					getNormalizedMessage('hello', 'world!'),
					'<- 2 str args',
				).to.equal('hello world!')
				expect(
					getNormalizedMessage('hello', 'world!', {err, bar: 42}, 42),
					'<- many args',
				).to.equal('hello world! 42')
				expect(
					getNormalizedMessage({bar: 42}, {baz: 33}),
					'<- double details',
				).to.deep.equal('(no message)')
				expect(
					getNormalizedMessage({bar: 42}, { baz: 33 }, err),
					'<- error anywhere - 1',
				).to.deep.equal('err_msg!')
				expect(
					getNormalizedMessage({bar: 42}, { baz: 33 }, { err }),
					'<- error anywhere - 2',
				).to.deep.equal('err_msg!')
			})
		})
	})

	describe('normalization of arg[1] = details', () => {

		context('on nominal calls', () => {
			it('should work', () => {
				expect(getNormalizedDetails('foo'), 'n1').to.deep.equal({})
				expect(getNormalizedDetails('foo', {bar: 42}), 'n2').to.deep.equal({bar: 42})

				expect(getNormalizedDetails('problem', {err}), 'e1').to.deep.equal({err})
				expect(getNormalizedDetails(undefined, {err}), 'e2').to.deep.equal({err})
				expect(getNormalizedDetails('problem', {err, bar: 42}), 'e3').to.deep.equal({err, bar: 42})
			})
		})

		context('on tolerated calls', () => {
			it('should work', () => {
				expect(getNormalizedDetails(err), 'only direct error').to.deep.equal({err})
				expect(getNormalizedDetails('problem', err), 'direct error as details').to.deep.equal({err})
				expect(getNormalizedDetails({bar: 42}), 'direct details').to.deep.equal({bar: 42})
				expect(getNormalizedDetails({bar: 42, message: 'hello'}), 'direct details + integrated message').to.deep.equal({bar: 42})
			})
		})

		context('on bad calls', () => {
			it('should work', () => {
				expect(
					getNormalizedDetails(),
					'<- none',
				).to.deep.equal({})
				expect(
					getNormalizedDetails('hello', 'world!')
					, '<- 2 str args',
				).to.deep.equal({})
				expect(
					getNormalizedDetails('hello', 'world!', 42, {err, bar: 42})
					, '<- many args',
				).to.deep.equal({
					bar: 42,
					err,
				})
				expect(
					getNormalizedDetails({bar: 42}, {baz: 33})
					, '<- double details',
				).to.deep.equal({
					bar: 42,
					baz: 33,
				})
				expect(
					getNormalizedDetails({bar: 42}, { baz: 33 }, err),
					'<- error anywhere - 1',
				).to.deep.equal({
					bar: 42,
					baz: 33,
					err,
				})
				expect(
					getNormalizedDetails({bar: 42}, { baz: 33 }, { err }),
					'<- error anywhere - 2',
				).to.deep.equal({
					bar: 42,
					baz: 33,
					err,
				})
			})
		})
	})
})
