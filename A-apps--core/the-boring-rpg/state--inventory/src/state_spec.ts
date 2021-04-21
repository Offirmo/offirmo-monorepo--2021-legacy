import { expect } from 'chai'

import {
	InventorySlot,
	ItemQuality,
} from '@tbrpg/definitions'
import {
	generate_random_demo_armor,
} from '@oh-my-rpg/logic-armors'
import {
	generate_random_demo_weapon,
} from '@oh-my-rpg/logic-weapons'

import { LIB, SCHEMA_VERSION } from './consts'


import {
	Item,
	State,

	create,
	add_item,
	remove_item_from_unslotted,
	equip_item,

	get_equipped_item_count,
	get_unequipped_item_count,
	get_item_count,
	get_item,
	get_item_in_slot,
	iterables_unslotted,
} from '.'

describe(`${LIB} - reducer`, function() {
	const DUMMY_ITEM: Item = generate_random_demo_weapon()

	describe('🆕 initial state', function() {

		it('should have correct defaults', function() {
			const state = create()

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				unslotted_capacity: 20,
				slotted: {},
				unslotted: [],
			})

			expect(state.unslotted_capacity).to.equal(20)
			expect(state.unslotted).to.have.lengthOf(0)
			expect(Object.keys(state.slotted)).to.have.lengthOf(0)

			expect(get_item_count(state), 'i').to.equal(0)
			expect(get_equipped_item_count(state), 'e').to.equal(0)
			expect(get_unequipped_item_count(state), 'u').to.equal(0)
		})
	})

	describe('📥 item addition', function() {

		it('should work on empty state', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			expect(state.unslotted).to.have.lengthOf(1)
			expect(get_item_count(state)).to.equal(1)
			expect(state.unslotted[0]).to.deep.equal(DUMMY_ITEM)
		})

		it('should work on simple non-empty state', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			state = add_item(state, DUMMY_ITEM)
			expect(state.unslotted, 'unslotted').to.have.lengthOf(2)
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
			expect(state.unslotted).to.have.lengthOf(20)
			function addLast() {
				state = add_item(state, DUMMY_ITEM)
			}
			expect(addLast).to.throw('inventory is full!')
		})

		it('should succeed slot when some items where recently removed', function() {
			const item1: Item = DUMMY_ITEM
			const item2: Item = generate_random_demo_weapon()
			let state = create()
			state = add_item(state, item1)
			state = remove_item_from_unslotted(state, item1.uuid)
			state = add_item(state, item2)
			expect(get_item_count(state), 'item count').to.equal(1)
			expect(state.unslotted[0]).to.deep.equal(item2)
		})

		it('should auto-sort the item inside the inventory', function() {
			const DUMMY_ITEM_01 = {
				...DUMMY_ITEM,
				base_strength: 1,
			}
			const DUMMY_ITEM_02 = {
				...DUMMY_ITEM,
				base_strength: 2,
			}

			let state = create()
			state = add_item(state, DUMMY_ITEM_01)
			state = add_item(state, DUMMY_ITEM_02)

			expect(state.unslotted[0]).to.equal(DUMMY_ITEM_02)
			expect(state.unslotted[1]).to.equal(DUMMY_ITEM_01)
		})
	})

	describe('📤 item removal', function() {

		it('should throw when not found', function() {
			let state = create()

			function remove_one() {
				state = remove_item_from_unslotted(state, 'non-existing-uuid')
			}
			expect(remove_one).to.throw('can’t remove item #non-existing-uuid, not found')
		})

		it('should work in nominal case', function() {
			const item1: Item = generate_random_demo_weapon()
			const item2: Item = generate_random_demo_armor()

			let state = create()
			state = add_item(state, item1)
			state = add_item(state, item2)
			state = remove_item_from_unslotted(state, item1.uuid)
			expect(get_item_count(state), 'item count').to.equal(1)
			expect(state.unslotted).to.have.lengthOf(1)
			expect(state.unslotted[0]).to.deep.equal(item2)
		})

		it('should NOT remove from slots, only from backpack', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			state = equip_item(state, DUMMY_ITEM.uuid)

			function remove_one() {
				state = remove_item_from_unslotted(state, DUMMY_ITEM.uuid)
			}
			expect(remove_one).to.throw('can’t remove item')
			expect(remove_one).to.throw('not found')
		})
	})

	describe('⬆ item equipping', function() {

		it('should fail on missing item', function() {
			let state = create()
			function equip_empty() {
				state = equip_item(state, 'non-existing-uuid')
			}
			expect(equip_empty).to.throw('can’t equip item')
			expect(equip_empty).to.throw('not found!')
		})

		it('should work on simple non-empty state, equip to the correct slot and correctly remove from unslotted', function() {
			let state = create()
			state = add_item(state, DUMMY_ITEM)
			expect(get_equipped_item_count(state), 'e1').to.equal(0)
			expect(get_unequipped_item_count(state), 'u1').to.equal(1)
			expect(get_item_count(state), 'i1').to.equal(1)
			state = equip_item(state, DUMMY_ITEM.uuid)
			expect(get_equipped_item_count(state), 'e2').to.equal(1)
			expect(get_unequipped_item_count(state), 'u2').to.equal(0)
			expect(get_item_count(state), 'i1').to.equal(1)
		})

		it('should work on simple non-empty state and correctly swap if the slot was occupied', function() {
			let state = create()

			const item1: Item = generate_random_demo_weapon()
			state = add_item(state, item1)
			state = equip_item(state, item1.uuid)

			expect(get_equipped_item_count(state), 'e').to.equal(1)
			expect(get_unequipped_item_count(state), 'u').to.equal(0)
			expect(get_item_count(state), 'i').to.equal(1)
			expect(get_item_in_slot(state, InventorySlot.weapon)).to.deep.equal(item1)
			expect(state.unslotted).to.have.lengthOf(0)

			const item2: Item = generate_random_demo_weapon()
			state = add_item(state, item2)
			state = equip_item(state, item2.uuid)

			expect(get_equipped_item_count(state), 'e').to.equal(1)
			expect(get_unequipped_item_count(state), 'u').to.equal(1)
			expect(get_item_count(state), 'i').to.equal(2)

			expect(get_item_in_slot(state, InventorySlot.weapon)).to.deep.equal(item2)
			expect(state.unslotted[0]).to.deep.equal(item1)
		})
	})

	// removed, useless (for now)
	describe('⬇ item unequipping', function() {

		it('should fail on missing slot')

		it('should work on simple non-empty state, unequip to the correct slot and correctly add to unslotted')

		it('should fail when the inventory is full')
	})

	describe('misc items iteration', function() {

		it('should yield all unequipped slots', () => {
			const item1: Item = generate_random_demo_armor()
			const item2: Item = generate_random_demo_armor()
			const item3: Item = generate_random_demo_weapon()
			let state = create()

			state = add_item(state, item1)
			state = add_item(state, item2)
			state = add_item(state, item3)
			state = remove_item_from_unslotted(state, item1.uuid)

			const yielded_items = Array.from(iterables_unslotted(state))
			//console.log(yielded_items)
			expect(yielded_items).to.have.lengthOf(2)
			// note: items were auto-sorted
			expect(yielded_items[0]).to.equal(item3)
			expect(yielded_items[1]).to.equal(item2)
		})
	})
})
