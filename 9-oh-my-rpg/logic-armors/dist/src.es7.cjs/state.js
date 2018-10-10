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
    // legendary =    1/1000
    // epic:     =   10/1000
    // rare:     =  200/1000
    // uncommon  =  389/1000
    // common    =  400/1000
    return random_1.Random.bool(400, 1000)(rng)
        ? definitions_1.ItemQuality.common
        : random_1.Random.bool(389, 600)(rng)
            ? definitions_1.ItemQuality.uncommon
            : random_1.Random.bool(200, 211)(rng)
                ? definitions_1.ItemQuality.rare
                : random_1.Random.bool(10, 11)(rng)
                    ? definitions_1.ItemQuality.epic
                    : definitions_1.ItemQuality.legendary;
}
function pick_random_base(rng) {
    return random_1.Random.pick(rng, data_1.ARMOR_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return random_1.Random.pick(rng, data_1.ARMOR_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return random_1.Random.pick(rng, data_1.ARMOR_QUALIFIERS2).hid;
}
const pick_random_base_strength = random_1.Random.integer(consts_1.MIN_STRENGTH, consts_1.MAX_STRENGTH);
/////////////////////
function create(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    return Object.assign({ base_hid: hints.base_hid || pick_random_base(rng), qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng), qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng) }, definitions_1.create_item_base(definitions_1.InventorySlot.armor, hints.quality || pick_random_quality(rng)), { base_strength: hints.base_strength || pick_random_base_strength(rng), enhancement_level: hints.enhancement_level || consts_1.MIN_ENHANCEMENT_LEVEL });
}
exports.create = create;
// TODO immu! TODO state!
function enhance(armor) {
    if (armor.enhancement_level >= consts_1.MAX_ENHANCEMENT_LEVEL)
        throw new Error('can’t enhance an armor above the maximal enhancement level!');
    armor.enhancement_level++;
    return armor;
}
exports.enhance = enhance;
/////////////////////
//# sourceMappingURL=state.js.map