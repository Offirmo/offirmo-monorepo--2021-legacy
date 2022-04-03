import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'

import { LIB } from './consts'

import {
	DEMO_BASE_STATE,
	DEMO_TSTATE,
	DEMO_ROOT_STATE,
} from './_test_helpers'

import {
	get_json_difference,
	SemanticDifference,
	s_max,
	UNCLEAR_get_difference,
	UNCLEAR_compare,
} from './comparators'
import {
	BaseRootState,
	BaseState,
	BaseTState,
	UTBundle,
} from './types'


describe(`${LIB} - comparators`, function() {

	describe('get_json_difference()', function() {

		it('should work', () => {
			const nodiff = get_json_difference({
					foo: 33,
				},
				{
					foo: 33,
				})
			expect(nodiff, 'no diff').to.deep.equal(undefined)

			const diff = get_json_difference({
					foo: 33,
					bar:42,
				},
				{
					foo: 34,
					baz: 42,
				})
			//console.log(diff)
			expect(diff).to.deep.equal({
				foo: [ 33, 34 ],
				bar: [ 42, 0, 0 ],
				baz: [ 42 ],
			})
		})
	})

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

	describe('UNCLEAR_get_difference()', function() {

		context('on basic json', function() {
			const TEST_DATA = { foo: 42 }

			it('should return minor when no previous', () => {
				expect(UNCLEAR_get_difference(TEST_DATA), 'undef').to.equal(SemanticDifference.minor)
				expect(UNCLEAR_get_difference(TEST_DATA, null), 'null').to.equal(SemanticDifference.minor)
			})

			it('should always return minor whatever the previous (not null)', () => {
				expect(UNCLEAR_get_difference(TEST_DATA, 5)).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(UNCLEAR_get_difference(TEST_DATA, TEST_DATA)).to.equal(SemanticDifference.none)
			})
		})

		context('on advanced Offirmo’s base state', function() {

			context('when no previous', function() {

				it('should return minor', () => {
					expect(UNCLEAR_get_difference(DEMO_BASE_STATE)).to.equal(SemanticDifference.minor)
					expect(UNCLEAR_get_difference(DEMO_BASE_STATE, null)).to.equal(SemanticDifference.minor)
				})
			})

			context('when the previous has no schema', function() {

				it('should return major', () => {
					expect(UNCLEAR_get_difference(DEMO_BASE_STATE, {foo: 42})).to.equal(SemanticDifference.major)
				})
			})

			it('should return major when the schema version changed', () => {
				expect(UNCLEAR_get_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					schema_version: 1,
				})).to.equal(SemanticDifference.major)
			})

			it('should return minor when no schema change but revision change', () => {
				expect(UNCLEAR_get_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					revision: 1,
				})).to.equal(SemanticDifference.minor)
			})

			it('should return minor when no revision change but last involvement difference (fork, revisions are in fact not referring to the same history)', () => {
				expect(UNCLEAR_get_difference(
					DEMO_ROOT_STATE,
					{
						...DEMO_ROOT_STATE,
						last_user_investment_tms: DEMO_ROOT_STATE.last_user_investment_tms - 1,
					})).to.equal(SemanticDifference.minor)
			})

			it('should return time when no other change but timestamp (tstate)', () => {
				expect(UNCLEAR_get_difference(DEMO_TSTATE, {
					...DEMO_TSTATE,
					timestamp_ms: DEMO_TSTATE.timestamp_ms - 1,
				})).to.equal(SemanticDifference.time)
			})

			it('should return none on equality -- same obj', () => {
				expect(UNCLEAR_get_difference(DEMO_BASE_STATE, DEMO_BASE_STATE)).to.equal(SemanticDifference.none)
			})
			it('should return none on equality -- different obj', () => {
				expect(UNCLEAR_get_difference(DEMO_BASE_STATE, {...DEMO_BASE_STATE})).to.equal(SemanticDifference.none)
				expect(UNCLEAR_get_difference(DEMO_TSTATE, {...DEMO_TSTATE})).to.equal(SemanticDifference.none)
			})

			it('should return none on equality -- init state (past bug)', () => {
				expect(UNCLEAR_get_difference({
					schema_version: 14,
					revision: 0,
				},{
					schema_version: 14,
					revision: 0,
				})).to.equal(SemanticDifference.none)
			})

			/*it('should throw on immutability problem', () => {
				expect(() => UNCLEAR_get_difference({
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
				expect(() => UNCLEAR_get_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					schema_version: 9999,
				})).to.throw('order')
			})

			it('should throw on reversed order -- revision', () => {
				expect(() => UNCLEAR_get_difference(DEMO_BASE_STATE, {
					...DEMO_BASE_STATE,
					revision: 9999,
				})).to.throw('order')
			})

			it('should throw on reversed order -- time', () => {
				expect(() => UNCLEAR_get_difference(DEMO_TSTATE, {
					...DEMO_TSTATE,
					timestamp_ms: DEMO_TSTATE.timestamp_ms + 1,
				})).to.throw('order')
			})*/
		})

		context('on advanced Offirmo’s Root state', function() {

			it('should return minor when no previous', () => {
				expect(UNCLEAR_get_difference(DEMO_ROOT_STATE)).to.equal(SemanticDifference.minor)
				expect(UNCLEAR_get_difference(DEMO_ROOT_STATE, null)).to.equal(SemanticDifference.minor)
			})

			it('should return major when previous has no schema', () => {
				expect(UNCLEAR_get_difference(DEMO_ROOT_STATE, { foo: 42 })).to.equal(SemanticDifference.major)
			})

			it('should return major when the ROOT schema changed', () => {
				expect(UNCLEAR_get_difference(DEMO_ROOT_STATE, {
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
				expect(() => UNCLEAR_get_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 1,
					}
				})).to.throw()

				expect(() => UNCLEAR_get_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 1,
					}
				})).to.throw()
			})

			it('should return minor when no schema change but revision change (SUB)', () => {
				expect(UNCLEAR_get_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						revision: 1,
					}
				})).to.equal(SemanticDifference.minor)

				expect(UNCLEAR_get_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						revision: 1,
					}
				})).to.equal(SemanticDifference.minor)
			})

			it('should return none on equality', () => {
				expect(UNCLEAR_get_difference(DEMO_ROOT_STATE, DEMO_ROOT_STATE)).to.equal(SemanticDifference.none)
			})

			/*it('should throw on reversed order -- schema version', () => {
				expect(() => UNCLEAR_get_difference(DEMO_ROOT_STATE, {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 9999,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 9999,
					},
				})).to.throw()
			})*/
		})
	})

	describe('UNCLEAR_compare()', function() {

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
				ⵙapp_id: 'unit-tests',
				last_user_investment_tms: d === SemanticDifference.time ? 333 : 222,
				u_state: gen_base(d),
				t_state: gen_tstate(d),
			}
		}
		function gen_aggregated(d: SemanticDifference): UTBundle<BaseState, BaseTState> {
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
						const comp = UNCLEAR_compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.equal(0)
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
						const comp = UNCLEAR_compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.equal(0)
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
						const comp = UNCLEAR_compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.equal(0)
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
						const comp = UNCLEAR_compare(s__a, s__b)

						if (ia > ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.above(0)
						else if (ia < ib)
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.be.below(0)
						else
							expect(comp, `UNCLEAR_compare(${a}, ${b})`).to.equal(0)
					})
				})
			})
		})
	})
})
