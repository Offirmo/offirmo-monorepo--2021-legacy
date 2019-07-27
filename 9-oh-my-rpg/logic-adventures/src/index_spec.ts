import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'

import {
	CoinsGain,
	AdventureArchetype,
	ALL_ADVENTURE_ARCHETYPES,
	i18n_messages,

	pick_random_good_archetype,
	pick_random_bad_archetype,
	generate_random_coin_gain,
	ALL_BAD_ADVENTURE_ARCHETYPES,
	ALL_GOOD_ADVENTURE_ARCHETYPES,
	GOOD_ADVENTURE_ARCHETYPES_BY_TYPE,
} from '.'

describe('@oh-my-rpg/logic-adventures - logic', function () {

	describe('data', function () {

		it('should be sane', () => {
			if (ALL_ADVENTURE_ARCHETYPES.length < 100) {
				console.error(ALL_ADVENTURE_ARCHETYPES)
				throw new Error('Data sanity failure: ALL_ADVENTURE_ARCHETYPES')
			}
			if (ALL_BAD_ADVENTURE_ARCHETYPES.length < 6)
				throw new Error('Data sanity failure: ALL_BAD_ADVENTURE_ARCHETYPES')
			if (ALL_GOOD_ADVENTURE_ARCHETYPES.length < 100)
				throw new Error('Data sanity failure: ALL_GOOD_ADVENTURE_ARCHETYPES')
			if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight.length !== 6) {
				console.error(GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight)
				throw new Error('Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight')
			}
			if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story.length < 100)
				throw new Error('Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story')
		})
	})

	describe('bad adventures picker', function () {

		it('should provide bad adventure archetypes', () => {
			const rng: Engine = Random.engines.mt19937().seed(789)

			const baa1 = pick_random_bad_archetype(rng)
			expect(baa1.good).to.be.false

			const baa2 = pick_random_bad_archetype(rng)
			expect(baa2.good).to.be.false
		})
	})

	describe('good adventures picker', function () {

		it('should provide good adventure archetypes', () => {
			const rng: Engine = Random.engines.mt19937().seed(789)

			const baa1 = pick_random_good_archetype(rng)
			expect(baa1.good).to.be.true

			const baa2 = pick_random_good_archetype(rng)
			expect(baa2.good).to.be.true
		})
	})

	describe('coin gain picker', function () {

		it('should provide an amount proportional to the gain category', () => {
			const rng: Engine = Random.engines.mt19937().seed(789)
			const level = 1 / 1.1 // hack

			const cgN1 = generate_random_coin_gain(rng, CoinsGain.none, level)
			expect(cgN1).to.equal(0)
			const cgN2 = generate_random_coin_gain(rng, CoinsGain.none, level)
			expect(cgN2).to.equal(0)

			const cgS1 = generate_random_coin_gain(rng, CoinsGain.small, level)
			expect(cgS1).to.be.gte(1)
			expect(cgS1).to.be.lte(20)
			const cgS2 = generate_random_coin_gain(rng, CoinsGain.small, level)
			expect(cgS2).to.be.gte(1)
			expect(cgS2).to.be.lte(20)

			const cgM1 = generate_random_coin_gain(rng, CoinsGain.medium, level)
			expect(cgM1).to.be.gte(50)
			expect(cgM1).to.be.lte(100)
			const cgM2 = generate_random_coin_gain(rng, CoinsGain.medium, level)
			expect(cgM2).to.be.gte(50)
			expect(cgM2).to.be.lte(100)

			const cgB1 = generate_random_coin_gain(rng, CoinsGain.big, level)
			expect(cgB1).to.be.gte(500)
			expect(cgB1).to.be.lte(700)
			const cgB2 = generate_random_coin_gain(rng, CoinsGain.big, level)
			expect(cgB2).to.be.gte(500)
			expect(cgB2).to.be.lte(700)

			const cgH1 = generate_random_coin_gain(rng, CoinsGain.huge, level)
			expect(cgH1).to.be.gte(900)
			expect(cgH1).to.be.lte(2000)
			const cgH2 = generate_random_coin_gain(rng, CoinsGain.huge, level)
			expect(cgH2).to.be.gte(900)
			expect(cgH2).to.be.lte(2000)
		})

		it('should provide an amount proportional to the player level')

	})
})
