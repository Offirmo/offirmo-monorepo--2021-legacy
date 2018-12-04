"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const state_inventory_2 = require("@oh-my-rpg/state-inventory");
/////////////////////
function appraise_item_value(state, uuid) {
    const item = state_inventory_2.get_item(state.inventory, uuid);
    if (!item)
        throw new Error('appraise_item_value(): No item!');
    return logic_shop_1.appraise_value(item);
}
exports.appraise_item_value = appraise_item_value;
function appraise_item_power(state, uuid) {
    const item = state_inventory_2.get_item(state.inventory, uuid);
    if (!item)
        throw new Error('appraise_item_power(): No item!');
    return logic_shop_1.appraise_power(item);
}
exports.appraise_item_power = appraise_item_power;
function is_inventory_full(state) {
    return state_inventory_1.is_full(state.inventory);
}
exports.is_inventory_full = is_inventory_full;
function get_item_in_slot(state, slot) {
    return state_inventory_2.get_item_in_slot(state.inventory, slot);
}
exports.get_item_in_slot = get_item_in_slot;
function get_item(state, uuid) {
    return state_inventory_2.get_item(state.inventory, uuid);
}
exports.get_item = get_item;
function find_best_unequipped_armor(state) {
    // we take advantage of the fact that the inventory is auto-sorted
    const best_unequipped_armor = state.inventory.unslotted.find(e => e.slot === definitions_1.InventorySlot.armor);
    return best_unequipped_armor
        ? best_unequipped_armor
        : null;
}
function find_better_unequipped_armor(state) {
    const best_unequipped_armor = find_best_unequipped_armor(state);
    if (!best_unequipped_armor)
        return null;
    const best_unequipped_power = logic_shop_1.appraise_power(best_unequipped_armor);
    const equipped_power = logic_shop_1.appraise_power(get_item_in_slot(state, definitions_1.InventorySlot.armor));
    if (best_unequipped_power > equipped_power)
        return best_unequipped_armor;
    return null;
}
exports.find_better_unequipped_armor = find_better_unequipped_armor;
function find_best_unequipped_weapon(state) {
    // we take advantage of the fact that the inventory is auto-sorted
    const best_unequipped_weapon = state.inventory.unslotted.find(e => e.slot === definitions_1.InventorySlot.weapon);
    return best_unequipped_weapon
        ? best_unequipped_weapon
        : null;
}
function find_better_unequipped_weapon(state) {
    const best_unequipped_weapon = find_best_unequipped_weapon(state);
    if (!best_unequipped_weapon)
        return null;
    const best_unequipped_power = logic_shop_1.appraise_power(best_unequipped_weapon);
    const equipped_power = logic_shop_1.appraise_power(get_item_in_slot(state, definitions_1.InventorySlot.weapon));
    if (best_unequipped_power > equipped_power)
        return best_unequipped_weapon;
    return null;
}
exports.find_better_unequipped_weapon = find_better_unequipped_weapon;
/////////////////////
//# sourceMappingURL=inventory.js.map