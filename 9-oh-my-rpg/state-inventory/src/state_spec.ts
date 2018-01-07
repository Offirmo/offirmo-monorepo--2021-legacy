import { expect } from 'chai'

import { ElementType, create_element_base } from '@oh-my-rpg/definitions'

import { LIB_ID, SCHEMA_VERSION } from './consts'

import {
	InventorySlot,
	ItemQuality,
} from '@oh-my-rpg/definitions'


import {
	Item,
	State,

	create,
	add_item,
	remove_item,
	equip_item,
	unequip_item,

	get_equiped_item_count,
	get_unequiped_item_count,
	get_item_count,
	get_item_at_coordinates,
	get_item_in_slot,
	iterables_unslotted,
} from '.'

describe('📦 📦 📦  Inventory state - reducer', function() {
	const EXPECTED_UNSLOTTED_INVENTORY_LENGTH = 20
	const DUMMY_ITEM: Item = {
		...create_element_base(ElementType.item),
		slot: InventorySlot.none,
		quality: ItemQuality.common
	}
	const DUMMY_EQUIPABLE_ITEM: Item = {
		...create_element_base(ElementType.item),
		slot: InventorySlot.weapon,
		quality: ItemQuality.common
	}
	const DUMMY_NON_EQUIPABLE_ITEM: Item = DUMMY_ITEM

	describe('🆕 initial state', function() {

		it('should have correct defaults', function() {
			const state = create()

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				unslotted_capacity: 20,
				slotted: {},
				unslotted: [
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
				],
			})

			expect(state.unslotted_capacity).to.equal(EXPECTED_UNSLOTTED_INVENTORY_LENGTH)
			expect(state.unslotted).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH)
			expect(Object.keys(state.slotted)).to.have.lengthOf(0)

			expect(get_item_count(state), 'i').to.equal(0)
			expect(get_equiped_item_count(state), 'e').to.equal(0)
			expect(get_unequiped_item_count(state), 'u').to.equal(0)
		})
	})

	describe('📥 item addition', function() {

		it('should work on empty state', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			expect(state.unslotted).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH)
			expect(get_item_count(state)).to.equal(1)
		})

		it('should work on simple non-empty state', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			expect(state.unslotted, 'unslotted').to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH)
			expect(get_item_count(state), 'item count').to.equal(2)
		})

		it('should fail when the inventory is full', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			expect(state.unslotted).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH)
			function addLast() {
				state = add_item(state, DUMMY_ITEM)
			}
			expect(addLast).to.throw('inventory is full!')
		})

		it('should find a free slot when some items where recently removed', function() {
			const item1: Item = DUMMY_ITEM
			const item2: Item = {
				...create_element_base(ElementType.item),
				slot: InventorySlot.none,
				quality: ItemQuality.common
			}
			let state = create()
			state = add_item(state, item1)
			state = add_item(state, item1)
			state = remove_item(state, 0)
			state = add_item(state, item2)
			expect(get_item_count(state), 'item count').to.equal(2)
			// note: state was auto-sorted
			expect(get_item_at_coordinates(state, 0)).to.equal(item1)
			expect(get_item_at_coordinates(state, 1)).to.equal(item2)
		})
	})

	describe('📤 item removal', function() {

		it('should throw on empty target slot', function() {
			let state = create()
			function remove_one() {
				state = remove_item(state, 0)
			}
			expect(remove_one).to.throw('can\'t remove item at #0, not found')
		})

		it('should work in nominal case', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			state = remove_item(state, 0)
			expect(get_item_count(state), 'item count').to.equal(1)
			expect(get_item_at_coordinates(state, 1)).to.be.null
			expect(get_item_at_coordinates(state, 2)).to.be.null
		})
	})

	describe('⬆ item equipping', function() {

		it('should fail on missing item', function() {
			let state = create()
			function equip_empty() {
				state = equip_item(state, 0)
			}
			expect(equip_empty).to.throw('can\'t equip item at #0, not found!')
		})

		it('should fail on non-equipable item', function() {
			let state = create()
			state = add_item(state, DUMMY_NON_EQUIPABLE_ITEM)
			function equip_unequipable() {
				state = equip_item(state, 0)
			}
			expect(equip_unequipable).to.throw('not equipable!')
		})

		it('should work on simple non-empty state, equip to the correct slot and correctly remove from unslotted', function() {
			let state = create()
			state = add_item(state, DUMMY_EQUIPABLE_ITEM)
			expect(get_equiped_item_count(state), 'e1').to.equal(0)
			expect(get_unequiped_item_count(state), 'u1').to.equal(1)
			expect(get_item_count(state), 'i1').to.equal(1)
			state = equip_item(state, 0)
			expect(get_equiped_item_count(state), 'e2').to.equal(1)
			expect(get_unequiped_item_count(state), 'u2').to.equal(0)
			expect(get_item_count(state), 'i1').to.equal(1)
		})

		it('should work on simple non-empty state and correctly swap if the slot was occupied', function() {
			let state = create()

			const item1: Item = DUMMY_EQUIPABLE_ITEM
			state = add_item(state, item1)
			state = equip_item(state, 0)

			const item2: Item = {
				...create_element_base(ElementType.item),
				slot: InventorySlot.weapon,
				quality: ItemQuality.rare
			}
			state = add_item(state, item2)
			state = equip_item(state, 0)

			expect(get_equiped_item_count(state), 'e').to.equal(1)
			expect(get_unequiped_item_count(state), 'u').to.equal(1)
			expect(get_item_count(state), 'i').to.equal(2)

			expect(get_item_in_slot(state, InventorySlot.weapon)).to.equal(item2)
			expect(get_item_at_coordinates(state, 0)).to.equal(item1)
		})
	})

	describe('⬇ item unequipping', function() {

		it('should fail on missing slot', function() {
			let state = create()
			function unequip_empty() {
				state = unequip_item(state, InventorySlot.weapon)
			}
			expect(unequip_empty).to.throw('can\'t unequip item from slot weapon, it\'s empty!')
		})

		it('should work on simple non-empty state, unequip to the correct slot and correctly add to unslotted', function() {
			let state = create()
			const item: Item = DUMMY_EQUIPABLE_ITEM
			state = add_item(state, item)
			state = equip_item(state, 0)
			state = unequip_item(state, InventorySlot.weapon)
			expect(get_item_count(state), 'item count 1').to.equal(1)
			expect(get_unequiped_item_count(state), 'item count 2').to.equal(1)
			expect(get_item_in_slot(state, InventorySlot.weapon)).to.be.null
		})

		it('should fail when the inventory is full', function() {
			let state = create()

			const item: Item = DUMMY_EQUIPABLE_ITEM
			state = add_item(state, item)
			state = equip_item(state, 0)

			const itemX: Item = DUMMY_ITEM
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)
			state = add_item(state, itemX)

			expect(get_item_count(state), 'item count 1').to.equal(21)
			expect(get_unequiped_item_count(state), 'item count 2').to.equal(20)

			function unequip() {
				state = unequip_item(state, InventorySlot.weapon)
			}
			expect(unequip).to.throw('inventory is full!')
		})
	})

	describe('misc items iteration', function() {

		it('should yield all unequiped slots', () => {
			const item1: Item = {
				...create_element_base(ElementType.item),
				slot: InventorySlot.armor, quality: ItemQuality.common }
			const item2: Item = {
				...create_element_base(ElementType.item),
			slot: InventorySlot.weapon, quality: ItemQuality.common }
			const item3: Item = {
				...create_element_base(ElementType.item),
				slot: InventorySlot.none, quality: ItemQuality.common }
			let state = create()

			state = add_item(state, item1)
			state = add_item(state, item2)
			state = add_item(state, item3)
			state = remove_item(state, 0)

			const yielded_items = Array.from(iterables_unslotted(state))
			console.log(yielded_items)
			expect(yielded_items).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH)
			expect(yielded_items[0]).to.equal(item2)
			expect(yielded_items[1]).to.equal(item3)
			expect(yielded_items[2]).to.be.null
			expect(yielded_items[3]).to.be.null
			expect(yielded_items[EXPECTED_UNSLOTTED_INVENTORY_LENGTH-1]).to.be.null
		})
	})
})
