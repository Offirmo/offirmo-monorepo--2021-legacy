"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
/////////////////////
const GainType = typescript_string_enums_1.Enum(
// Note: must match properties in Adventure['gains']
'level', 'health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck', 'coin', 'token', 'weapon', 'armor', 'weapon_improvement', 'armor_improvement');
exports.GainType = GainType;
/////////////////////
//# sourceMappingURL=types.js.map