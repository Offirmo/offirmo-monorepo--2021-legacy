"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
/////////////////////
// An element is everything which can be interacted with and/or has a rich tooltip
// ex. item, place, achievement, title...
const ElementType = typescript_string_enums_1.Enum('item', 'achievement_snapshot', 
// TODO expand
'location', 'lore');
exports.ElementType = ElementType;
/////////////////////
const ItemQuality = typescript_string_enums_1.Enum('common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact');
exports.ItemQuality = ItemQuality;
const InventorySlot = typescript_string_enums_1.Enum('weapon', 'armor', 'none' // = non slottable (TODO)
);
exports.InventorySlot = InventorySlot;
/////////////////////
//# sourceMappingURL=types.js.map