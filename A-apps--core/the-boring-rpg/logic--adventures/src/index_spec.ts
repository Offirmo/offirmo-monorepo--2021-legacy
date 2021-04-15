import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'

import {
	CoinsGain,
	AdventureArchetype,
	ALL_ADVENTURE_ARCHETYPES,
	i18n_messages,

	pick_random_good_archetype,
	pick_random_bad_archetype,
	generate_random_coin_gain_or_loss,
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
			const player_level = 1 / 1.1 // hack

			const clS1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.lossꘌsmall, player_level, current_wallet_amount: 100000 })
			expect(clS1).to.be.gte(-20)
			expect(clS1).to.be.lte(-1)
			const clS2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.lossꘌsmall, player_level, current_wallet_amount: 100000 })
			expect(clS2).to.be.gte(-20)
			expect(clS2).to.be.lte(-1)

			const clO1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.lossꘌone, player_level, current_wallet_amount: 100000 })
			expect(clO1, 'clO1').to.equal(-1)
			const clO2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.lossꘌone, player_level, current_wallet_amount: 100000 })
			expect(clO2, 'clO2').to.equal(-1)

			const cgN1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.none, player_level, current_wallet_amount: 100000 })
			expect(cgN1, 'cgN1').to.equal(0)
			const cgN2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.none, player_level, current_wallet_amount: 100000 })
			expect(cgN2, 'cgN2').to.equal(0)

			const cgO1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌone, player_level, current_wallet_amount: 100000 })
			expect(cgO1, 'cgO1').to.equal(1)
			const cgO2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌone, player_level, current_wallet_amount: 100000 })
			expect(cgO2, 'cgO2').to.equal(1)

			const cgS1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌsmall, player_level, current_wallet_amount: 100000 })
			expect(cgS1).to.be.gte(1)
			expect(cgS1).to.be.lte(20)
			const cgS2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌsmall, player_level, current_wallet_amount: 100000 })
			expect(cgS2).to.be.gte(1)
			expect(cgS2).to.be.lte(20)

			const cgM1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌmedium, player_level, current_wallet_amount: 100000 })
			expect(cgM1).to.be.gte(50)
			expect(cgM1).to.be.lte(100)
			const cgM2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌmedium, player_level, current_wallet_amount: 100000 })
			expect(cgM2).to.be.gte(50)
			expect(cgM2).to.be.lte(100)

			const cgB1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌbig, player_level, current_wallet_amount: 100000 })
			expect(cgB1).to.be.gte(500)
			expect(cgB1).to.be.lte(700)
			const cgB2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌbig, player_level, current_wallet_amount: 100000 })
			expect(cgB2).to.be.gte(500)
			expect(cgB2).to.be.lte(700)

			const cgH1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌhuge, player_level, current_wallet_amount: 100000 })
			expect(cgH1).to.be.gte(900)
			expect(cgH1).to.be.lte(2000)
			const cgH2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.gainꘌhuge, player_level, current_wallet_amount: 100000 })
			expect(cgH2).to.be.gte(900)
			expect(cgH2).to.be.lte(2000)
		})

		it('should provide an amount proportional to the player level')

		it('should cap the loss to the current wallet amount', () => {
			const rng: Engine = Random.engines.mt19937().seed(789)
			const player_level = 1 / 1.1 // hack

			// -1  -6  -2
			const cgL1 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.lossꘌsmall, player_level, current_wallet_amount: 1 })
			expect(cgL1).to.equal(-1)
			const cgL2 = generate_random_coin_gain_or_loss(rng, { range: CoinsGain.lossꘌsmall, player_level, current_wallet_amount: 2 })
			expect(cgL2).to.equal(-2)
		})
	})

	describe('stats', function() {
		it('should help building the changelog', () => {
			const total = ALL_ADVENTURE_ARCHETYPES.length
			const previous_total = 187
			if (total !== previous_total)
				console.log(`- 🤩 feature: ${total - previous_total} new adventures (now totalling ${total}!)`)
		})
	})
})
