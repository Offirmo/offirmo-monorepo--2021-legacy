import { InventorySlot } from '@oh-my-rpg/definitions';
import { render_armor_short, render_armor_detailed } from './items--armor';
import { render_weapon_short, render_weapon_detailed, } from './items--weapon';
import { DEFAULT_RENDER_ITEM_OPTIONS } from "./consts";
function decorate_with_common_item_props(i, doc) {
    doc.$hints = doc.$hints || {};
    doc.$hints.uuid = i.uuid;
    return doc;
}
/*
const MAP = {
    [InventorySlot.armor]: {
        render_short: render_armor_short,
        render_detailed: render_armor_detailed,
    },
    [InventorySlot.weapon]: {
        render_short: render_weapon_short,
        render_detailed: render_weapon_detailed,
    },
}
*/
function render_item_short(i, options = DEFAULT_RENDER_ITEM_OPTIONS) {
    if (!i)
        throw new Error('render_item_short(): no item provided!');
    const doc = (function auto() {
        switch (i.slot) {
            case InventorySlot.armor:
                return render_armor_short(i, options);
            case InventorySlot.weapon:
                return render_weapon_short(i, options);
            default:
                throw new Error(`render_item_short(): don't know how to render a "${i.slot}" !`);
        }
    })();
    return decorate_with_common_item_props(i, doc);
}
function render_item_detailed(i) {
    if (!i)
        throw new Error('render_item_short(): no item provided!');
    const doc = (function auto() {
        switch (i.slot) {
            case InventorySlot.armor:
                return render_armor_detailed(i);
            case InventorySlot.weapon:
                return render_weapon_detailed(i);
            default:
                throw new Error(`render_item_short(): don't know how to render a "${i.slot}" !`);
        }
    })();
    return decorate_with_common_item_props(i, doc);
}
export { render_item_short, render_item_detailed, };
//# sourceMappingURL=items.js.map