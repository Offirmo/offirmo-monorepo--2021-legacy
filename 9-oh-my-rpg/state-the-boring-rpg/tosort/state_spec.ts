import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import { ALL_ADVENTURE_ARCHETYPES } from '@oh-my-rpg/logic-adventures'
import {
	get_unequipped_item_count,
	get_equipped_item_count,
	get_item,
} from '@oh-my-rpg/state-inventory'
import * as EnergyState from '@oh-my-rpg/state-energy'

import {
	Currency,
	get_currency_amount,
} from '@oh-my-rpg/state-wallet'

import { SCHEMA_VERSION } from '../../consts'

import {
	create,
	play,
} from '..'

describe(`${LIB} - reducer`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('🆕  initial state', function() {

		it('should be correct', function() {
			const state = create()

			expect(state.uuid).to.be.a('string')
			expect(state.creation_date).to.be.a('string')

			// check presence of sub-states
			expect(state, 'avatar').to.have.property('avatar')
			expect(state, 'inventory').to.have.property('inventory')
			expect(state, 'wallet').to.have.property('wallet')
			expect(state, 'prng').to.have.property('prng')
			expect(state, 'energy').to.have.property('energy')
			expect(state, 'engagement').to.have.property('engagement')
			expect(state, 'codes').to.have.property('codes')
			expect(state, 'codes').to.have.property('progress')

			expect(Object.keys(state), 'quick key count check').to.have.lengthOf(13) // because this test should be updated if that changes

			// init of custom values
			expect(state).to.have.property('schema_version', SCHEMA_VERSION)
			expect(state).to.have.property('revision', 0)
			expect(state.last_adventure).to.be.null

			// check our 2 predefined items are present and equipped
			expect(get_equipped_item_count(state.inventory), 'equipped').to.equal(2)
			expect(get_unequipped_item_count(state.inventory), 'unequipped').to.equal(0)
		})
	})

	describe('👆🏾 user actions', function() {

		describe('inventory management', function() {

			it('should allow un-equiping an item') // not now, but useful for ex. for immediately buying a better item on the market

			it('should allow equiping an item, correctly swapping with an already equipped item')

			it('should allow selling an item')
		})
	})
})
