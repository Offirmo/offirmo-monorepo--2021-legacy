"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
/////////////////////
const ActionType = typescript_string_enums_1.Enum('play', 'equip_item', 'sell_item', 'rename_avatar', 'change_avatar_class');
exports.ActionType = ActionType;
const ActionCategory = typescript_string_enums_1.Enum('base', 'inventory', 'character', 'meta');
exports.ActionCategory = ActionCategory;
//# sourceMappingURL=types.js.map