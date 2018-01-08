import { Enum } from 'typescript-string-enums';
declare const CharacterAttribute: {
    agility: "agility";
    health: "health";
    level: "level";
    luck: "luck";
    mana: "mana";
    strength: "strength";
    charisma: "charisma";
    wisdom: "wisdom";
};
declare type CharacterAttribute = Enum<typeof CharacterAttribute>;
declare const CharacterClass: {
    novice: "novice";
    warrior: "warrior";
    barbarian: "barbarian";
    paladin: "paladin";
    sculptor: "sculptor";
    pirate: "pirate";
    ninja: "ninja";
    rogue: "rogue";
    wizard: "wizard";
    hunter: "hunter";
    druid: "druid";
    priest: "priest";
};
declare type CharacterClass = Enum<typeof CharacterClass>;
interface CharacterAttributes {
    level: number;
    health: number;
    mana: number;
    strength: number;
    agility: number;
    charisma: number;
    wisdom: number;
    luck: number;
}
interface State {
    schema_version: number;
    revision: number;
    name: string;
    klass: CharacterClass;
    attributes: CharacterAttributes;
}
export { CharacterAttribute, CharacterClass, CharacterAttributes, State };
