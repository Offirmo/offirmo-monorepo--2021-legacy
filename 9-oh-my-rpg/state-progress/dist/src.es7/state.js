/////////////////////
import { get_human_readable_UTC_timestamp_days } from '@offirmo/timestamps';
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
                last_visited_timestamp: get_human_readable_UTC_timestamp_days(),
                active_day_count: 1,
                good_play_count: 0,
                bad_play_count: 0,
                encountered_adventures: {},
                encountered_monsters: {},
                good_play_count_by_active_class: {},
                bad_play_count_by_active_class: {},
                coins_gained: 0,
                tokens_gained: 0,
                items_gained: 0,
                has_account: false,
                is_registered_alpha_player: false,
            }
        });
    });
}
/////////////////////
function _on_activity(state, previous_revision) {
    const new_state = Object.assign({}, state, { statistics: Object.assign({}, state.statistics, { last_visited_timestamp: get_human_readable_UTC_timestamp_days() }), revision: previous_revision + 1 });
    const is_new_day = state.statistics.last_visited_timestamp !== new_state.statistics.last_visited_timestamp;
    if (!is_new_day)
        return state; // FOR NOW?
    new_state.statistics.active_day_count = (new_state.statistics.active_day_count || 0) + 1;
    return new_state;
}
function on_played(state, details) {
    const { good, adventure_key, encountered_monster_key, active_class, coins_gained, tokens_gained, items_gained, } = details;
    const new_state = Object.assign({}, state, { 
        // mutate the root of fields we'll change below
        statistics: Object.assign({}, state.statistics), revision: state.revision + 1 });
    // shortcut
    let stats = new_state.statistics;
    if (!stats.encountered_adventures[adventure_key]) {
        stats.encountered_adventures = Object.assign({}, stats.encountered_adventures, { [adventure_key]: true });
    }
    if (good) {
        stats.good_play_count++;
        stats.good_play_count_by_active_class = Object.assign({ 
            // ensure the key is present + immutable
            [active_class]: 0 }, stats.good_play_count_by_active_class);
        stats.good_play_count_by_active_class[active_class]++;
    }
    else {
        stats.bad_play_count++;
        stats.bad_play_count_by_active_class = Object.assign({ 
            // ensure the key is present + immutable
            [active_class]: 0 }, stats.bad_play_count_by_active_class);
        stats.bad_play_count_by_active_class[active_class]++;
    }
    if (encountered_monster_key && !stats.encountered_monsters[encountered_monster_key]) {
        stats.encountered_monsters = Object.assign({}, stats.encountered_monsters, { [encountered_monster_key]: true });
    }
    stats.coins_gained += coins_gained;
    stats.tokens_gained += tokens_gained;
    stats.items_gained += items_gained;
    return _on_activity(new_state, state.revision);
}
/////////////////////
function on_achieved(state, key, new_status) {
    const new_state = Object.assign({}, state, { achievements: Object.assign({}, state.achievements, { [key]: new_status }), revision: state.revision + 1 });
    return _on_activity(new_state, state.revision);
}
/////////////////////
export { create, on_played, on_achieved, };
/////////////////////
//# sourceMappingURL=state.js.map