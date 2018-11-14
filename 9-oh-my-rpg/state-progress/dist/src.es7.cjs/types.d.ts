import { Enum } from 'typescript-string-enums';
import { Element } from '@oh-my-rpg/definitions';
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
}
interface AchievementSnapshot extends Element {
    name: string;
    icon: string;
    description: string;
    lore?: string;
    status: AchievementStatus;
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
export { AchievementSnapshot, AchievementStatus, AchievementDefinition, State, };
