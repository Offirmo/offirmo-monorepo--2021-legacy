"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
/////////////////////
function is_inventory_full(state) {
    return state_inventory_1.is_full(state.inventory);
}
exports.is_inventory_full = is_inventory_full;
/////////////////////
//# sourceMappingURL=selectors.js.map