/////////////////////
import { Random } from '@offirmo/random';
import * as deepFreeze from 'deep-freeze-strict'; // XXX to refactor
import { SCHEMA_VERSION } from './consts';
/////////////////////
const DEFAULT_SEED = 987;
function create() {
    return {
        schema_version: SCHEMA_VERSION,
        revision: 0,
        seed: DEFAULT_SEED,
        use_count: 0,
        recently_encountered_by_id: {},
    };
}
/////////////////////
function set_seed(state, seed) {
    state.seed = seed;
    state.use_count = 0;
    return state;
}
function update_use_count(state, prng, options = {}) {
    const new_use_count = prng.getUseCount();
    if (new_use_count < state.use_count)
        throw new Error(`update PRNG state: count is lower than previous count, this is unexpected! Check your code!`);
    if (!options.I_swear_I_really_cant_know_whether_the_rng_was_used && new_use_count === state.use_count)
        console.warn(`update PRNG state: count hasn't changed = no random was generated! This is most likely a bug, check your code!`);
    if (prng !== cached_prng)
        throw new Error(`update PRNG state: passed prng is not the cached one, this is unexpected!`);
    state.use_count = new_use_count;
    return state;
}
function register_recently_used(state, id, value, max_memory_size) {
    state.recently_encountered_by_id[id] = state.recently_encountered_by_id[id] || [];
    state.recently_encountered_by_id[id] = state.recently_encountered_by_id[id].concat(value).slice(-max_memory_size);
    return state;
}
/////////////////////
// since
// - we MUST use only one, repeatable PRNG
// - we can't store the prng in the state
// - we must configure it once at start
// we use a global cache to not recreate the prng each time.
// Still, we control that the usage conforms to those expectations.
let cached_prng = 'foo';
let cached_prng_was_updated_once = false;
xxx_internal_reset_prng_cache();
// WARNING this method has expectations ! (see above)
function get_prng(state) {
    /*console.log('get PRNG', {
        expected_seed: state.seed,
        expected_use_count: state.use_count,
        seed: cached_prng._seed,
        use_count: cached_prng.getUseCount(),
    })*/
    let cached_prng_updated = false;
    if (cached_prng._seed !== state.seed) {
        cached_prng.seed(state.seed);
        cached_prng._seed = state.seed; // maintain this extra property TODO improve the lib instead
        cached_prng_updated = true;
    }
    if (cached_prng.getUseCount() !== state.use_count) {
        // should never happen
        if (cached_prng.getUseCount() !== 0)
            throw new Error(`state-prng get_prng() unexpected case: cached implementation need to be fast forwarded!`);
        cached_prng.discard(state.use_count);
        cached_prng_updated = true;
    }
    if (cached_prng_updated) {
        // should never happen if we correctly update the prng state after each use
        if (cached_prng_was_updated_once)
            throw new Error(`state-prng unexpected case: need to update again the prng!`);
        // we allow a unique update at start
        // TODO filter default case?
        /*console.log('updated PRNG from init situation', {
            seed: cached_prng._seed,
            use_count: cached_prng.getUseCount(),
        })*/
        cached_prng_was_updated_once = true;
    }
    return cached_prng;
}
function xxx_internal_reset_prng_cache() {
    cached_prng = Random.engines.mt19937().seed(DEFAULT_SEED);
    cached_prng._seed = DEFAULT_SEED;
    cached_prng_was_updated_once = false;
}
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 108,
    seed: 1234,
    use_count: 107,
});
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    // no schema_version = 0
    seed: 1234,
    use_count: 107,
});
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v1: {
        revision: 108,
    },
});
/////////////////////
export { DEFAULT_SEED, create, set_seed, update_use_count, register_recently_used, get_prng, 
// exposed for testability, do not use !
xxx_internal_reset_prng_cache, DEMO_STATE, OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS, };
/////////////////////
//# sourceMappingURL=state.js.map