import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import { LIB } from './consts'

import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from './types'

import {
	BASE_UEXAMPLE,
	ROOT_EXAMPLE,
} from './_test_helpers'

import {
	propagate_child_revision_increment_upward,
	are_ustate_revision_requirements_met,
} from './utils'


describe(`${LIB} - utils`, function() {

	describe('propagate_child_revision_increment_upward()', function() {

		context('on a base state', function() {
			const previous = BASE_UEXAMPLE

			it('should no touch the object if no change at all', () => {
				const new_state = propagate_child_revision_increment_upward(previous, previous)
				expect(new_state).to.equal(previous)
			})

			it('should not touch the object if no sub-increments', () => {
				const current_base = deepFreeze({
					...previous,
					sub1: {
						...previous.sub1,
						foo: 43,
					},
				})
				const new_state = propagate_child_revision_increment_upward(previous, current_base)
				expect(new_state).to.equal(current_base)
			})

			it('should increment if sub-increments', () => {
				const current_base = deepFreeze({
					...previous,
					sub1: {
						...previous.sub1,
						revision: 46,
						foo: 43,
					},
				})
				const expected = deepFreeze({
					...current_base,
					revision: 104,
				})
				const new_state = propagate_child_revision_increment_upward(previous, current_base)
				expect(new_state).not.to.equal(current_base)
				expect(new_state).to.deep.equal(expected)
			})

			it('should throw if already incremented', () => {
				const current_base = deepFreeze({
					...previous,
					revision: 104, // bad
					sub1: {
						...previous.sub1,
						revision: 46,
						foo: 43,
					},
				})
				expect(() => propagate_child_revision_increment_upward(previous, current_base))
					.to.throw('already incremented')
			})
		})

		context('on a root state', function() {
			const previous = ROOT_EXAMPLE

			it('should no touch the object if no change at all', () => {
				const new_state = propagate_child_revision_increment_upward(previous, previous)
				expect(new_state).to.equal(previous)
			})

			it('should not touch the object if no sub-increments', () => {
				const current_root = deepFreeze({
					...previous,
					u_state: {
						...previous.u_state,
						sub1: {
							...previous.u_state.sub1,
							foo: 43,
						},
					},
				})
				const new_state = propagate_child_revision_increment_upward(previous, current_root)
				expect(new_state).to.equal(current_root)
			})

			it('should increment if sub-increments', () => {
				const current_root = deepFreeze({
					...previous,
					u_state: {
						...previous.u_state,
						sub1: {
							...previous.u_state.sub1,
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
				const new_state = propagate_child_revision_increment_upward(previous, current_root)
				expect(new_state).not.to.equal(current_root)
				expect(new_state).to.deep.equal(expected)
			})

			it('should throw if already incremented', () => {
				const current_root = deepFreeze({
					...previous,
					u_state: {
						...previous.u_state,
						revision: 104, // bad
						sub1: {
							...previous.u_state.sub1,
							revision: 46,
							foo: 43,
						},
					},
				})
				expect(() => propagate_child_revision_increment_upward(previous, current_root))
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
