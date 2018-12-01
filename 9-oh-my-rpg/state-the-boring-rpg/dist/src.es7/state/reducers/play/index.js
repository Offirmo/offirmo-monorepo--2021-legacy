/////////////////////
/////////////////////
import * as EnergyState from '@oh-my-rpg/state-energy';
import * as ProgressState from '@oh-my-rpg/state-progress';
import { play_good } from './play_good';
import { play_bad } from './play_bad';
import { _refresh_achievements } from '../achievements';
/////////////////////
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    const energy_snapshot = EnergyState.get_snapshot(state.energy);
    const good = energy_snapshot.available_energy >= 1;
    state = good
        ? Object.assign({}, play_good(state, explicit_adventure_archetype_hid), { energy: EnergyState.use_energy(state.energy) }) : Object.assign({}, play_bad(state, explicit_adventure_archetype_hid), { energy: EnergyState.loose_all_energy(state.energy) });
    state = Object.assign({}, state, { progress: ProgressState.on_played(state.progress, {
            good,
            adventure_key: state.last_adventure.hid,
            encountered_monster_key: state.last_adventure.encounter
                ? state.last_adventure.encounter.name
                : null,
            active_class: state.avatar.klass,
        }), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
/////////////////////
export { play, };
/////////////////////
//# sourceMappingURL=index.js.map