import { Enum } from 'typescript-string-enums';
/////////////////////
const CharacterAttribute = Enum(
// TODO improve
'agility', 'health', 'level', 'luck', 'mana', 'strength', 'charisma', 'wisdom');
const CharacterClass = Enum(
// TODO more classes https://en.wikipedia.org/wiki/Character_class_(Dungeons_%26_Dragons)
'novice', 'warrior', 'barbarian', 'paladin', 'sculptor', 'pirate', 'ninja', 'rogue', 'wizard', 'hunter', 'druid', 'priest');
/////////////////////
export { CharacterAttribute, CharacterClass, };
/////////////////////
//# sourceMappingURL=types.js.map