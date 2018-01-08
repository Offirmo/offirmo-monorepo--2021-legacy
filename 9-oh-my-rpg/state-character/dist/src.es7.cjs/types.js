"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
/////////////////////
const CharacterAttribute = typescript_string_enums_1.Enum('agility', 'health', 'level', 'luck', 'mana', 'strength', 'charisma', 'wisdom');
exports.CharacterAttribute = CharacterAttribute;
const CharacterClass = typescript_string_enums_1.Enum('novice', 'warrior', 'barbarian', 'paladin', 'sculptor', 'pirate', 'ninja', 'rogue', 'wizard', 'hunter', 'druid', 'priest');
exports.CharacterClass = CharacterClass;
/////////////////////
//# sourceMappingURL=types.js.map