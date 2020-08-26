import { expect } from 'chai'
import deep_freeze from 'deep-freeze-strict'

import { LIB } from './consts'

import {
	DEMO_BASE_STATE,
	DEMO_ROOT_STATE,
} from './_test_helpers'

import {
	SemanticDifference,
	get_semantic_difference,
} from './comparators'


describe(`${LIB} - comparators`, function() {

	describe('get_semantic_difference()', function() {

		context('on basic json', function() {
			const TEST_DATA = { foo: 42 }

			it('should return minor when no previous', () => {
				expect(get_semantic_difference(TEST_DATA)).to.equal(SemanticDifference.minor)
				expect(get_semantic_difference(TEST_DATA, null)).to.equal(SemanticDifference.minor)
			})

			it('should always return minor whatever the previous (not null)', () => {
				expect(get_semantic_difference(TEST_DATA, 5)).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(get_semantic_difference(TEST_DATA, TEST_DATA)).to.equal(SemanticDifference.none)
			})
		})

		context('on advanced Offirmo’s base state', function() {

			it('should return major when no previous', () => {
				expect(get_semantic_difference(DEMO_BASE_STATE)).to.equal(SemanticDifference.major)
				expect(get_semantic_difference(DEMO_BASE_STATE, null)).to.equal(SemanticDifference.major)
			})

			it('should return major when the previous has no schema', () => {
				expect(get_semantic_difference(DEMO_BASE_STATE, { foo: 42 })).to.equal(SemanticDifference.major)
			})

			it('should return major when the schema version changed', () => {
				expect(get_semantic_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					schema_version: 1,
				})).to.equal(SemanticDifference.major)
			})

			it('should return minor when no schema change but revision change', () => {
				expect(get_semantic_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					revision: 1,
				})).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(get_semantic_difference(DEMO_BASE_STATE, DEMO_BASE_STATE)).to.equal(SemanticDifference.none)
			})

			it('should throw on reversed order -- schema version', () => {
				expect(() => get_semantic_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					schema_version: 9999,
				})).to.throw()
			})

			it('should throw on reversed order -- revision', () => {
				expect(() => get_semantic_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					revision: 9999,
				})).to.throw()
			})
		})

		context('on advanced Offirmo’s Root state', function() {

			it('should return major when no previous', () => {
				expect(get_semantic_difference(DEMO_ROOT_STATE)).to.equal(SemanticDifference.major)
				expect(get_semantic_difference(DEMO_ROOT_STATE, null)).to.equal(SemanticDifference.major)
			})

			it('should return major when previous has no schema', () => {
				expect(get_semantic_difference(DEMO_ROOT_STATE, { foo: 42 })).to.equal(SemanticDifference.major)
			})

			it('should return major when the ROOT schema changed', () => {
				expect(get_semantic_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					schema_version: 1,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 1,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 1,
					},
				})).to.equal(SemanticDifference.major)
			})

			it('should throw when any U/T schemas is mismatching', () => {
				expect(() => get_semantic_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 1,
					}
				})).to.throw()

				expect(() => get_semantic_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 1,
					}
				})).to.throw()
			})

			it('should return minor when no schema change but revision change (SUB)', () => {
				expect(get_semantic_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						revision: 1,
					}
				})).to.equal(SemanticDifference.minor)

				expect(get_semantic_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						revision: 1,
					}
				})).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(get_semantic_difference(DEMO_ROOT_STATE, DEMO_ROOT_STATE)).to.equal(SemanticDifference.none)
			})

			it('should throw on reversed order -- schema version', () => {
				expect(() => get_semantic_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					schema_version: 9999,
				})).to.throw()
			})
		})
	})
})
