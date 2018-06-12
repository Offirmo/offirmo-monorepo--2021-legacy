import { Item, ItemQuality, InventorySlot } from './types';
declare function create_item_base(slot: InventorySlot, quality?: ItemQuality): Item;
declare function compare_items_by_slot(a: Item, b: Item): number;
declare function compare_items_by_quality(a: Item, b: Item): number;
export { create_item_base, compare_items_by_slot, compare_items_by_quality, };
