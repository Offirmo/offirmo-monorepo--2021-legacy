import { expect } from 'chai'

import { LIB } from './consts'

import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from './types'

import {
	is_UState,
	is_TState,
	is_RootState,
} from './type-guards'

import {
	ROOT_EXAMPLE,
} from './_test_helpers'


describe(`${LIB} - type guards`, function() {

	describe('is_UState', function() {
		it('should work on non matching', () => {
			expect(is_UState(undefined)).to.be.false
			expect(is_UState(null)).to.be.false
			expect(is_UState(0)).to.be.false
			expect(is_UState(new Error('Test!'))).to.be.false
			expect(is_UState(ROOT_EXAMPLE)).to.be.false
			expect(is_UState(ROOT_EXAMPLE.t_state)).to.be.false
		})

		it('should work on matching', () => {
			expect(is_UState(ROOT_EXAMPLE.u_state)).to.be.true
		})
	})

	describe('is_TState', function() {
		it('should work on non matching', () => {
			expect(is_TState(undefined)).to.be.false
			expect(is_TState(null)).to.be.false
			expect(is_TState(0)).to.be.false
			expect(is_TState(new Error('Test!'))).to.be.false
			expect(is_TState(ROOT_EXAMPLE)).to.be.false
			expect(is_TState(ROOT_EXAMPLE.u_state)).to.be.false
		})

		it('should work on matching', () => {
			expect(is_TState(ROOT_EXAMPLE.t_state)).to.be.true
		})
	})

	describe('is_RootState', function() {
		it('should work on non matching', () => {
			expect(is_RootState(undefined)).to.be.false
			expect(is_RootState(null)).to.be.false
			expect(is_RootState(0)).to.be.false
			expect(is_RootState(new Error('Test!'))).to.be.false
			expect(is_RootState(ROOT_EXAMPLE.t_state)).to.be.false
			expect(is_RootState(ROOT_EXAMPLE.u_state)).to.be.false
		})

		it('should work on matching', () => {
			expect(is_RootState(ROOT_EXAMPLE)).to.be.true
		})
	})
})
