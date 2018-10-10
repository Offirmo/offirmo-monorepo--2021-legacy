/////////////////////
// TODO
import { Random } from '@offirmo/random';
/////////////////////
function create(rng) {
    // TODO one day
}
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_shop() {
    const rng = Random.engines.mt19937().autoSeed();
    return create(rng);
}
/////////////////////
export { generate_random_demo_shop, create, };
/////////////////////
//# sourceMappingURL=state.js.map