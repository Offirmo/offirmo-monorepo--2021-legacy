"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const consts_1 = require("./consts");
const element_1 = require("./element");
function create_item_base(slot, quality = types_1.ItemQuality.common) {
    return Object.assign({}, element_1.create_element_base(types_1.ElementType.item), { slot,
        quality });
}
exports.create_item_base = create_item_base;
function compare_items_by_slot(a, b) {
    const rank_a = consts_1.ITEM_SLOTS_TO_INT[a.slot];
    if (!Number.isInteger(rank_a))
        throw new Error(`compare items by slots: unhandled slot! (A)`);
    const rank_b = consts_1.ITEM_SLOTS_TO_INT[b.slot];
    if (!Number.isInteger(rank_b))
        throw new Error(`compare items by slots: unhandled slot! (B)`);
    return rank_a - rank_b;
}
exports.compare_items_by_slot = compare_items_by_slot;
function compare_items_by_quality(a, b) {
    const rank_a = consts_1.ITEM_QUALITIES_TO_INT[a.quality];
    if (!Number.isInteger(rank_a))
        throw new Error(`compare items by quality: unhandled quality! (A)`);
    const rank_b = consts_1.ITEM_QUALITIES_TO_INT[b.quality];
    if (!Number.isInteger(rank_b))
        throw new Error(`compare items by quality: unhandled quality! (B)`);
    return rank_a - rank_b;
}
exports.compare_items_by_quality = compare_items_by_quality;
//# sourceMappingURL=item.js.map