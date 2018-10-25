/////////////////////
/////////////////////
import * as PRNGState from '@oh-my-rpg/state-prng';
import { get_prng, register_recently_used, regenerate_until_not_recently_encountered, } from '@oh-my-rpg/state-prng';
import { get_archetype, pick_random_good_archetype, } from '@oh-my-rpg/logic-adventures';
/////////////////////
import { LIB } from '../consts';
import { play_adventure } from './play_adventure';
/////////////////////
const ADVENTURE_GOOD_NON_REPETITION_ID = 'adventure_archetype--good';
const ADVENTURE_GOOD_NON_REPETITION_COUNT = 20;
function pick_random_non_repetitive_good_archetype(state, rng) {
    let archetype;
    regenerate_until_not_recently_encountered({
        id: ADVENTURE_GOOD_NON_REPETITION_ID,
        generate: () => {
            archetype = pick_random_good_archetype(rng);
            return archetype.hid;
        },
        state: state.prng,
    });
    return archetype;
}
function play_good(state, explicit_adventure_archetype_hid) {
    let prng_state = state.prng;
    const rng = get_prng(prng_state);
    const aa = explicit_adventure_archetype_hid
        ? get_archetype(explicit_adventure_archetype_hid)
        : pick_random_non_repetitive_good_archetype(state, rng);
    if (!aa)
        throw new Error(`${LIB}: play_good(): hinted adventure archetype "${explicit_adventure_archetype_hid}" could not be found!`);
    if (!aa.good) // this feature is for test only, so means wrong test
        throw new Error(`${LIB}: play_good(): hinted adventure archetype "${explicit_adventure_archetype_hid}" is a "bad click" one!`);
    if (!explicit_adventure_archetype_hid) {
        prng_state = PRNGState.update_use_count(state.prng, rng);
    }
    state = Object.assign({}, state, { prng: register_recently_used(prng_state, ADVENTURE_GOOD_NON_REPETITION_ID, aa.hid, ADVENTURE_GOOD_NON_REPETITION_COUNT) });
    state = Object.assign({}, play_adventure(state, aa), { good_click_count: state.good_click_count + 1 });
    return state;
}
/////////////////////
export { play_good, };
/////////////////////
//# sourceMappingURL=play_good.js.map