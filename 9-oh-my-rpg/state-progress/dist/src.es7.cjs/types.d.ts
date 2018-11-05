import { Enum } from 'typescript-string-enums';
declare const AchievementStatus: {
    hidden: "hidden";
    revealed: "revealed";
    unlocked: "unlocked";
};
declare type AchievementStatus = Enum<typeof AchievementStatus>;
interface AchievementDefinition {
    name: string;
    icon: string;
    description: string;
    lore?: string;
    get_status: (stats: State) => AchievementStatus;
}
interface State {
    schema_version: number;
    revision: number;
    wiki: null;
    flags: null;
    achievements: {
        [key: string]: AchievementStatus;
    };
    statistics: {
        good_play_count: number;
        bad_play_count: number;
        encountered_monsters: {
            [key: string]: true;
        };
        encountered_adventures: {
            [key: string]: true;
        };
        good_play_count_by_active_class: {
            [klass: string]: number;
        };
        bad_play_count_by_active_class: {
            [klass: string]: number;
        };
        has_account: boolean;
        is_registered_alpha_player: boolean;
    };
}
export { AchievementStatus, AchievementDefinition, State, };
