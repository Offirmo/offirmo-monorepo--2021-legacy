"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const types_1 = require("./types");
///////
const VERSION = 'v0.1.0';
exports.VERSION = VERSION;
const PRODUCT = '@oh-my-rpg';
exports.PRODUCT = PRODUCT;
///////
const ITEM_QUALITIES = typescript_string_enums_1.Enum.keys(types_1.ItemQuality);
exports.ITEM_QUALITIES = ITEM_QUALITIES;
// useful for ex. for sorting
const ITEM_QUALITIES_TO_INT = {
    [types_1.ItemQuality.common]: 6,
    [types_1.ItemQuality.uncommon]: 5,
    [types_1.ItemQuality.rare]: 4,
    [types_1.ItemQuality.epic]: 3,
    [types_1.ItemQuality.legendary]: 2,
    [types_1.ItemQuality.artifact]: 1,
};
exports.ITEM_QUALITIES_TO_INT = ITEM_QUALITIES_TO_INT;
///////
const ITEM_SLOTS = typescript_string_enums_1.Enum.keys(types_1.InventorySlot);
exports.ITEM_SLOTS = ITEM_SLOTS;
// useful for ex. for sorting
const ITEM_SLOTS_TO_INT = {
    [types_1.InventorySlot.armor]: 2,
    [types_1.InventorySlot.weapon]: 1,
};
exports.ITEM_SLOTS_TO_INT = ITEM_SLOTS_TO_INT;
///////
const MIN_LEVEL = 1;
exports.MIN_LEVEL = MIN_LEVEL;
const MAX_LEVEL = 9999;
exports.MAX_LEVEL = MAX_LEVEL;
/////////////////////
//# sourceMappingURL=consts.js.map