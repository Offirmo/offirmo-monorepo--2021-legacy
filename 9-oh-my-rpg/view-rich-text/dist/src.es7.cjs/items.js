"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const items__armor_1 = require("./items--armor");
const items__weapon_1 = require("./items--weapon");
const consts_1 = require("./consts");
function decorate_with_common_item_props(i, doc) {
    doc.$hints = doc.$hints || {};
    doc.$hints.uuid = i.uuid;
    return doc;
}
function render_item_short(i, options = consts_1.DEFAULT_RENDER_ITEM_OPTIONS) {
    if (!i)
        throw new Error('render_item_short(): no item provided!');
    const doc = (function auto() {
        switch (i.slot) {
            case definitions_1.InventorySlot.armor:
                return items__armor_1.render_armor_short(i, options);
            case definitions_1.InventorySlot.weapon:
                return items__weapon_1.render_weapon_short(i, options);
            default:
                throw new Error(`render_item_short(): don't know how to render a "${i.slot}" !`);
        }
    })();
    return decorate_with_common_item_props(i, doc);
}
exports.render_item_short = render_item_short;
function render_item_detailed(i) {
    if (!i)
        throw new Error('render_item_detailed(): no item provided!');
    const doc = (function auto() {
        switch (i.slot) {
            case definitions_1.InventorySlot.armor:
                return items__armor_1.render_armor_detailed(i);
            case definitions_1.InventorySlot.weapon:
                return items__weapon_1.render_weapon_detailed(i);
            default:
                throw new Error(`render_item_detailed(): don't know how to render a "${i.slot}" !`);
        }
    })();
    return decorate_with_common_item_props(i, doc);
}
exports.render_item_detailed = render_item_detailed;
//# sourceMappingURL=items.js.map