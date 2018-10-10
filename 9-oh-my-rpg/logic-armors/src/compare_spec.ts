import { expect } from 'chai'

import {
	ItemQuality,
} from '@oh-my-rpg/definitions'
import { Random, Engine } from '@offirmo/random'

import {
	create,
	generate_random_demo_armor,
	get_medium_damage_reduction,
	compare_armors_by_strength,
} from '.'


describe('@oh-my-rpg/logic-armors - comparison', function() {

	it('should sort properly by strength', () => {
		const armors = [
			generate_random_demo_armor(),
			generate_random_demo_armor(),
			generate_random_demo_armor(),
		].sort(compare_armors_by_strength)
		const [ s1, s2, s3 ] = armors.map(get_medium_damage_reduction)
		expect(s1).to.be.above(s2)
		expect(s2).to.be.above(s3)
	})

	context('when strength is equal', () => {

		it('should take into account the potential', () => {
			const rng: Engine = Random.engines.mt19937().seed(789)
			const armors = [
				create(rng, {base_strength: 1, quality: ItemQuality.common, enhancement_level: 4}),
				create(rng, {base_strength: 1, quality: ItemQuality.common, enhancement_level: 3}),
				create(rng, {base_strength: 1, quality: ItemQuality.common, enhancement_level: 5}),
			].sort(compare_armors_by_strength)
			const [ s1, s2, s3 ] = armors.map(get_medium_damage_reduction)
			expect(s1).to.equal(s2)
			expect(s1).to.equal(s3)
			const [ a1, a2, a3 ] = armors
			expect(a1.enhancement_level).to.be.below(a2.enhancement_level)
			expect(a2.enhancement_level).to.be.below(a3.enhancement_level)
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
