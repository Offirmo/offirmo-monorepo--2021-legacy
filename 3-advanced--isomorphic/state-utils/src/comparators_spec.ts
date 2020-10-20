import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'

import { LIB } from './consts'

import {
	DEMO_BASE_STATE,
	DEMO_TSTATE,
	DEMO_ROOT_STATE,
} from './_test_helpers'

import {
	SemanticDifference,
	s_max,
	get_semantic_difference,
	compare,
} from './comparators'
import {
	BaseRootState,
	BaseState,
	BaseTState,
	BundledStates,
} from './types'


describe(`${LIB} - comparators`, function() {

	describe('s_max()', function() {
		it('should work', () => {
			Enum.values(SemanticDifference).forEach((a, ia) => {
				Enum.values(SemanticDifference).forEach((b, ib) => {
					const max = s_max(a, b)
					if (ia >= ib)
						expect(max, `Max(${a}, ${b})`).to.equal(a)
					else
						expect(max, `Max(${a}, ${b})`).to.equal(b)
				})
			})
		})
	})

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

			context('when no previous', function() {

				it('should return minor', () => {
					expect(get_semantic_difference(DEMO_BASE_STATE)).to.equal(SemanticDifference.minor)
					expect(get_semantic_difference(DEMO_BASE_STATE, null)).to.equal(SemanticDifference.minor)
				})
			})

			context('when the previous has no schema', function() {

				it('should return major', () => {
					expect(get_semantic_difference(DEMO_BASE_STATE, {foo: 42})).to.equal(SemanticDifference.major)
				})
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

			it('should return time when no other change but timestamp (tstate)', () => {
				expect(get_semantic_difference(DEMO_TSTATE, {
					...DEMO_TSTATE,
					timestamp_ms: DEMO_TSTATE.timestamp_ms - 1,
				})).to.equal(SemanticDifference.time)
			})

			it('should return none on equality -- same obj', () => {
				expect(get_semantic_difference(DEMO_BASE_STATE, DEMO_BASE_STATE)).to.equal(SemanticDifference.none)
			})
			it('should return none on equality -- different obj', () => {
				expect(get_semantic_difference(DEMO_BASE_STATE, {...DEMO_BASE_STATE})).to.equal(SemanticDifference.none)
				expect(get_semantic_difference(DEMO_TSTATE, {...DEMO_TSTATE})).to.equal(SemanticDifference.none)
			})

			it('should return none on equality -- init state (past bug)', () => {
				expect(get_semantic_difference({
					schema_version: 14,
					revision: 0,
				},{
					schema_version: 14,
					revision: 0,
				})).to.equal(SemanticDifference.none)
			})

			it('should throw on immutability problem', () => {
				expect(() => get_semantic_difference({
					schema_version: 14,
					revision: 3,
					timestamp_ms: 1234,
					foo: 42,
				},{
					schema_version: 14,
					revision: 3,
					timestamp_ms: 1234,
					foo: 33,
				})).to.throw('equal')
			})

			it('should throw on reversed order -- schema version', () => {
				expect(() => get_semantic_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					schema_version: 9999,
				})).to.throw('order')
			})

			it('should throw on reversed order -- revision', () => {
				expect(() => get_semantic_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					revision: 9999,
				})).to.throw('order')
			})

			it('should throw on reversed order -- time', () => {
				expect(() => get_semantic_difference(DEMO_TSTATE, {
					...DEMO_TSTATE,
					timestamp_ms: DEMO_TSTATE.timestamp_ms + 1,
				})).to.throw('order')
			})
		})

		context('on advanced Offirmo’s Root state', function() {

			it('should return minor when no previous', () => {
				expect(get_semantic_difference(DEMO_ROOT_STATE)).to.equal(SemanticDifference.minor)
				expect(get_semantic_difference(DEMO_ROOT_STATE, null)).to.equal(SemanticDifference.minor)
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

	describe('compare()', function() {

		function gen_base(d: SemanticDifference): BaseState {
			return {
				schema_version: d === SemanticDifference.major ? 3 : 2,
				revision: d === SemanticDifference.minor ? 33 : 22,
			}
		}
		function gen_tstate(d: SemanticDifference): BaseTState {
			return {
				...gen_base(d),
				timestamp_ms: d === SemanticDifference.time ? 333 : 222,
			}
		}
		function gen_rootstate(d: SemanticDifference): BaseRootState {
			return {
				schema_version: d === SemanticDifference.major ? 3 : 2,
				u_state: gen_base(d),
				t_state: gen_tstate(d),
			}
		}
		function gen_aggregated(d: SemanticDifference): BundledStates<BaseState, BaseTState> {
			return [
				gen_base(d),
				gen_tstate(d),
			]
		}

		context('on BaseState', function() {
			it('should work', () => {
				Enum.values(SemanticDifference).filter(d => d !== SemanticDifference.time).forEach((a, ia) => {
					Enum.values(SemanticDifference).filter(d => d !== SemanticDifference.time).forEach((b, ib) => {
						const s__a = gen_base(a)
						const s__b = gen_base(b)
						//console.log({a,b, s__a, s__b})
						const comp = compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `compare(${a}, ${b})`).to.equal(0)
					})
				})
			})
		})

		context('on TState', function() {
			it('should work', () => {
				Enum.values(SemanticDifference).forEach((a, ia) => {
					Enum.values(SemanticDifference).forEach((b, ib) => {
						const s__a = gen_tstate(a)
						const s__b = gen_tstate(b)
						//console.log({a, b, s__a, s__b})
						const comp = compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `compare(${a}, ${b})`).to.equal(0)
					})
				})
			})
		})

		context('on aggregated state', function() {
			it('should work', () => {
				Enum.values(SemanticDifference).forEach((a, ia) => {
					Enum.values(SemanticDifference).forEach((b, ib) => {
						const s__a = gen_aggregated(a)
						const s__b = gen_aggregated(b)
						//console.log({a, b, s__a, s__b})
						const comp = compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `compare(${a}, ${b})`).to.equal(0)
					})
				})
			})
		})

		context('on RootState', function() {
			it('should work', () => {
				Enum.values(SemanticDifference).forEach((a, ia) => {
					Enum.values(SemanticDifference).forEach((b, ib) => {
						const s__a = gen_rootstate(a)
						const s__b = gen_rootstate(b)
						//console.log({a, b, s__a, s__b})
						const comp = compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `compare(${a}, ${b})`).to.equal(0)
					})
				})
			})
		})
	})
})
