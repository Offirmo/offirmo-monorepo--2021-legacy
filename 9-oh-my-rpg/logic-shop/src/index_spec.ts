import { expect } from 'chai'

import { InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'

import {
	Armor,
	get_medium_damage_reduction,
} from '@oh-my-rpg/logic-armors'

import {
	Weapon,
	get_medium_damage,
} from '@oh-my-rpg/logic-weapons'

import {
	appraise
} from '.'

describe('📦 💰 📤 📥  shop logic:', function() {

	describe('appraisal', function() {
		context('of armors', function() {
			it('should work', () => {
				const price = appraise({
					slot: InventorySlot.armor,
					base_hid: 'whatever',
					qualifier1_hid: 'whatever',
					qualifier2_hid: 'whatever',
					quality: ItemQuality.legendary,
					base_strength: 14,
					enhancement_level: 3,
				} as Armor)
				expect(price).to.be.a('number')
				expect(price).to.equal(3670)
			})
		})
		context('of weapons', function() {
			it('should work', () => {
				const price = appraise({
					slot: InventorySlot.weapon,
					base_hid: 'whatever',
					qualifier1_hid: 'whatever',
					qualifier2_hid: 'whatever',
					quality: ItemQuality.legendary,
					base_strength: 14,
					enhancement_level: 3,
				} as Weapon)
				expect(price).to.be.a('number')
				expect(price).to.equal(3262)
			})
		})
	})
})
