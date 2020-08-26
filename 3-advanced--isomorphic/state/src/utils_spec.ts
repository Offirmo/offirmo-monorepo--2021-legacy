import { expect } from 'chai'
import deep_freeze from 'deep-freeze-strict'

import { LIB } from './consts'

import {
	DEMO_BASE_STATE_WITH_SUBS,
	DEMO_ROOT_STATE,
} from './_test_helpers'

import {
	propagate_child_revision_increment_upward,
	are_ustate_revision_requirements_met,
} from './utils'


describe(`${LIB} - utils`, function() {

	describe('propagate_child_revision_increment_upward()', function() {

		context('on a base state with sub states', function() {
			const previous = DEMO_BASE_STATE_WITH_SUBS

			it('should no touch the object if no change at all', () => {
				const new_state = propagate_child_revision_increment_upward(previous, previous)
				expect(new_state).to.equal(previous)
			})

			it('should not touch the object if no sub-increments', () => {
				const current_base = deep_freeze<typeof previous>({
					...previous,
					subC: {
						...previous.subC,
						fizz: 'hello',
					},
				})
				const new_state = propagate_child_revision_increment_upward(previous, current_base)
				expect(new_state).to.equal(current_base)
			})

			it('should increment if sub-increments', () => {
				const current_base = deep_freeze<typeof previous>({
					...previous,
					subC: {
						...previous.subC,
						revision: 46,
						fizz: 'hello',
					},
				})
				const expected = deep_freeze<typeof previous>({
					...current_base,
					revision: 104,
				})
				const new_state = propagate_child_revision_increment_upward(previous, current_base)
				expect(new_state).not.to.equal(current_base)
				expect(new_state).to.deep.equal(expected)
			})

			it('should throw if already incremented', () => {
				const current_base = deep_freeze<typeof previous>({
					...previous,
					revision: 104, // bad
					subC: {
						...previous.subC,
						revision: 46,
						fizz: 'hello',
					},
				})
				expect(() => propagate_child_revision_increment_upward(previous, current_base))
					.to.throw('already incremented')
			})
		})

		context('on a root state', function() {
			const previous = DEMO_ROOT_STATE

			it('should no touch the object if no change at all', () => {
				const new_state = propagate_child_revision_increment_upward(previous, previous)
				expect(new_state).to.equal(previous)
			})

			it('should not touch the object if no sub-increments', () => {
				const current_root = deep_freeze<typeof previous>({
					...previous,
					u_state: {
						...previous.u_state,
						subC: {
							...previous.u_state.subC,
							fizz: 'hello',
						},
					},
				})
				const new_state = propagate_child_revision_increment_upward(previous, current_root)
				expect(new_state).to.equal(current_root)
			})

			it('should increment if sub-increments', () => {
				const current_root = deep_freeze<typeof previous>({
					...previous,
					u_state: {
						...previous.u_state,
						subC: {
							...previous.u_state.subC,
							revision: 46,
							fizz: 'hello',
						},
					},
				})
				const expected = deep_freeze<typeof previous>({
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
				const current_root = deep_freeze<typeof previous>({
					...previous,
					u_state: {
						...previous.u_state,
						revision: 104, // bad
						subC: {
							...previous.u_state.subC,
							revision: 46,
							fizz: 'hello',
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
			const result = are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {})
			expect(result).to.be.true
		})

		it('should return true if all requirements met', () => {
			const result = are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
				subA: 333,
				subC: 24,
			})
			expect(result).to.be.true
		})

		it('should return false if some requirements not met', () => {
			expect(are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
				subA: 999999,
				subC: 24,
			})).to.be.false
			expect(are_ustate_revision_requirements_met(DEMO_ROOT_STATE, {
				subA: 333,
				subC: 999999,
			})).to.be.false
		})

		it('should throw if non-matched requirement', () => {
			expect(() => are_ustate_revision_requirements_met(DEMO_ROOT_STATE, { 'subB': 42 }))
				.to.throw('sub state not found')
		})
	})
})
