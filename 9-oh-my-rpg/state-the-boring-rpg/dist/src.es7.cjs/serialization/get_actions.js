"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const types_1 = require("./types");
/////////////////////
function get_actions_for_unslotted_item(state, uuid) {
    const actions = [];
    const equip = {
        type: types_1.ActionType.equip_item,
        category: types_1.ActionCategory.inventory,
        expected_state_revision: state.revision,
        target_uuid: uuid,
    };
    actions.push(equip);
    const sell = {
        type: types_1.ActionType.sell_item,
        category: types_1.ActionCategory.inventory,
        expected_state_revision: state.revision,
        target_uuid: uuid,
    };
    actions.push(sell);
    return actions;
}
///////
function get_actions_for_element(state, uuid) {
    const actions = [];
    const as_unslotted_item = state_inventory_1.get_unslotted_item(state.inventory, uuid);
    if (as_unslotted_item)
        actions.push(...get_actions_for_unslotted_item(state, uuid));
    return actions;
}
exports.get_actions_for_element = get_actions_for_element;
//# sourceMappingURL=get_actions.js.map