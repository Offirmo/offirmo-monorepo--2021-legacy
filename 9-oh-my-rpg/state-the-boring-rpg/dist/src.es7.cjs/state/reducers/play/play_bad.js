"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/////////////////////
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_adventures_1 = require("@oh-my-rpg/logic-adventures");
/////////////////////
const consts_1 = require("../../../consts");
const play_adventure_1 = require("./play_adventure");
/////////////////////
const ADVENTURE_BAD_NON_REPETITION_ID = 'adventure_archetype--bad';
const ADVENTURE_BAD_NON_REPETITION_COUNT = 2;
function pick_random_non_repetitive_bad_archetype(state, rng) {
    let archetype;
    state_prng_1.regenerate_until_not_recently_encountered({
        id: ADVENTURE_BAD_NON_REPETITION_ID,
        generate: () => {
            archetype = logic_adventures_1.pick_random_bad_archetype(rng);
            return archetype.hid;
        },
        state: state.prng,
        max_tries: ADVENTURE_BAD_NON_REPETITION_COUNT * 10,
    });
    return archetype;
}
function play_bad(state, explicit_adventure_archetype_hid) {
    let prng_state = state.prng;
    const rng = state_prng_1.get_prng(prng_state);
    const aa = explicit_adventure_archetype_hid
        ? logic_adventures_1.get_archetype(explicit_adventure_archetype_hid)
        : pick_random_non_repetitive_bad_archetype(state, rng);
    if (!aa)
        throw new Error(`${consts_1.LIB}: play_bad(): hinted adventure archetype "${explicit_adventure_archetype_hid}" could not be found!`);
    if (aa.good) // this feature is for test only, so means wrong test
        throw new Error(`${consts_1.LIB}: play_bad(): hinted adventure archetype "${explicit_adventure_archetype_hid}" is a "good click" one!`);
    if (!explicit_adventure_archetype_hid) {
        prng_state = PRNGState.update_use_count(state.prng, rng);
    }
    state = Object.assign({}, state, { prng: state_prng_1.register_recently_used(prng_state, ADVENTURE_BAD_NON_REPETITION_ID, aa.hid, ADVENTURE_BAD_NON_REPETITION_COUNT) });
    state = Object.assign({}, play_adventure_1.play_adventure(state, aa));
    return state;
}
exports.play_bad = play_bad;
/////////////////////
//# sourceMappingURL=play_bad.js.map