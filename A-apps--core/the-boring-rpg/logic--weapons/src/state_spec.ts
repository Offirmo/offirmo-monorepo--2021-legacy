import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'

import { InventorySlot, ItemQuality, ElementType, xxx_test_unrandomize_element } from '@tbrpg/definitions'
import { Random, Engine } from '@offirmo/random'

import { LIB } from './consts'
import {
	Weapon,
	MAX_ENHANCEMENT_LEVEL,
	create,
	generate_random_demo_weapon,
	enhance,
} from '.'


function assert_shape(weapon: Readonly<Weapon>) {
	expect(Object.keys(weapon)).to.have.lengthOf(9)

	expect(weapon.uuid).to.equal('uu1~test~test~test~test~')

	expect(weapon.element_type).to.be.a('string')
	expect(Enum.isType(ElementType, weapon.element_type)).to.be.true

	expect(weapon.slot).to.be.a('string')
	expect(Enum.isType(InventorySlot, weapon.slot)).to.be.true

	expect(weapon.base_hid).to.be.a('string')
	expect(weapon.base_hid.length).to.have.above(2)

	expect(weapon.qualifier1_hid).to.be.a('string')
	expect(weapon.qualifier1_hid.length).to.have.above(2)

	expect(weapon.qualifier2_hid).to.be.a('string')
	expect(weapon.qualifier2_hid.length).to.have.above(2)

	expect(weapon.quality).to.be.a('string')
	expect(Enum.isType(ItemQuality, weapon.quality)).to.be.true

	expect(weapon.base_strength).to.be.a('number')
	expect(weapon.base_strength).to.be.at.least(1)
	expect(weapon.base_strength).to.be.at.most(5000) // TODO real max

	expect(weapon.enhancement_level).to.be.a('number')
	expect(weapon.enhancement_level).to.be.at.least(0)
	expect(weapon.enhancement_level).to.be.at.most(MAX_ENHANCEMENT_LEVEL)
}


describe(`${LIB} - logic`, function() {

	describe('creation', function() {

		it('should allow creating a random weapon', function() {
			const rng: Engine = Random.engines.mt19937().seed(789)
			const weapon1 = xxx_test_unrandomize_element<Weapon>(create(rng))
			assert_shape(weapon1)
			expect((rng as any).getUseCount(), '# rng draws 1').to.equal(5)

			const weapon2 = xxx_test_unrandomize_element<Weapon>(create(rng))
			assert_shape(weapon2)
			expect((rng as any).getUseCount(), '# rng draws 2').to.equal(10)
			expect(weapon2).not.to.deep.equal(weapon1)
		})

		it('should allow creating a partially predefined weapon', function() {
			const rng: Engine = Random.engines.mt19937().seed(789)
			const weapon = xxx_test_unrandomize_element<Weapon>(create(rng, {
				base_hid: 'spoon',
				quality: 'artifact',
			}))
			expect(weapon).to.deep.equal({
				uuid: 'uu1~test~test~test~test~',
				element_type: ElementType.item,
				slot: InventorySlot.weapon,
				base_hid: 'spoon',
				qualifier1_hid: 'composite',
				qualifier2_hid: 'twink',
				quality: ItemQuality.artifact,
				base_strength: 38351,
				enhancement_level: 0,
			})
			expect((rng as any).getUseCount(), '# rng draws').to.equal(3) // 2 less random picks
		})
	})

	describe('enhancement', function() {

		it('should allow enhancing a weapon', function() {
			let weapon = generate_random_demo_weapon()
			weapon.enhancement_level = 0

			weapon = enhance(weapon)
			expect(weapon.enhancement_level, '1').to.equal(1)

			for(let i = 2; i <= MAX_ENHANCEMENT_LEVEL; ++i) {
				weapon = enhance(weapon)
				expect(weapon.enhancement_level, String(i)).to.equal(i)
			}

			expect(weapon.enhancement_level, 'max').to.equal(MAX_ENHANCEMENT_LEVEL)
		})

		it('should fail if weapon is already at max enhancement level', () => {
			let weapon = generate_random_demo_weapon()
			weapon.enhancement_level = MAX_ENHANCEMENT_LEVEL

			function attempt_enhance() {
				weapon = enhance(weapon)
			}

			expect(attempt_enhance).to.throw('maximal enhancement level!')
		})
	})
})
