import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import {
	get_unequipped_item_count,
	get_equipped_item_count,
} from '@oh-my-rpg/state-inventory'
import { DEFAULT_SEED } from '@oh-my-rpg/state-prng'

import { LIB, SCHEMA_VERSION } from '../../consts'
import { create, reseed } from '.'

describe(`${LIB} - reducer`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('🆕  initial state', function() {

		it('should be correct', function() {
			const { u_state, t_state } = create()

			expect(u_state.uuid).to.be.a('string')
			expect(u_state.creation_date).to.be.a('string')

			// check presence of sub-states
			expect(u_state, 'avatar').to.have.property('avatar')
			expect(u_state, 'inventory').to.have.property('inventory')
			expect(u_state, 'wallet').to.have.property('wallet')
			expect(u_state, 'prng').to.have.property('prng')
			expect(u_state, 'energy').to.have.property('energy')
			expect(u_state, 'engagement').to.have.property('engagement')
			expect(u_state, 'codes').to.have.property('codes')
			expect(u_state, 'codes').to.have.property('progress')
			expect(Object.keys(u_state), 'quick key count check U').to.have.lengthOf(13) // because this test should be updated if that changes

			expect(t_state, 'energy').to.have.property('energy')
			expect(Object.keys(t_state), 'quick key count check T').to.have.lengthOf(2) // because this test should be updated if that changes

			// init of custom values
			expect(u_state).to.have.property('schema_version', SCHEMA_VERSION)
			expect(u_state).to.have.property('revision', 0)
			expect(u_state.last_adventure).to.be.null

			// check our 2 predefined items are present and equipped
			expect(get_equipped_item_count(u_state.inventory), 'equipped').to.equal(2)
			expect(get_unequipped_item_count(u_state.inventory), 'unequipped').to.equal(0)
		})
	})

	describe('re-seeding', function() {

		it('should work', function() {
			const { u_state } = reseed(create())

			expect(u_state.prng.seed).to.be.a('number')
			expect(u_state.prng.seed).not.to.equal(DEFAULT_SEED)
		})
	})
})
