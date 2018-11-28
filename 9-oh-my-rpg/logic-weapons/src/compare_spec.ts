import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'
import { ItemQuality } from '@oh-my-rpg/definitions'

import { LIB } from './consts'
import {
	create,
	generate_random_demo_weapon,
	compare_weapons_by_strength,
	get_medium_damage,
} from '.'


describe(`${LIB} - compare`, function() {

	it('should sort properly by strength', () => {
		const rng: Engine = Random.engines.mt19937().seed(789)
		const items = [
			generate_random_demo_weapon(rng),
			generate_random_demo_weapon(rng),
			generate_random_demo_weapon(rng),
		].sort(compare_weapons_by_strength)
		const [ s1, s2, s3 ] = items.map(get_medium_damage)
		expect(s1).to.be.above(s2)
		expect(s2).to.be.above(s3)
	})

	context('when strength is equal', () => {

		it('should take into account the potential', () => {
			const rng: Engine = Random.engines.mt19937().seed(789)
			const items = [
				create(rng, {base_strength: 1, quality: ItemQuality.common, enhancement_level: 5}),
				create(rng, {base_strength: 1, quality: ItemQuality.common, enhancement_level: 4}),
			].sort(compare_weapons_by_strength)
			const [ s1, s2 ] = items.map(get_medium_damage)
			expect(s1).to.equal(s2)
			const [ w1, w2 ] = items
			expect(w1.enhancement_level).to.be.below(w2.enhancement_level)
		})

		// extremely rare cases, hard to compute, not even sure it's possible since quality impacts strength
		context('when potential is also equal', function () {

			it('should take into account the quality')

			context('when quality is also equal', function () {

				it('should fallback to uuid')
			})
		})
	})
})
