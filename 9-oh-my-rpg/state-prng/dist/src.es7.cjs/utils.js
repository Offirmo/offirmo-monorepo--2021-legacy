"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const consts_1 = require("./consts");
/////////////////////
// useful for re-seeding
function generate_random_seed() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return random_1.Random.integer(-2147483646, 2147483647)(rng); // doc is unclear about allowed bounds...
}
exports.generate_random_seed = generate_random_seed;
function regenerate_until_not_recently_encountered({ id, generate, state, max_tries, }) {
    const recently_encountered = state.recently_encountered_by_id[id] || [];
    // Intelligently computes a reasonable max_tries.
    // Best effort, we would need the complete generation range to come up with a proper number.
    max_tries = max_tries || Math.max(10, recently_encountered.length * 10);
    let generated = generate();
    let try_count = 1;
    while (recently_encountered.includes(generated) && try_count < max_tries) {
        generated = generate();
        try_count++;
    }
    if (try_count >= max_tries) {
        console.error(state);
        throw new Error(`${consts_1.LIB}: regenerate_until_not_recently_encountered(): failed after maximum tries!`);
    }
    return generated;
}
exports.regenerate_until_not_recently_encountered = regenerate_until_not_recently_encountered;
/////////////////////
//# sourceMappingURL=utils.js.map