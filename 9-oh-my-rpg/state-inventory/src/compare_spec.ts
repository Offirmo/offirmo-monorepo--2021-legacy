import { expect } from 'chai'

import {
	generate_random_demo_armor
} from '@oh-my-rpg/logic-armors'
import {
	generate_random_demo_weapon
} from '@oh-my-rpg/logic-weapons'

import {
	Item,
	compare_items,
} from '.'

describe('sorting', function() {

	describe('comparison of different types', function() {

		it('should work - equality', function() {
			const DUMMY_ITEM_01: Item = generate_random_demo_weapon()
			const DUMMY_ITEM_02: Item = generate_random_demo_armor()

			expect(compare_items(DUMMY_ITEM_01, DUMMY_ITEM_01), 'equality - 1').to.equal(0)
			expect(compare_items(DUMMY_ITEM_02, DUMMY_ITEM_02), 'equality - 2').to.equal(0)
		})

		it('should work - lower/higher than', function() {
			const DUMMY_ITEM_01: Item = generate_random_demo_weapon()
			const DUMMY_ITEM_02: Item = generate_random_demo_armor()

			expect(compare_items(DUMMY_ITEM_01, DUMMY_ITEM_02), 'diff - 1-2').to.equal(-1)
			expect(compare_items(DUMMY_ITEM_02, DUMMY_ITEM_01), 'diff - 1-2').to.equal(1)
		})
	})
})
