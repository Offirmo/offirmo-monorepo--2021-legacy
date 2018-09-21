import { Enum } from 'typescript-string-enums';
declare const AchievementStatus: {
    hidden: "hidden";
    revealed: "revealed";
    unlocked: "unlocked";
};
declare type AchievementStatus = Enum<typeof AchievementStatus>;
interface Statistics {
}
interface AchievementDefinition {
    key: string;
    name: string;
    description: string;
    lore?: string;
    sorting_rank: number;
    get_status: (stats: Statistics) => AchievementStatus;
}
interface AchievementEntry {
    key: string;
    status: AchievementStatus;
}
interface State {
    schema_version: number;
    revision: number;
    statistics: Statistics;
}
export { AchievementStatus, Statistics, AchievementDefinition, AchievementEntry, State, };
