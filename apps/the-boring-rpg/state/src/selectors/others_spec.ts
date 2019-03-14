import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'

import { LIB } from '../consts'
import { create } from '..'
import {
	find_element,
	get_available_classes,
} from './others'
import { CharacterClass } from '@oh-my-rpg/state-character'


describe(`${LIB} - selectors - others`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('find_element() by uuid', function() {

		context('when the element refers to an item', function() {

			it('should find it', () => {
				const { u_state } = create()

				const armor = u_state.inventory.slotted.armor

				const element = find_element(u_state, armor!.uuid)

				expect(element).to.deep.equal(armor)
			})
		})

		context('when the uuid refers to nothing', function() {

			it('should return null', () => {
				const { u_state } = create()

				const element = find_element(u_state, 'foo')

				expect(element).to.be.null
			})
		})
	})

	describe('get_available_classes()', function() {
		it('should return class strings', () => {
			const { u_state } = create()

			const klasses = get_available_classes(u_state)

			expect(klasses).to.be.an('array')
			klasses.forEach(k => {
				expect(k, k).to.be.a('string')
				expect(k.length, k).to.be.above(3)
			})
		})
		it('should filter out novice', () => {
			const { u_state } = create()

			const klasses = get_available_classes(u_state)

			expect(klasses.includes(CharacterClass.novice)).to.be.false
		})
	})
})
