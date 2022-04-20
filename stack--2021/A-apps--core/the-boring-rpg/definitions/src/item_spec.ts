import { expect } from 'chai'

import { Item, InventorySlot, ItemQuality } from './types'
import { LIB } from './consts'
import {
	create_item_base,
	compare_items_by_slot,
	compare_items_by_quality,
} from './'

describe(`${LIB} - item utilities`, function() {

	describe('compare_items_by_slot', function() {

		it('should sort correctly', () => {
			const list: Item[] = [
				create_item_base(InventorySlot.weapon),
				create_item_base(InventorySlot.armor),
				create_item_base(InventorySlot.armor),
				create_item_base(InventorySlot.weapon),
			]
			const [ w1, a1, a2, w2 ] = list
			expect([...list].sort(compare_items_by_slot)).to.deep.equal([
				w1,
				w2,
				a1,
				a2,
			])
		})
	})
	describe('compare_items_by_quality', function() {

		it('should sort correctly', () => {
			const list: Item[] = [
				create_item_base(InventorySlot.weapon, ItemQuality.artifact),
				create_item_base(InventorySlot.weapon, ItemQuality.common),
				create_item_base(InventorySlot.weapon, ItemQuality.uncommon),
				create_item_base(InventorySlot.weapon, ItemQuality.legendary),
				create_item_base(InventorySlot.weapon, ItemQuality.rare),
				create_item_base(InventorySlot.weapon, ItemQuality.epic),
			]
			const [ artifact, common, uncommon, legendary, rare, epic ] = list

			expect([...list].sort(compare_items_by_quality)).to.deep.equal([
				artifact,
				legendary,
				epic,
				rare,
				uncommon,
				common,
			])
		})
	})
})
