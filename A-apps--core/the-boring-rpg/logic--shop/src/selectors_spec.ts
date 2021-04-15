import { expect } from 'chai'

import { InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'

import {
	Armor,
	DEMO_ARMOR_1,
	get_medium_damage_reduction,
} from '@oh-my-rpg/logic-armors'

import {
	Weapon,
	DEMO_WEAPON_1,
	get_medium_damage,
} from '@oh-my-rpg/logic-weapons'

import {
	appraise_sell_value,
} from '.'

describe('@oh-my-rpg/logic-shop - selectors:', function() {

	describe('appraisal', function() {

		context('of armors', function() {
			it('should work', () => {
				const price = appraise_sell_value(DEMO_ARMOR_1)
				expect(price).to.be.a('number')
				expect(price).to.equal(495)
			})
		})

		context('of weapons', function() {
			it('should work', () => {
				const price = appraise_sell_value(DEMO_WEAPON_1)
				expect(price).to.be.a('number')
				expect(price).to.equal(742)
			})
		})
	})
})
