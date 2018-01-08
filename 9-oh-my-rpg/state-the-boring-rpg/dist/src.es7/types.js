import { Enum } from 'typescript-string-enums';
/////////////////////
const GainType = Enum(
// Note: must match properties in Adventure['gains']
'level', 'health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck', 'coin', 'token', 'weapon', 'armor', 'weapon_improvement', 'armor_improvement');
/////////////////////
export { GainType, };
/////////////////////
//# sourceMappingURL=types.js.map