import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import {
	get_unequipped_item_count,
	get_equipped_item_count,
	get_item,
} from '@oh-my-rpg/state-inventory'

import {
	Currency,
	get_currency_amount,
} from '@oh-my-rpg/state-wallet'

import { LIB } from '../consts'
import { create } from '..'
import {
	find_element,
} from './others'


describe(`${LIB} - selectors / others`, function() {
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
})
