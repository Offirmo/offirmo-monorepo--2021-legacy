"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/////////////////////
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const ProgressState = tslib_1.__importStar(require("@oh-my-rpg/state-progress"));
const play_good_1 = require("./play_good");
const play_bad_1 = require("./play_bad");
const achievements_1 = require("../achievements");
/////////////////////
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    const energy_snapshot = EnergyState.get_snapshot(state.energy);
    const good = energy_snapshot.available_energy >= 1;
    state = good
        ? Object.assign({}, play_good_1.play_good(state, explicit_adventure_archetype_hid), { energy: EnergyState.use_energy(state.energy) }) : Object.assign({}, play_bad_1.play_bad(state, explicit_adventure_archetype_hid), { energy: EnergyState.loose_all_energy(state.energy) });
    state = Object.assign({}, state, { progress: ProgressState.on_played(state.progress, {
            good,
            adventure_key: state.last_adventure.hid,
            encountered_monster_key: state.last_adventure.encounter
                ? state.last_adventure.encounter.name
                : null,
            active_class: state.avatar.klass,
        }), revision: state.revision + 1 });
    return achievements_1._refresh_achievements(state);
}
exports.play = play;
/////////////////////
//# sourceMappingURL=index.js.map