import { ElementType, ItemQuality } from './types';
import { ITEM_SLOTS_TO_INT, ITEM_QUALITIES_TO_INT } from './consts';
import { create_element_base } from './element';
function create_item_base(slot, quality = ItemQuality.common) {
    return Object.assign({}, create_element_base(ElementType.item), { slot,
        quality });
}
function compare_items_by_slot(a, b) {
    const rank_a = ITEM_SLOTS_TO_INT[a.slot];
    if (!Number.isInteger(rank_a))
        throw new Error('compare items by slots: unhandled slot! (A)');
    const rank_b = ITEM_SLOTS_TO_INT[b.slot];
    if (!Number.isInteger(rank_b))
        throw new Error('compare items by slots: unhandled slot! (B)');
    return rank_a - rank_b;
}
function compare_items_by_quality(a, b) {
    const rank_a = ITEM_QUALITIES_TO_INT[a.quality];
    if (!Number.isInteger(rank_a))
        throw new Error('compare items by quality: unhandled quality! (A)');
    const rank_b = ITEM_QUALITIES_TO_INT[b.quality];
    if (!Number.isInteger(rank_b))
        throw new Error('compare items by quality: unhandled quality! (B)');
    return rank_a - rank_b;
}
export { create_item_base, compare_items_by_slot, compare_items_by_quality, };
//# sourceMappingURL=item.js.map