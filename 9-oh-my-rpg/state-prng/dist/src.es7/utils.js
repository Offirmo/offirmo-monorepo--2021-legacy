/////////////////////
import { Random } from '@offirmo/random';
import { LIB } from './consts';
/////////////////////
// useful for re-seeding
function generate_random_seed() {
    const rng = Random.engines.mt19937().autoSeed();
    return Random.integer(-2147483646, 2147483647)(rng); // doc is unclear about allowed bounds...
}
function regenerate_until_not_recently_encountered({ id, generate, state, max_tries = 10, }) {
    const recently_encountered = state.recently_encountered_by_id[id] || [];
    let generated = generate();
    let try_count = 1;
    while (recently_encountered.includes(generated) && try_count < max_tries) {
        generated = generate();
        try_count++;
    }
    if (try_count >= max_tries) {
        console.error(state);
        throw new Error(`${LIB}: regenerate_until_not_recently_encountered(): failed after maximum tries!`);
    }
    return generated;
}
/////////////////////
export { generate_random_seed, regenerate_until_not_recently_encountered, };
/////////////////////
//# sourceMappingURL=utils.js.map