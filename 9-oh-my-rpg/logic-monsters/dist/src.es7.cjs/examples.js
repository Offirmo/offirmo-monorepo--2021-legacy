"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const state_1 = require("./state");
const types_1 = require("./types");
/////////////////////
const DEMO_MONSTER_01 = {
    name: 'chicken',
    level: 7,
    rank: types_1.MonsterRank.elite,
    possible_emoji: '🐓',
};
exports.DEMO_MONSTER_01 = DEMO_MONSTER_01;
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_monster() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return state_1.create(rng);
}
exports.generate_random_demo_monster = generate_random_demo_monster;
/////////////////////
//# sourceMappingURL=examples.js.map