"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const timestamps_1 = require("@offirmo/timestamps");
const consts_1 = require("./consts");
const sec_1 = require("./sec");
/////////////////////
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            wiki: null,
            flags: null,
            achievements: {},
            statistics: {
                last_visited_timestamp: timestamps_1.get_human_readable_UTC_timestamp_days(),
                active_day_count: 1,
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
exports.create = create;
/////////////////////
function _on_activity(state, previous_revision) {
    const new_state = Object.assign({}, state, { statistics: Object.assign({}, state.statistics, { last_visited_timestamp: timestamps_1.get_human_readable_UTC_timestamp_days() }), revision: previous_revision + 1 });
    const is_new_day = state.statistics.last_visited_timestamp !== new_state.statistics.last_visited_timestamp;
    if (!is_new_day)
        return state; // FOR NOW?
    new_state.statistics.active_day_count = (new_state.statistics.active_day_count || 0) + 1;
    return new_state;
}
function on_start_session(state) {
    return _on_activity(state, state.revision);
}
exports.on_start_session = on_start_session;
function on_played(state, details) {
    const { good, adventure_key, encountered_monster_key, active_class } = details;
    const new_state = Object.assign({}, state, { 
        // mutate the root of fields we'll change below
        statistics: Object.assign({}, state.statistics), revision: state.revision + 1 });
    if (!new_state.statistics.encountered_adventures[adventure_key]) {
        new_state.statistics.encountered_adventures = Object.assign({}, new_state.statistics.encountered_adventures, { [adventure_key]: true });
    }
    if (good) {
        new_state.statistics.good_play_count++;
        new_state.statistics.good_play_count_by_active_class = Object.assign({ 
            // ensure the key is present + immutable
            [active_class]: 0 }, new_state.statistics.good_play_count_by_active_class);
        new_state.statistics.good_play_count_by_active_class[active_class]++;
    }
    else {
        new_state.statistics.bad_play_count++;
        new_state.statistics.bad_play_count_by_active_class = Object.assign({ 
            // ensure the key is present + immutable
            [active_class]: 0 }, new_state.statistics.bad_play_count_by_active_class);
        new_state.statistics.bad_play_count_by_active_class[active_class]++;
    }
    if (encountered_monster_key && !new_state.statistics.encountered_monsters[encountered_monster_key]) {
        new_state.statistics.encountered_monsters = Object.assign({}, new_state.statistics.encountered_monsters, { [encountered_monster_key]: true });
    }
    return _on_activity(new_state, state.revision);
}
exports.on_played = on_played;
/////////////////////
function on_achieved(state, key, new_status) {
    const new_state = Object.assign({}, state, { achievements: Object.assign({}, state.achievements, { [key]: new_status }), revision: state.revision + 1 });
    return _on_activity(new_state, state.revision);
}
exports.on_achieved = on_achieved;
/////////////////////
//# sourceMappingURL=state.js.map