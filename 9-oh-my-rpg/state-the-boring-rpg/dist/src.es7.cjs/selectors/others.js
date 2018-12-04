"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const state_energy_1 = require("@oh-my-rpg/state-energy");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const state_engagement_1 = require("@oh-my-rpg/state-engagement");
const engagement_1 = require("../engagement");
const achievements_1 = require("./achievements");
/////////////////////
function get_energy_snapshot(state, now) {
    return state_energy_1.get_snapshot(state.energy, now);
}
exports.get_energy_snapshot = get_energy_snapshot;
// TODO
function appraise_player_power(state) {
    let power = 1;
    definitions_1.ITEM_SLOTS.forEach((slot) => {
        const item = state_inventory_1.get_item_in_slot(state.inventory, slot);
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
    return possible_achievement || state_inventory_1.get_item(state.inventory, uuid);
}
exports.find_element = find_element;
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
//# sourceMappingURL=others.js.map