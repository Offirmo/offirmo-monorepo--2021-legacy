import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import { LIB } from './consts'

import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from './types'

import {
	propagate_child_revision_increment_upward,
	are_ustate_revision_requirements_met,
} from './utils'

describe(`${LIB} - utils - state`, function() {
	interface SubState1 extends BaseUState {
		schema_version: 3,
		revision: number,
		foo: number
		bar: string
	}
	interface SubState2 extends BaseUState {
		schema_version: 5,
		revision: number,
		fizz: number
		buzz: string
	}
	interface TestState extends BaseUState {
		schema_version: 7,
		revision: number,

		sub1: SubState1
		sub2: SubState2
	}
	interface TestRootState extends BaseRootState {
		schema_version: 7,

		u_state: TestState
		t_state: {
			schema_version: 0
			timestamp_ms: 0
		}
	}

	const BASE_EXAMPLE: Readonly<TestState> = deepFreeze({
		schema_version: 7,
		revision: 103,

		sub1: {
			schema_version: 3,
			revision: 45,
			foo: 42,
			bar: 'baz',
		},
		sub2: {
			schema_version: 5,
			revision: 67,
			fizz: 33,
			buzz: 'hello',
		}
	}) as any

	const ROOT_EXAMPLE: Readonly<TestRootState> = deepFreeze({
		schema_version: 7,

		u_state: BASE_EXAMPLE,
		t_state: {}
	}) as any


	describe('propagate_child_revision_increment_upward()', function() {
		const previous_base = BASE_EXAMPLE
		const previous_root = ROOT_EXAMPLE

		context('on a base state', function() {
			it('should no touch the object if no change at all', () => {
				const new_state = propagate_child_revision_increment_upward(previous_base, previous_base)
				expect(new_state).to.equal(previous_base)
			})

			it('should not touch the object if no sub-increments', () => {
				const current_base = deepFreeze({
					...previous_base,
					sub1: {
						...previous_base.sub1,
						foo: 43,
					}
				})
				const new_state = propagate_child_revision_increment_upward(previous_base, current_base)
				expect(new_state).to.equal(current_base)
			})

			it('should increment if sub-increments', () => {
				const current_base = deepFreeze({
					...previous_base,
					sub1: {
						...previous_base.sub1,
						revision: 46,
						foo: 43,
					}
				})
				const expected = deepFreeze({
					...current_base,
					revision: 104,
				})
				const new_state = propagate_child_revision_increment_upward(previous_base, current_base)
				expect(new_state).not.to.equal(current_base)
				expect(new_state).to.deep.equal(expected)
			})

			it('should throw if already incremented', () => {
				const current_base = deepFreeze({
					...previous_base,
					revision: 104, // bad
					sub1: {
						...previous_base.sub1,
						revision: 46,
						foo: 43,
					}
				})
				expect(() => propagate_child_revision_increment_upward(previous_base, current_base))
					.to.throw('already incremented')
			})
		})

		context('on a root state', function() {
			it('should no touch the object if no change at all', () => {
				const new_state = propagate_child_revision_increment_upward(previous_root, previous_root)
				expect(new_state).to.equal(previous_root)
			})

			it('should not touch the object if no sub-increments', () => {
				const current_root = deepFreeze({
					...previous_root,
					u_state: {
						...previous_root.u_state,
						sub1: {
							...previous_root.u_state.sub1,
							foo: 43,
						}
					}
				})
				const new_state = propagate_child_revision_increment_upward(previous_root, current_root)
				expect(new_state).to.equal(current_root)
			})

			it('should increment if sub-increments', () => {
				const current_root = deepFreeze({
					...previous_root,
					u_state: {
						...previous_root.u_state,
						sub1: {
							...previous_root.u_state.sub1,
							revision: 46,
							foo: 43,
						},
					},
				})
				const expected = deepFreeze({
					...current_root,
					u_state: {
						...current_root.u_state,
						revision: 104,
					},
				})
				const new_state = propagate_child_revision_increment_upward(previous_root, current_root)
				expect(new_state).not.to.equal(current_root)
				expect(new_state).to.deep.equal(expected)
			})

			it('should throw if already incremented', () => {
				const current_root = deepFreeze({
					...previous_root,
					u_state: {
						...previous_root.u_state,
						revision: 104, // bad
						sub1: {
							...previous_root.u_state.sub1,
							revision: 46,
							foo: 43,
						},
					},
				})
				expect(() => propagate_child_revision_increment_upward(previous_root, current_root))
					.to.throw('already incremented')
			})
		})

	})

	describe('are_ustate_revision_requirements_met()', function() {

		it('should return true if no requirements', () => {
			const result = are_ustate_revision_requirements_met(ROOT_EXAMPLE, {})
			expect(result).to.be.true
		})

		it('should return true if all requirements met', () => {
			const result = are_ustate_revision_requirements_met(ROOT_EXAMPLE, {
				sub1: 45,
				sub2: 67,
			})
			expect(result).to.be.true
		})

		it('should return false if some requirements not met', () => {
			expect(are_ustate_revision_requirements_met(ROOT_EXAMPLE, {
				sub1: 40,
				sub2: 67,
			})).to.be.false
			expect(are_ustate_revision_requirements_met(ROOT_EXAMPLE, {
				sub1: 45,
				sub2: 66,
			})).to.be.false
		})

		it('should throw if non-matched requirement', () => {
			expect(() => are_ustate_revision_requirements_met(ROOT_EXAMPLE, { 'not-existing': 42 }))
				.to.throw('sub state not found')
		})
	})
})
