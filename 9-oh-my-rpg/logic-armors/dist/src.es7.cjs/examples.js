"use strict";
////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const definitions_1 = require("@oh-my-rpg/definitions");
const _1 = require(".");
const data_1 = require("./data");
////////////////////////////////////
const DEMO_ARMOR_1 = {
    uuid: 'uu1~test~demo~armor~0001',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.armor,
    base_hid: data_1.ARMOR_BASES[0].hid,
    qualifier1_hid: data_1.ARMOR_QUALIFIERS1[0].hid,
    qualifier2_hid: data_1.ARMOR_QUALIFIERS2[0].hid,
    quality: definitions_1.ItemQuality.uncommon,
    base_strength: _1.MIN_STRENGTH + 1,
    enhancement_level: _1.MIN_ENHANCEMENT_LEVEL,
};
exports.DEMO_ARMOR_1 = DEMO_ARMOR_1;
const DEMO_ARMOR_2 = {
    uuid: 'uu1~test~demo~armor~0002',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.armor,
    base_hid: data_1.ARMOR_BASES[1].hid,
    qualifier1_hid: data_1.ARMOR_QUALIFIERS1[1].hid,
    qualifier2_hid: data_1.ARMOR_QUALIFIERS2[1].hid,
    quality: definitions_1.ItemQuality.legendary,
    base_strength: _1.MAX_STRENGTH - 1,
    enhancement_level: _1.MAX_ENHANCEMENT_LEVEL,
};
exports.DEMO_ARMOR_2 = DEMO_ARMOR_2;
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_armor(rng) {
    rng = rng || random_1.Random.engines.mt19937().autoSeed();
    return _1.create(rng, {
        enhancement_level: random_1.Random.integer(_1.MIN_ENHANCEMENT_LEVEL, _1.MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
exports.generate_random_demo_armor = generate_random_demo_armor;
//# sourceMappingURL=examples.js.map