"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const definitions_1 = require("@oh-my-rpg/definitions");
const types_1 = require("./types");
const data_1 = require("./data");
/////////////////////
function pick_random_rank(rng) {
    // on 10 times, 1 boss, 2 elites, 7 common
    return random_1.Random.bool(0.7)(rng)
        ? types_1.MonsterRank.common
        : random_1.Random.bool(2 / 3.)(rng)
            ? types_1.MonsterRank.elite
            : types_1.MonsterRank.boss;
}
/////////////////////
const MONSTER_RELATIVE_LEVEL_SPREAD = 0.1;
function create(rng, hints = {}) {
    const raw = hints.name
        ? data_1.ENTRIES.find(raw_monster => raw_monster.name === hints.name)
        : random_1.Random.pick(rng, data_1.ENTRIES);
    if (!raw)
        throw new Error(`OMR Monster create: can't find a monster corresponding to hint "${hints.name}"!`);
    let level = -1;
    if (!hints.level)
        level = random_1.Random.integer(1, definitions_1.MAX_LEVEL)(rng);
    else {
        // stay close to the given level
        const reference_level = hints.level;
        const variation = Math.round(Math.max(1, reference_level * MONSTER_RELATIVE_LEVEL_SPREAD));
        level = Math.max(1, Math.min(definitions_1.MAX_LEVEL, reference_level + random_1.Random.integer(-variation, variation)(rng)));
    }
    return {
        name: raw.name,
        level,
        rank: hints.rank || pick_random_rank(rng),
        possible_emoji: hints.possible_emoji || raw.emoji,
    };
}
exports.create = create;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_monster() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return create(rng);
}
exports.generate_random_demo_monster = generate_random_demo_monster;
const DEMO_MONSTER_01 = {
    name: 'chicken',
    level: 7,
    rank: types_1.MonsterRank.elite,
    possible_emoji: '🐓',
};
exports.DEMO_MONSTER_01 = DEMO_MONSTER_01;
/////////////////////
//# sourceMappingURL=factory.js.map