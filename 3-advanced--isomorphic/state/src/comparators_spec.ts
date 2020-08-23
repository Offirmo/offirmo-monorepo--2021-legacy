import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import { LIB } from './consts'

import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from './types'

import {
	TestRootState,
	TestRootUState,
	BASE_UEXAMPLE,
	ROOT_EXAMPLE,
} from './_test_helpers'

import {
	//is_newer_schema_version,
	//is_loosely_newer_schema_version,
	SemanticDifference,
	get_semantic_difference,
} from './comparators'


describe(`${LIB} - comparators`, function() {

	describe('get_semantic_difference()', function() {

		context('on basic json', function() {
			const TEST_DATA = { foo: 42 }

			it('should return minor when no previous', () => {
				expect(get_semantic_difference(TEST_DATA)).to.equal(SemanticDifference.minor)
			})

			it('should always return minor when different previous', () => {
				expect(get_semantic_difference(TEST_DATA, 5)).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(get_semantic_difference(TEST_DATA, TEST_DATA)).to.equal(SemanticDifference.none)
			})
		})

		context('on advanced Offirmo’s U state', function() {

			it('should return major when no previous', () => {
				expect(get_semantic_difference(BASE_UEXAMPLE)).to.equal(SemanticDifference.major)
			})

			it('should return major when previous has no schema', () => {
				expect(get_semantic_difference(ROOT_EXAMPLE, { foo: 42 })).to.equal(SemanticDifference.major)
			})

			it('should return major when the schema changed', () => {
				expect(get_semantic_difference(BASE_UEXAMPLE, {
					...BASE_UEXAMPLE,
					schema_version: 1,
				})).to.equal(SemanticDifference.major)
			})

			it('should return minor when no schema change but revision change', () => {
				expect(get_semantic_difference(BASE_UEXAMPLE, {
					...BASE_UEXAMPLE,
					revision: 1,
				})).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(get_semantic_difference(BASE_UEXAMPLE, BASE_UEXAMPLE)).to.equal(SemanticDifference.none)
			})

			it('should throw on reversed order -- schema version', () => {
				expect(() => get_semantic_difference(BASE_UEXAMPLE, {
					...BASE_UEXAMPLE,
					schema_version: 9999,
				})).to.throw()
			})

			it('should throw on reversed order -- revision', () => {
				expect(() => get_semantic_difference(BASE_UEXAMPLE, {
					...BASE_UEXAMPLE,
					revision: 9999,
				})).to.throw()
			})
		})

		context('on advanced Offirmo’s Root state', function() {

			it('should return major when no previous', () => {
				expect(get_semantic_difference(ROOT_EXAMPLE)).to.equal(SemanticDifference.major)
			})

			it('should return major when previous has no schema', () => {
				expect(get_semantic_difference(ROOT_EXAMPLE, { foo: 42 })).to.equal(SemanticDifference.major)
			})

			it('should return major when the ROOT schema changed', () => {
				expect(get_semantic_difference(ROOT_EXAMPLE, {
					...ROOT_EXAMPLE,
					schema_version: 1,
				})).to.equal(SemanticDifference.major)
			})

			it('should throw when any SUB schemas changed', () => {
				expect(() => get_semantic_difference(ROOT_EXAMPLE, {
					...ROOT_EXAMPLE,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						schema_version: 1,
					}
				})).to.throw()

				expect(() => get_semantic_difference(ROOT_EXAMPLE, {
					...ROOT_EXAMPLE,
					t_state: {
						...ROOT_EXAMPLE.t_state,
						schema_version: 1,
					}
				})).to.throw()
			})

			it('should return minor when no schema change but revision change (SUB)', () => {
				expect(get_semantic_difference(ROOT_EXAMPLE, {
					...ROOT_EXAMPLE,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 1,
					}
				})).to.equal(SemanticDifference.minor)

				expect(get_semantic_difference(ROOT_EXAMPLE, {
					...ROOT_EXAMPLE,
					t_state: {
						...ROOT_EXAMPLE.t_state,
						revision: 1,
					}
				})).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(get_semantic_difference(ROOT_EXAMPLE, ROOT_EXAMPLE)).to.equal(SemanticDifference.none)
			})

			it('should throw on reversed order -- schema version', () => {
				expect(() => get_semantic_difference(ROOT_EXAMPLE, {
					...ROOT_EXAMPLE,
					schema_version: 9999,
				})).to.throw()
			})
		})

		/*context('when having a previous', function() {
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
		})*/

	})
	/*
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
	*/
})
