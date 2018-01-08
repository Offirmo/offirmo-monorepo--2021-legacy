import { Enum } from 'typescript-string-enums';
/////////////////////
const CharacterAttribute = Enum('agility', 'health', 'level', 'luck', 'mana', 'strength', 'charisma', 'wisdom');
const CharacterClass = Enum('novice', 'warrior', 'barbarian', 'paladin', 'sculptor', 'pirate', 'ninja', 'rogue', 'wizard', 'hunter', 'druid', 'priest');
/////////////////////
export { CharacterAttribute, CharacterClass, };
/////////////////////
//# sourceMappingURL=types.js.map