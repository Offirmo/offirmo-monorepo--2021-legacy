import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import { ALL_ADVENTURE_ARCHETYPES } from '@oh-my-rpg/logic-adventures'
import {
	get_unequipped_item_count,
	get_equipped_item_count,
} from '@oh-my-rpg/state-inventory'
import * as EnergyState from '@oh-my-rpg/state-energy'

import {
	Currency,
	get_currency_amount,
} from '@oh-my-rpg/state-wallet'

import { LIB } from '../../../consts'

import {
	get_available_energy,
} from '../../../selectors'

import {
	_loose_all_energy
} from '../internal'

import {
	create,
	play,
} from '..'

describe(`${LIB} - reducer`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('🤘🏽 play', function() {

		context('🚫  when NOT allowed (the cooldown has NOT passed / not enough energy)', function() {

			it('should generate a negative adventure', () => {
				let state = create()

				state = _loose_all_energy(state)

				state = play(state)
				expect(state.last_adventure).not.to.be.null
				expect(state.last_adventure!.good).to.be.false

				// again
				state = play(state)
				expect(state.last_adventure).not.to.be.null
				expect(state.last_adventure!.good).to.be.false
			})

			it('should not decrease user stats')

			it('should correctly increment counters', () => {
				let state = create()

				state = _loose_all_energy(state)

				state = play(state)

				expect(state).to.have.nested.property('progress.statistics.bad_play_count', 1)
				expect(state).to.have.nested.property('progress.statistics.bad_play_count_by_active_class.novice', 1)

				state = play(state)

				expect(state).to.have.nested.property('progress.statistics.bad_play_count', 2)
				expect(state).to.have.nested.property('progress.statistics.bad_play_count_by_active_class.novice', 2)
			})

			it('should punish a bit the user (ex. by increasing the cooldown)', () => {
				let state = create()

				state = _loose_all_energy(state)

				// force (for tests)
				state.energy[1].available_energy = { n: 8, d: 10 }

				state = play(state)
				expect(state.last_adventure).not.to.be.null
				expect(state.last_adventure!.good).to.be.false

				expect(get_available_energy(state)).to.equal(0) // was force depleted
			})
		})

		context('✅  when allowed (the cooldown has passed / enough energy)', function() {

			it('should sometime generate a story adventure', () => {
				const state = play(create())

				expect(state.last_adventure).not.to.be.null
				expect(state.last_adventure!.good).to.be.true
			})

			it('should correctly increment counters', () => {
				let state = play(create())

				expect(state).to.have.nested.property('progress.statistics.good_play_count', 1)
				expect(state).to.have.nested.property('progress.statistics.good_play_count_by_active_class.novice', 1)

				state = play(state)

				expect(state).to.have.nested.property('progress.statistics.good_play_count', 2)
				expect(state).to.have.nested.property('progress.statistics.good_play_count_by_active_class.novice', 2)
			})

			// hard to test
			it('should sometime generate a fight adventure')

			context('when the adventure is a story', function() {

				describe('the outcome', function() {

					it('should sometime be a coin gain', () => {
						let state = create()
						state = play(state, 'dying_man')

						// we got money
						expect(get_currency_amount(state.wallet, Currency.coin)).to.be.above(0)
					})

					it('should sometime be a token gain')
					it('should sometime be a stat gain')
					it('should sometime be an item gain', () => {
						let state = create()
						state = play(state, 'rare_goods_seller')

						// check our 2 predefined items are still present and equipped
						expect(get_equipped_item_count(state.inventory), 'equipped').to.equal(2)
						// a new item is present
						expect(get_unequipped_item_count(state.inventory), 'unequipped').to.equal(1)
						// it's a weapon !
						expect(state.inventory.unslotted[0]).to.have.property('slot', 'armor')
					})
					it('should sometime be an item improvement')
				})
			})

			context('when the adventure is a fight', function() {

				it('should generate a suitable enemy', () => {
					let state = create()
					state.avatar.attributes.level = 500

					for(let i = 0; i < 100; ++i) {
						state.energy[1].available_energy = { n: 7, d: 1 } // force replenish for tests
						state = play(state)
						if (state.last_adventure!.hid.startsWith('fight_'))
							break
					}

					//console.log(state.last_adventure)
					expect(state.last_adventure, 'fight adventure').to.exist
					expect(state.last_adventure!.encounter, 'encounter field').to.exist
					expect(state.last_adventure!.encounter!.level).to.be.within(400, 600)
				})
			})
		})
	})

	describe('adventures', function() {
		ALL_ADVENTURE_ARCHETYPES.forEach(({hid, good}) => {
			describe(`${good ? '✅' : '🚫'}  adventure "${hid}"`, function() {
				it('should be playable', () => {
					let state = create()

					if (!good)
						state = _loose_all_energy(state)

					state = play(state, hid)
				})
			})
		})
	})
})
