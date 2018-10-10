"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const { Snapshot, get_snapshot } = require('@oh-my-rpg/state-energy');
exports.Snapshot = Snapshot;
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const state_inventory_2 = require("@oh-my-rpg/state-inventory");
/////////////////////
function is_inventory_full(state) {
    return state_inventory_1.is_full(state.inventory);
}
exports.is_inventory_full = is_inventory_full;
function get_energy_snapshot(state, now) {
    return get_snapshot(state.energy, now);
}
exports.get_energy_snapshot = get_energy_snapshot;
function get_item_in_slot(state, slot) {
    return state_inventory_2.get_item_in_slot(state.inventory, slot);
}
exports.get_item_in_slot = get_item_in_slot;
function get_item(state, uuid) {
    return state_inventory_2.get_item(state.inventory, uuid);
}
exports.get_item = get_item;
function appraise_item_value(state, uuid) {
    const item = get_item(state, uuid);
    if (!item)
        throw new Error('appraise_item_value(): No item!');
    return logic_shop_1.appraise_value(item);
}
exports.appraise_item_value = appraise_item_value;
function appraise_item_power(state, uuid) {
    const item = get_item(state, uuid);
    if (!item)
        throw new Error('appraise_item_power(): No item!');
    return logic_shop_1.appraise_power(item);
}
exports.appraise_item_power = appraise_item_power;
function appraise_player_power(state) {
    let power = 1;
    definitions_1.ITEM_SLOTS.forEach((slot) => {
        const item = get_item_in_slot(state, slot);
        if (item)
            power += logic_shop_1.appraise_power(item);
    });
    // TODO appraise attributes relative to class
    return power;
}
exports.appraise_player_power = appraise_player_power;
function find_element(state, uuid) {
    // only inventory for now
    return get_item(state, uuid);
}
exports.find_element = find_element;
/////////////////////
//# sourceMappingURL=selectors.js.map