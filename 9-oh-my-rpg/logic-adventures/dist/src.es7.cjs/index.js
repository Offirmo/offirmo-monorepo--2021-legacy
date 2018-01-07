"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const types_1 = require("./types");
exports.CoinsGain = types_1.CoinsGain;
exports.AdventureType = types_1.AdventureType;
const data_1 = require("./data");
exports.i18n_messages = data_1.i18n_messages;
/////////////////////
const ALL_ADVENTURE_ARCHETYPES = data_1.ENTRIES
    .filter(paa => (paa.isPublished !== false))
    .map(paa => {
    const raw_outcome = paa.outcome || {};
    const outcome = {
        level: !!raw_outcome.level,
        agility: !!raw_outcome.agility,
        health: !!raw_outcome.health,
        luck: !!raw_outcome.luck,
        mana: !!raw_outcome.mana,
        strength: !!raw_outcome.strength,
        charisma: !!raw_outcome.charisma,
        wisdom: !!raw_outcome.wisdom,
        random_charac: !!raw_outcome.random_charac,
        lowest_charac: !!raw_outcome.lowest_charac,
        class_main_charac: !!raw_outcome.class_main_charac,
        class_secondary_charac: !!raw_outcome.class_secondary_charac,
        coin: raw_outcome.coin || types_1.CoinsGain.none,
        token: raw_outcome.token || 0,
        armor: !!raw_outcome.armor,
        weapon: !!raw_outcome.weapon,
        armor_or_weapon: !!raw_outcome.armor_or_weapon,
        armor_improvement: !!raw_outcome.armor_improvement,
        weapon_improvement: !!raw_outcome.weapon_improvement,
        armor_or_weapon_improvement: !!raw_outcome.armor_or_weapon_improvement,
    };
    const aa = {
        hid: paa.hid,
        good: paa.good,
        type: paa.type,
        outcome,
    };
    return aa;
});
exports.ALL_ADVENTURE_ARCHETYPES = ALL_ADVENTURE_ARCHETYPES;
const ALL_BAD_ADVENTURE_ARCHETYPES = ALL_ADVENTURE_ARCHETYPES.filter(aa => !aa.good);
exports.ALL_BAD_ADVENTURE_ARCHETYPES = ALL_BAD_ADVENTURE_ARCHETYPES;
const ALL_GOOD_ADVENTURE_ARCHETYPES = ALL_ADVENTURE_ARCHETYPES.filter(aa => aa.good);
exports.ALL_GOOD_ADVENTURE_ARCHETYPES = ALL_GOOD_ADVENTURE_ARCHETYPES;
const GOOD_ADVENTURE_ARCHETYPES_BY_TYPE = {
    story: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === types_1.AdventureType.story),
    fight: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === types_1.AdventureType.fight),
};
exports.GOOD_ADVENTURE_ARCHETYPES_BY_TYPE = GOOD_ADVENTURE_ARCHETYPES_BY_TYPE;
const COINS_GAIN_MULTIPLIER_PER_LEVEL = 1.1;
const COINS_GAIN_RANGES = {
    none: [0, 0],
    small: [1, 20],
    medium: [50, 100],
    big: [500, 700],
    huge: [900, 2000],
};
(function checkDataSanity() {
    if (ALL_ADVENTURE_ARCHETYPES.length < 20) {
        console.error(ALL_ADVENTURE_ARCHETYPES);
        throw new Error(`Data sanity failure: ALL_ADVENTURE_ARCHETYPES`);
    }
    if (ALL_BAD_ADVENTURE_ARCHETYPES.length !== 1)
        throw new Error(`Data sanity failure: ALL_BAD_ADVENTURE_ARCHETYPES`);
    if (ALL_GOOD_ADVENTURE_ARCHETYPES.length < 20)
        throw new Error(`Data sanity failure: ALL_GOOD_ADVENTURE_ARCHETYPES`);
    if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight.length !== 5) {
        console.error(GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight);
        throw new Error(`Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight`);
    }
    if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story.length < 20)
        throw new Error(`Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story`);
})();
/////////////////////
// useful for picking an exact archetype (ex. tests)
function get_archetype(hid) {
    const aa = ALL_ADVENTURE_ARCHETYPES.find(aa => aa.hid === hid);
    if (!aa)
        throw new Error(`logic-adventures, get_archetype(): couldn't find archetype "${hid}" !`);
    return aa;
}
exports.get_archetype = get_archetype;
const FIGHT_ENCOUNTER_RATIO = 0.33;
function pick_random_good_archetype(rng) {
    return random_1.Random.bool(FIGHT_ENCOUNTER_RATIO)(rng)
        ? random_1.Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight)
        : random_1.Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story);
}
exports.pick_random_good_archetype = pick_random_good_archetype;
function pick_random_bad_archetype(rng) {
    return random_1.Random.pick(rng, ALL_BAD_ADVENTURE_ARCHETYPES);
}
exports.pick_random_bad_archetype = pick_random_bad_archetype;
function generate_random_coin_gain(rng, range, player_level) {
    if (range === types_1.CoinsGain.none)
        return 0;
    const level_multiplier = player_level * COINS_GAIN_MULTIPLIER_PER_LEVEL;
    const interval = COINS_GAIN_RANGES[range];
    return random_1.Random.integer(interval[0] * level_multiplier, interval[1] * level_multiplier)(rng);
}
exports.generate_random_coin_gain = generate_random_coin_gain;
/////////////////////
//# sourceMappingURL=index.js.map