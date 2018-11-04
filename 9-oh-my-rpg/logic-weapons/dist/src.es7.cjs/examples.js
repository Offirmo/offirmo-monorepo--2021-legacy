"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const definitions_1 = require("@oh-my-rpg/definitions");
const consts_1 = require("./consts");
const data_1 = require("./data");
const state_1 = require("./state");
/////////////////////
const DEMO_WEAPON_1 = {
    uuid: 'uu1~test~demo~weapon~001',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.weapon,
    base_hid: data_1.WEAPON_BASES[0].hid,
    qualifier1_hid: data_1.WEAPON_QUALIFIERS1[0].hid,
    qualifier2_hid: data_1.WEAPON_QUALIFIERS2[0].hid,
    quality: definitions_1.ItemQuality.uncommon,
    base_strength: consts_1.MIN_STRENGTH + 1,
    enhancement_level: consts_1.MIN_ENHANCEMENT_LEVEL,
};
exports.DEMO_WEAPON_1 = DEMO_WEAPON_1;
const DEMO_WEAPON_2 = {
    uuid: 'uu1~test~demo~weapon~002',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.weapon,
    base_hid: data_1.WEAPON_BASES[1].hid,
    qualifier1_hid: data_1.WEAPON_QUALIFIERS1[1].hid,
    qualifier2_hid: data_1.WEAPON_QUALIFIERS2[1].hid,
    quality: definitions_1.ItemQuality.legendary,
    base_strength: consts_1.MAX_STRENGTH - 1,
    enhancement_level: consts_1.MAX_ENHANCEMENT_LEVEL,
};
exports.DEMO_WEAPON_2 = DEMO_WEAPON_2;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_weapon(rng) {
    rng = rng || random_1.Random.engines.mt19937().autoSeed();
    return state_1.create(rng, {
        enhancement_level: random_1.Random.integer(0, consts_1.MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
exports.generate_random_demo_weapon = generate_random_demo_weapon;
/////////////////////
//# sourceMappingURL=examples.js.map