import { Enum } from 'typescript-string-enums';
declare const MonsterRank: {
    common: "common";
    elite: "elite";
    boss: "boss";
};
declare type MonsterRank = Enum<typeof MonsterRank>;
interface Monster {
    name: string;
    level: number;
    rank: MonsterRank;
    possible_emoji: string;
}
export { MonsterRank, Monster };
