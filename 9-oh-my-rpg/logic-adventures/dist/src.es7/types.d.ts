import { Enum } from 'typescript-string-enums';
declare const CoinsGain: {
    none: "none";
    small: "small";
    medium: "medium";
    big: "big";
    huge: "huge";
};
declare type CoinsGain = Enum<typeof CoinsGain>;
declare const AdventureType: {
    story: "story";
    fight: "fight";
};
declare type AdventureType = Enum<typeof AdventureType>;
interface AdventureArchetype {
    hid: string;
    type: AdventureType;
    good: boolean;
    outcome: {
        level: boolean;
        health: boolean;
        mana: boolean;
        strength: boolean;
        agility: boolean;
        charisma: boolean;
        wisdom: boolean;
        luck: boolean;
        random_charac: boolean;
        lowest_charac: boolean;
        class_main_charac: boolean;
        class_secondary_charac: boolean;
        coin: CoinsGain;
        token: number;
        armor: boolean;
        weapon: boolean;
        armor_or_weapon: boolean;
        armor_improvement: boolean;
        weapon_improvement: boolean;
        armor_or_weapon_improvement: boolean;
    };
}
declare type OutcomeArchetype = AdventureArchetype['outcome'];
export { CoinsGain, AdventureType, AdventureArchetype, OutcomeArchetype };
