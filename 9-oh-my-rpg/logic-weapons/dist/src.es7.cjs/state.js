"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const random_1 = require("@offirmo/random");
const data_1 = require("./data");
exports.i18n_messages = data_1.i18n_messages;
const consts_1 = require("./consts");
/////////////////////
function pick_random_quality(rng) {
    // common    =  400/1000
    // uncommon  =  389/1000
    // rare:     =  200/1000
    // epic:     =   10/1000
    // legendary =    1/1000
    let p = random_1.Random.integer(1, 1000)(rng);
    if (p <= 400)
        return definitions_1.ItemQuality.common;
    p -= 400;
    if (p <= 389)
        return definitions_1.ItemQuality.uncommon;
    p -= 389;
    if (p <= 200)
        return definitions_1.ItemQuality.rare;
    p -= 200;
    if (p <= 10)
        return definitions_1.ItemQuality.epic;
    return definitions_1.ItemQuality.legendary;
}
function pick_random_base(rng) {
    return random_1.Random.pick(rng, data_1.WEAPON_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return random_1.Random.pick(rng, data_1.WEAPON_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return random_1.Random.pick(rng, data_1.WEAPON_QUALIFIERS2).hid;
}
const pick_random_base_strength = random_1.Random.integer(consts_1.MIN_STRENGTH, consts_1.MAX_STRENGTH);
/////////////////////
function create(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    const base = definitions_1.create_item_base(definitions_1.InventorySlot.weapon, hints.quality || pick_random_quality(rng));
    return Object.assign({}, base, { base_hid: hints.base_hid || pick_random_base(rng), qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng), qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng), base_strength: hints.base_strength || pick_random_base_strength(rng), enhancement_level: hints.enhancement_level || consts_1.MIN_ENHANCEMENT_LEVEL });
}
exports.create = create;
// TODO state, immu
function enhance(weapon) {
    if (weapon.enhancement_level >= consts_1.MAX_ENHANCEMENT_LEVEL)
        throw new Error('can’t enhance a weapon above the maximal enhancement level!');
    weapon.enhancement_level++;
    return weapon;
}
exports.enhance = enhance;
/////////////////////
//# sourceMappingURL=state.js.map