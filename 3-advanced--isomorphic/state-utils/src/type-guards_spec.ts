import { expect } from 'chai'

import { LIB } from './consts'

import {
	is_UState,
	is_TState,
	is_RootState,
	is_bundled_UT,
} from './type-guards'

import {
	DEMO_ROOT_STATE,
} from './_test_helpers'


describe(`${LIB} - type guards`, function() {

	describe('is_UState', function() {
		it('should work on non matching: FALSE', () => {
			expect(is_UState(undefined)).to.be.false
			expect(is_UState(null)).to.be.false
			expect(is_UState(0)).to.be.false
			expect(is_UState(new Error('Test!'))).to.be.false
			expect(is_UState(DEMO_ROOT_STATE)).to.be.false
			expect(is_UState(DEMO_ROOT_STATE.t_state)).to.be.false
		})

		it('should work on matching: TRUE', () => {
			expect(is_UState(DEMO_ROOT_STATE.u_state)).to.be.true
		})
	})

	describe('is_TState', function() {
		it('should work on non matching: FALSE', () => {
			expect(is_TState(undefined)).to.be.false
			expect(is_TState(null)).to.be.false
			expect(is_TState(0)).to.be.false
			expect(is_TState(new Error('Test!'))).to.be.false
			expect(is_TState(DEMO_ROOT_STATE)).to.be.false
			expect(is_TState(DEMO_ROOT_STATE.u_state)).to.be.false
		})

		it('should work on matching: TRUE', () => {
			expect(is_TState(DEMO_ROOT_STATE.t_state)).to.be.true
		})
	})

	describe('is_RootState', function() {
		it('should work on non matching: FALSE', () => {
			expect(is_RootState(undefined)).to.be.false
			expect(is_RootState(null)).to.be.false
			expect(is_RootState(0)).to.be.false
			expect(is_RootState(new Error('Test!'))).to.be.false
			expect(is_RootState(DEMO_ROOT_STATE.t_state)).to.be.false
			expect(is_RootState(DEMO_ROOT_STATE.u_state)).to.be.false
		})

		it('should work on matching: TRUE', () => {
			expect(is_RootState(DEMO_ROOT_STATE)).to.be.true
		})
	})

	describe('is_bundled_UT()', function() {
		it('should work on non matching: FALSE', () => {
			expect(is_bundled_UT(undefined)).to.be.false
			expect(is_bundled_UT(null)).to.be.false
			expect(is_bundled_UT(0)).to.be.false
			expect(is_bundled_UT(new Error('Test!'))).to.be.false
			expect(is_bundled_UT(DEMO_ROOT_STATE.t_state)).to.be.false
			expect(is_bundled_UT(DEMO_ROOT_STATE.u_state)).to.be.false
		})

		it('should work on matching: TRUE', () => {
			expect(is_bundled_UT([ DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state ])).to.be.true
		})
	})
})
