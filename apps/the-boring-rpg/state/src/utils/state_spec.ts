import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import { LIB } from '../consts'

import {
	BaseState,
	BaseRootState,
	propagate_child_revision_increment_upward,
} from './state'

describe(`${LIB} - utils - state`, function() {

	describe('propagate_child_revision_increment_upward()', function() {
		interface SubState1 extends BaseState {
			schema_version: 3,
			revision: number,
			foo: number
			bar: string
		}
		interface SubState2 extends BaseState {
			schema_version: 5,
			revision: number,
			fizz: number
			buzz: string
		}
		interface TestState extends BaseState {
			schema_version: 7,
			revision: number,

			sub1: SubState1
			sub2: SubState2
		}
		interface TestRootState extends BaseRootState {
			schema_version: 7,

			u_state: TestState
			t_state: {}
		}

		const previous_base: Readonly<TestState> = deepFreeze({
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

		const previous_root: Readonly<TestRootState> = deepFreeze({
			schema_version: 7,

			u_state: previous_base,
			t_state: {}
		}) as any

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

			it('should throw if sub-incremented too much', () => {
				const current_base = deepFreeze({
					...previous_base,
					sub1: {
						...previous_base.sub1,
						revision: 47, // bad
						foo: 43,
					}
				})
				expect(() => propagate_child_revision_increment_upward(previous_base, current_base))
					.to.throw('Invalid increment')
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

			it('should throw if sub-incremented too much', () => {
				const current_root = deepFreeze({
					...previous_root,
					u_state: {
						...previous_root.u_state,
						sub1: {
							...previous_root.u_state.sub1,
							revision: 47, // bad
							foo: 43,
						},
					},
				})
				expect(() => propagate_child_revision_increment_upward(previous_root, current_root))
					.to.throw('Invalid increment')
			})
		})

	})
})
