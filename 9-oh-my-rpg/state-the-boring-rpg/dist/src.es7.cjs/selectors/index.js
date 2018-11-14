"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const state_energy_1 = require("@oh-my-rpg/state-energy");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const state_inventory_2 = require("@oh-my-rpg/state-inventory");
const state_engagement_1 = require("@oh-my-rpg/state-engagement");
const engagement_1 = require("../engagement");
const achievements_1 = require("./achievements");
/////////////////////
function is_inventory_full(state) {
    return state_inventory_1.is_full(state.inventory);
}
exports.is_inventory_full = is_inventory_full;
function get_energy_snapshot(state, now) {
    return state_energy_1.get_snapshot(state.energy, now);
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
// TODO
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
    let possible_achievement = null;
    try {
        possible_achievement = achievements_1.get_achievement_snapshot_by_uuid(state, uuid);
    }
    catch (err) {
        // not found, swallow
    }
    return possible_achievement || get_item(state, uuid);
}
exports.find_element = find_element;
function find_better_unequipped_weapon(state) {
    // we take advantage of the fact that the inventory is auto-sorted
    const best_unequipped_weapon = state.inventory.unslotted.find(e => e.slot === definitions_1.InventorySlot.weapon);
    if (!best_unequipped_weapon)
        return null;
    const best_unequipped_power = logic_shop_1.appraise_power(best_unequipped_weapon);
    const equipped_power = logic_shop_1.appraise_power(get_item_in_slot(state, definitions_1.InventorySlot.weapon));
    if (best_unequipped_power > equipped_power)
        return best_unequipped_weapon;
    return null;
}
exports.find_better_unequipped_weapon = find_better_unequipped_weapon;
// TODO code duplication
function get_oldest_pending_flow_engagement(state) {
    const pe = state_engagement_1.get_oldest_queued_flow(state.engagement);
    if (!pe)
        return null;
    return {
        uid: pe.uid,
        $doc: engagement_1.get_engagement_message(state, pe),
        pe,
    };
}
exports.get_oldest_pending_flow_engagement = get_oldest_pending_flow_engagement;
function get_oldest_pending_non_flow_engagement(state) {
    const pe = state_engagement_1.get_oldest_queued_non_flow(state.engagement);
    if (!pe)
        return null;
    return {
        uid: pe.uid,
        $doc: engagement_1.get_engagement_message(state, pe),
        pe,
    };
}
exports.get_oldest_pending_non_flow_engagement = get_oldest_pending_non_flow_engagement;
tslib_1.__exportStar(require("./achievements"), exports);
/////////////////////
//# sourceMappingURL=index.js.map