"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 42,
    unslotted_capacity: 20,
    slotted: {
        [definitions_1.InventorySlot.armor]: logic_armors_1.DEMO_ARMOR_2,
        [definitions_1.InventorySlot.weapon]: logic_weapons_1.DEMO_WEAPON_1,
    },
    unslotted: [
        logic_weapons_1.DEMO_WEAPON_2,
        logic_armors_1.DEMO_ARMOR_1,
    ],
});
exports.DEMO_STATE = DEMO_STATE;
/////////////////////
//# sourceMappingURL=examples.js.map