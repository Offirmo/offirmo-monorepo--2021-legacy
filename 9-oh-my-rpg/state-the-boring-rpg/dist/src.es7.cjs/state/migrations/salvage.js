"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const state_character_1 = require("@oh-my-rpg/state-character");
const consts_1 = require("../../consts");
const reducers_1 = require("../reducers");
/////////////////////
// https://github.com/burakcan/mb
// Exception-free nested nullable attribute accessor
const mb = (...p) => (o) => p.map((c) => (o = (o || {})[c])) && o;
function coerce_to_number_or_zero(x) {
    let res = Number(x);
    return Number.isNaN(res) ? 0 : res;
}
const get_name = mb('avatar', 'name');
const get_class = mb('avatar', 'klass');
const get_seed = mb('prng', 'seed');
const get_good_play_count_v4 = mb('good_click_count');
const get_good_play_count_v7 = mb('progress', 'statistics', 'good_play_count');
const get_good_play_count = (ls) => coerce_to_number_or_zero(get_good_play_count_v7(ls)
    || get_good_play_count_v4(ls));
const get_play_count_v4 = mb('click_count');
const get_bad_play_count_v4 = (ls) => coerce_to_number_or_zero(get_play_count_v4(ls)) - coerce_to_number_or_zero(get_good_play_count_v4(ls));
const get_bad_play_count_v7 = mb('progress', 'statistics', 'bad_play_count');
const get_bad_play_count = (ls) => coerce_to_number_or_zero(get_bad_play_count_v7(ls)
    || get_bad_play_count_v4(ls));
/////////////////////
function reset_and_salvage(legacy_state) {
    state_prng_1.xxx_internal_reset_prng_cache(); // don't do this at home, kids!
    let state = reducers_1.create();
    // TODO salvage prng?
    // TODO reseed?
    const seed = get_seed(legacy_state);
    if (!Number.isInteger(seed)) {
        console.warn(`${consts_1.LIB}: salvaging: may need to update the seed salvaging!`);
        state = reducers_1.reseed(state); // force random reseed to avoid pp having the same game
    }
    else {
        state = reducers_1.reseed(state, seed);
    }
    const name = get_name(legacy_state);
    if (typeof name !== 'string') {
        console.warn(`${consts_1.LIB}: salvaging: may need to update the avatar name salvaging!`);
    }
    else {
        state = reducers_1.rename_avatar(state, name);
    }
    const klass = get_class(legacy_state);
    if (typeof klass !== 'string' || !typescript_string_enums_1.Enum.isType(state_character_1.CharacterClass, klass)) {
        console.warn(`${consts_1.LIB}: salvaging: may need to update the avatar class salvaging!`);
    }
    else {
        state = reducers_1.change_avatar_class(state, klass);
    }
    state = reducers_1.autoplay(state, {
        target_good_play_count: get_good_play_count(legacy_state),
        target_bad_play_count: get_bad_play_count(legacy_state),
    });
    console.info(`${consts_1.LIB}: salvaging: salvaged some savegame data.`);
    return state;
}
exports.reset_and_salvage = reset_and_salvage;
//# sourceMappingURL=salvage.js.map