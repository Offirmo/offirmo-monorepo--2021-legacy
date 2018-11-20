"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
/////////////////////
function create(rng) {
    // TODO one day
}
exports.create = create;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_shop() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return create(rng);
}
exports.generate_random_demo_shop = generate_random_demo_shop;
/////////////////////
//# sourceMappingURL=state.js.map