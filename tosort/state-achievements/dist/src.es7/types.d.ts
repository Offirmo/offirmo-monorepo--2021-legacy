import { Enum } from 'typescript-string-enums';
interface Analytics {
    SEC: any;
    eventId: string;
    details: {
        [k: string]: string | number | undefined | null;
    };
}
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
export { Analytics, AchievementStatus, Statistics, AchievementDefinition, AchievementEntry, State, };
