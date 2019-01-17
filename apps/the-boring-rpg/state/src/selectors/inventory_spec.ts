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
import {create} from "../state/reducers";
import {appraise_item_value} from "./inventory";


describe(`${LIB} - selectors / inventory`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	// TODO

	describe('appraise_item_value() by uuid', function() {

		context('when the element refers to an item', function() {

			it('should find it and appraise its value', () => {
				const state = create()

				const armor = state.u_state.inventory.slotted.armor

				const price = appraise_item_value(state.u_state, armor!.uuid)

				expect(price).to.equal(5)
			})
		})

		context('when the uuid refers to nothing', function() {

			it('should throw', () => {
				const state = create()

				const attempt_appraise = () => void appraise_item_value(state.u_state, 'foo')

				expect(attempt_appraise).to.throw('No item')
			})
		})
	})
})
