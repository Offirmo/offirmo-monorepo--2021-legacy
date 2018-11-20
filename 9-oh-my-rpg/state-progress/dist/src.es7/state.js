/////////////////////
import { SCHEMA_VERSION } from './consts';
import { get_lib_SEC } from './sec';
/////////////////////
function create(SEC) {
    return get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: SCHEMA_VERSION,
            revision: 0,
            wiki: null,
            flags: null,
            achievements: {},
            statistics: {
                good_play_count: 0,
                bad_play_count: 0,
                encountered_adventures: {},
                encountered_monsters: {},
                good_play_count_by_active_class: {},
                bad_play_count_by_active_class: {},
                has_account: false,
                is_registered_alpha_player: false,
            }
        });
    });
}
function on_played(state, details) {
    const { good, adventure_key, encountered_monster_key, active_class } = details;
    state = Object.assign({}, state, { 
        // mutate the root of fields we'll change below
        statistics: Object.assign({}, state.statistics) });
    if (!state.statistics.encountered_adventures[adventure_key]) {
        state.statistics.encountered_adventures = Object.assign({}, state.statistics.encountered_adventures, { [adventure_key]: true });
    }
    if (good) {
        state.statistics.good_play_count++;
        state.statistics.good_play_count_by_active_class = Object.assign({ 
            // ensure the key is present + immutable
            [active_class]: 0 }, state.statistics.good_play_count_by_active_class);
        state.statistics.good_play_count_by_active_class[active_class]++;
    }
    else {
        state.statistics.bad_play_count++;
        state.statistics.bad_play_count_by_active_class = Object.assign({ 
            // ensure the key is present + immutable
            [active_class]: 0 }, state.statistics.bad_play_count_by_active_class);
        state.statistics.bad_play_count_by_active_class[active_class]++;
    }
    if (encountered_monster_key && !state.statistics.encountered_monsters[encountered_monster_key]) {
        state.statistics.encountered_monsters = Object.assign({}, state.statistics.encountered_monsters, { [encountered_monster_key]: true });
    }
    return Object.assign({}, state, { revision: state.revision + 1 });
}
/////////////////////
function on_achieved(state, key, new_status) {
    //console.log('on_achieved', key)
    return Object.assign({}, state, { achievements: Object.assign({}, state.achievements, { [key]: new_status }), revision: state.revision + 1 });
}
/////////////////////
export { create, on_played, on_achieved, };
/////////////////////
//# sourceMappingURL=state.js.map