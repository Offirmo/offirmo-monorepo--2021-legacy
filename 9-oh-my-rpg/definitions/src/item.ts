import { ElementType, Item, ItemQuality, InventorySlot } from './types'
import { ITEM_SLOTS_TO_INT, ITEM_QUALITIES_TO_INT } from './consts'
import { create_element_base } from './element'

function create_item_base(slot: InventorySlot, quality: ItemQuality = ItemQuality.common): Item {
	return {
		...create_element_base(ElementType.item),
		slot,
		quality,
	}
}

function compare_items_by_slot(a: Item, b: Item): number {
	return ITEM_SLOTS_TO_INT[a.slot] - ITEM_SLOTS_TO_INT[b.slot]
}

function compare_items_by_quality(a: Item, b: Item): number {
	return ITEM_QUALITIES_TO_INT[a.quality] - ITEM_QUALITIES_TO_INT[b.quality]
}

export {
	create_item_base,
	compare_items_by_slot,
	compare_items_by_quality,
}
