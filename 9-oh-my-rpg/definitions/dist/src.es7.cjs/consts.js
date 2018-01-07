"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const types_1 = require("./types");
///////
const ITEM_QUALITIES = typescript_string_enums_1.Enum.keys(types_1.ItemQuality);
exports.ITEM_QUALITIES = ITEM_QUALITIES;
///////
const ITEM_SLOTS = [
    types_1.InventorySlot.weapon,
    types_1.InventorySlot.armor,
];
exports.ITEM_SLOTS = ITEM_SLOTS;
///////
const MIN_LEVEL = 1;
exports.MIN_LEVEL = MIN_LEVEL;
const MAX_LEVEL = 9999;
exports.MAX_LEVEL = MAX_LEVEL;
/////////////////////
//# sourceMappingURL=consts.js.map