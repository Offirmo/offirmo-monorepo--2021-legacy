interface State {
    schema_version: number;
    revision: number;
    flags: null;
    achievements: null;
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
export { State, };
