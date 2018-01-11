"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const consts_1 = require("./consts");
/////////////////////
function compare_items(a, b) {
    if (a.slot !== b.slot)
        return definitions_1.compare_items_by_slot(a, b);
    switch (a.slot) {
        case definitions_1.InventorySlot.armor:
            return logic_armors_1.compare_armors_by_strength(a, b);
        case definitions_1.InventorySlot.weapon:
            return logic_weapons_1.compare_weapons_by_strength(a, b);
        default:
            throw new Error(`${consts_1.LIB_ID}: compare(): unhandled item slot "${a.slot}"!`);
    }
}
exports.compare_items = compare_items;
/////////////////////
//# sourceMappingURL=compare.js.map