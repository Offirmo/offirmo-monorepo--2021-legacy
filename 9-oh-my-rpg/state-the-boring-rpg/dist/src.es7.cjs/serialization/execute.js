"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////
const state_1 = require("../state");
const types_1 = require("./types");
/////////////////////
function reduce_action(state, action) {
    const { expected_state_revision } = action;
    if (expected_state_revision) {
        if (state.revision !== expected_state_revision)
            throw new Error('Trying to execute an outdated action!');
    }
    switch (action.type) {
        case types_1.ActionType.play:
            return state_1.play(state);
        case types_1.ActionType.equip_item:
            return state_1.equip_item(state, action.target_uuid);
        case types_1.ActionType.sell_item:
            return state_1.sell_item(state, action.target_uuid);
        case types_1.ActionType.rename_avatar:
            return state_1.rename_avatar(state, action.new_name);
        case types_1.ActionType.change_avatar_class:
            return state_1.change_avatar_class(state, action.new_class);
        default:
            throw new Error('Unrecognized action!');
    }
}
exports.reduce_action = reduce_action;
//# sourceMappingURL=execute.js.map