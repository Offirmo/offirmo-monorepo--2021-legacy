import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import { LIB } from './consts'

import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from './types'

import {
	BASE_EXAMPLE,
	ROOT_EXAMPLE,
} from './_test_helpers'

import {
	is_newer_schema_version,
	is_loosely_newer_schema_version,
} from './comparators'


describe(`${LIB} - comparators`, function() {

	describe('is_newer_schema_version()', function() {

		it('should return true if the previous has an older schema', () => {
			expect(is_newer_schema_version(ROOT_EXAMPLE, {
				...ROOT_EXAMPLE,
				schema_version: 1,
			} as any)).to.be.true
		})

		it('should return false if the previous has a newer or equal schema', () => {
			expect(is_newer_schema_version(ROOT_EXAMPLE, ROOT_EXAMPLE), 'equal').to.be.false
			expect(is_newer_schema_version(ROOT_EXAMPLE, {
				...ROOT_EXAMPLE,
				schema_version: 333,
			}), 'older').to.be.false
		})
	})

	describe('is_loosely_newer_schema_version()', function() {

		context('when no previous', function() {
			it('should return true', () => {
				expect(is_loosely_newer_schema_version(ROOT_EXAMPLE)).to.be.true
			})
		})

		context('when having a previous', function() {
			const TEST_DATA = { foo: 42 }

			context('when previous is not a valid state', function() {

				it('should return true if the previous is any not equal to current', () => {
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, undefined)).to.be.true
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, null)).to.be.true
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, 0)).to.be.true
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, new Error('Test!'))).to.be.true
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, TEST_DATA)).to.be.true
				})

				it('should return false if the previous === current', () => {
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, ROOT_EXAMPLE)).to.be.false
				})
			})

			context('when previous is a valid state', function() {

				it('should enforce current to be a valid state as well', () => {
					// @ts-expect-error
					expect(() => is_loosely_newer_schema_version(TEST_DATA, ROOT_EXAMPLE)).to.throw()
				})

				it('should return false if the previous is ===', () => {
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, ROOT_EXAMPLE), '===').to.be.false
				})

				it('should return true if the previous has an older or equal schema', () => {
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, {
						...ROOT_EXAMPLE,
						schema_version: 1,
					}), 'older').to.be.true
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, { ...ROOT_EXAMPLE }), 'equal').to.be.true
				})

				it('should throw if the previous has a newer schema', () => {
					expect(is_loosely_newer_schema_version(ROOT_EXAMPLE, {
						...ROOT_EXAMPLE,
						schema_version: 333,
					})).to.be.false
				})
			})
		})
	})
})
