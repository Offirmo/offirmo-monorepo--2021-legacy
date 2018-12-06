import { Enum } from 'typescript-string-enums';
import { Element } from '@oh-my-rpg/definitions';
import { HumanReadableTimestampUTCDays } from '@offirmo/timestamps';
declare const AchievementStatus: {
    secret: "secret";
    hidden: "hidden";
    revealed: "revealed";
    unlocked: "unlocked";
};
declare type AchievementStatus = Enum<typeof AchievementStatus>;
interface AchievementDefinition<S> {
    session_uuid: string;
    name: string;
    icon: string;
    description: string;
    lore?: string;
    get_status: (state: S) => AchievementStatus;
    get_completion_rate?: (state: S) => [number, number];
}
interface AchievementSnapshot extends Element {
    name: string;
    icon: string;
    description: string;
    lore?: string;
    status: AchievementStatus;
    completion_rate?: [number, number];
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
        last_visited_timestamp: HumanReadableTimestampUTCDays;
        active_day_count: number;
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
        coins_gained: number;
        tokens_gained: number;
        items_gained: number;
        has_account: boolean;
        is_registered_alpha_player: boolean;
    };
}
export { AchievementSnapshot, AchievementStatus, AchievementDefinition, State, };
