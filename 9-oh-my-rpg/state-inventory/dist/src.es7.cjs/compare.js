"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const consts_1 = require("./consts");
/////////////////////
function compare_items_by_slot_then_strength(a, b) {
    if (a.slot !== b.slot)
        return definitions_1.compare_items_by_slot(a, b);
    switch (a.slot) {
        case definitions_1.InventorySlot.armor: {
            const sort = logic_armors_1.compare_armors_by_strength(a, b);
            if (!Number.isInteger(sort))
                throw new Error(`${consts_1.LIB}: compare():  error sorting armors!`);
            return sort;
        }
        case definitions_1.InventorySlot.weapon: {
            const sort = logic_weapons_1.compare_weapons_by_strength(a, b);
            if (!Number.isInteger(sort))
                throw new Error(`${consts_1.LIB}: compare():  error sorting weapons!`);
            return sort;
        }
        default:
            throw new Error(`${consts_1.LIB}: compare(): unhandled item slot "${a.slot}"!`);
    }
}
exports.compare_items_by_slot_then_strength = compare_items_by_slot_then_strength;
/////////////////////
//# sourceMappingURL=compare.js.map