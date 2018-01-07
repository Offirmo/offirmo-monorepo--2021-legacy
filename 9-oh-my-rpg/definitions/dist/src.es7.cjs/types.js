"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
/////////////////////
const ElementType = typescript_string_enums_1.Enum('item', 
// TODO expand
'location', 'lore');
exports.ElementType = ElementType;
/////////////////////
const ItemQuality = typescript_string_enums_1.Enum('common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact');
exports.ItemQuality = ItemQuality;
const InventorySlot = typescript_string_enums_1.Enum('none', 'weapon', 'armor');
exports.InventorySlot = InventorySlot;
/////////////////////
//# sourceMappingURL=types.js.map