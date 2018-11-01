"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const sec_1 = require("./sec");
/////////////////////
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            flags: null,
            achievements: null,
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
exports.create = create;
function on_played(state, details) {
    const { good, adventure_key, encountered_monster_key, active_class } = details;
    const new_state = Object.assign({}, state, { 
        // mutate the root fields we'll change below
        statistics: Object.assign({}, state.statistics) });
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
    if (encountered_monster_key && !state.statistics.encountered_monsters[encountered_monster_key]) {
        new_state.statistics.encountered_monsters = Object.assign({}, new_state.statistics.encountered_monsters, { [encountered_monster_key]: true });
    }
    return Object.assign({}, new_state, { revision: state.revision + 1 });
}
exports.on_played = on_played;
/////////////////////
//# sourceMappingURL=state.js.map