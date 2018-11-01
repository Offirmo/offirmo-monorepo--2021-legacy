/////////////////////
import { Random } from '@offirmo/random';
import { LIB, SCHEMA_VERSION } from './consts';
/////////////////////
const DEFAULT_SEED = 987;
function create({ seed } = {}) {
    return {
        schema_version: SCHEMA_VERSION,
        revision: 0,
        // using a default seed makes unit tests easier
        seed: seed || DEFAULT_SEED,
        use_count: 0,
        recently_encountered_by_id: {},
    };
}
/////////////////////
function set_seed(state, seed) {
    return Object.assign({}, state, { seed, use_count: 0, revision: state.revision + 1 });
}
function update_use_count(state, prng, options = {}) {
    const new_use_count = prng.getUseCount();
    if (new_use_count < state.use_count)
        throw new Error(`${LIB}: update PRNG state: count is lower than previous count, this is unexpected! Check your code!`);
    if (!options.I_swear_I_really_cant_know_whether_the_rng_was_used && new_use_count === state.use_count) {
        const stack = new Error(`[Warning] ${LIB}: update PRNG state: count hasn't changed = no random was generated! This is most likely a bug, check your code!`).stack;
        console.warn(stack);
    }
    if (prng !== cached_prng)
        throw new Error(`${LIB}: update PRNG state: internal error: passed prng is not the cached-singleton one!`);
    return Object.assign({}, state, { use_count: new_use_count, revision: state.revision + 1 });
}
function register_recently_used(state, id, value, max_memory_size) {
    if (max_memory_size === 0)
        return state;
    let recently_encountered = state.recently_encountered_by_id[id] || [];
    recently_encountered = recently_encountered.concat(value).slice(-max_memory_size);
    return Object.assign({}, state, { recently_encountered_by_id: Object.assign({}, state.recently_encountered_by_id, { [id]: recently_encountered }), revision: state.revision + 1 });
}
/////////////////////
// since
// - we MUST use only one, repeatable PRNG
// - we can't store the prng in the state
// - we must configure it once at start
// we use a global cache to not having to recreate the prng each time.
// Still, we control that the usage conforms to those expectations.
let cached_prng = null;
let cached_prng_was_updated_once = false;
function xxx_internal_reset_prng_cache() {
    //console.trace('xxx_internal_reset_prng_cache')
    cached_prng = Random.engines.mt19937().seed(DEFAULT_SEED);
    cached_prng._seed = DEFAULT_SEED;
    cached_prng_was_updated_once = false;
}
xxx_internal_reset_prng_cache();
// WARNING this method has expectations ! (see above)
function get_prng(state) {
    /*console.trace('get PRNG', {
        state,
        cached_prng,
        'cached_prng.getUseCount()': cached_prng.getUseCount(),
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
            throw new Error(`${LIB}: get_prng(): unexpected case: cached implementation need to be fast forwarded!`);
        cached_prng.discard(state.use_count);
        cached_prng_updated = true;
    }
    if (cached_prng_updated) {
        // should never happen if we correctly update the prng state after each use
        if (cached_prng_was_updated_once)
            throw new Error(`${LIB}: get_prng(): unexpected case: need to update again the prng!`);
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
/////////////////////
export { DEFAULT_SEED, create, set_seed, update_use_count, register_recently_used, get_prng, 
// exposed for testability, do not use !
xxx_internal_reset_prng_cache, };
/////////////////////
//# sourceMappingURL=state.js.map