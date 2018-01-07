"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const random_1 = require("@offirmo/random");
const definitions_2 = require("@oh-my-rpg/definitions");
const data_1 = require("./data");
exports.i18n_messages = data_1.i18n_messages;
exports.static_weapon_data = data_1.ENTRIES;
const types_1 = require("./types");
exports.WeaponPartType = types_1.WeaponPartType;
const consts_1 = require("./consts");
const WEAPON_BASES = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.base);
const WEAPON_QUALIFIERS1 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.qualifier1);
const WEAPON_QUALIFIERS2 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.qualifier2);
const MIN_ENHANCEMENT_LEVEL = 0;
exports.MIN_ENHANCEMENT_LEVEL = MIN_ENHANCEMENT_LEVEL;
const MAX_ENHANCEMENT_LEVEL = 8;
exports.MAX_ENHANCEMENT_LEVEL = MAX_ENHANCEMENT_LEVEL;
const MIN_STRENGTH = 1;
exports.MIN_STRENGTH = MIN_STRENGTH;
const MAX_STRENGTH = 20;
exports.MAX_STRENGTH = MAX_STRENGTH;
/////////////////////
function pick_random_quality(rng) {
    // legendary =    1/1000
    // epic:     =   10/1000
    // rare:     =  200/1000
    // uncommon  =  389/1000
    // common    =  400/1000
    return random_1.Random.bool(400, 1000)(rng)
        ? definitions_2.ItemQuality.common
        : random_1.Random.bool(389, 600)(rng)
            ? definitions_2.ItemQuality.uncommon
            : random_1.Random.bool(200, 211)(rng)
                ? definitions_2.ItemQuality.rare
                : random_1.Random.bool(10, 11)(rng)
                    ? definitions_2.ItemQuality.epic
                    : definitions_2.ItemQuality.legendary;
}
function pick_random_base(rng) {
    return random_1.Random.pick(rng, WEAPON_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return random_1.Random.pick(rng, WEAPON_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return random_1.Random.pick(rng, WEAPON_QUALIFIERS2).hid;
}
const pick_random_base_strength = random_1.Random.integer(MIN_STRENGTH, MAX_STRENGTH);
/////////////////////
function create(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    return Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.weapon, base_hid: hints.base_hid || pick_random_base(rng), qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng), qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng), quality: hints.quality || pick_random_quality(rng), base_strength: hints.base_strength || pick_random_base_strength(rng), enhancement_level: hints.enhancement_level || 0 });
}
exports.create = create;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_weapon() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return create(rng, {
        enhancement_level: random_1.Random.integer(0, MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
exports.generate_random_demo_weapon = generate_random_demo_weapon;
/////////////////////
function enhance(weapon) {
    if (weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
        throw new Error(`can't enhance a weapon above the maximal enhancement level!`);
    weapon.enhancement_level++;
    return weapon;
}
exports.enhance = enhance;
///////
function get_damage_interval(weapon) {
    return consts_1.get_interval(weapon.base_strength, weapon.quality, weapon.enhancement_level);
}
exports.get_damage_interval = get_damage_interval;
function get_medium_damage(weapon) {
    const damage_range = get_damage_interval(weapon);
    return Math.round((damage_range[0] + damage_range[1]) / 2);
}
exports.get_medium_damage = get_medium_damage;
/////////////////////
const DEMO_WEAPON_1 = {
    uuid: 'uu1~test~demo~weapon~001',
    element_type: definitions_1.ElementType.item,
    slot: definitions_2.InventorySlot.weapon,
    base_hid: WEAPON_BASES[0].hid,
    qualifier1_hid: WEAPON_QUALIFIERS1[0].hid,
    qualifier2_hid: WEAPON_QUALIFIERS2[0].hid,
    quality: definitions_2.ItemQuality.uncommon,
    base_strength: MIN_STRENGTH + 1,
    enhancement_level: MIN_ENHANCEMENT_LEVEL,
};
exports.DEMO_WEAPON_1 = DEMO_WEAPON_1;
const DEMO_WEAPON_2 = {
    uuid: 'uu1~test~demo~weapon~002',
    element_type: definitions_1.ElementType.item,
    slot: definitions_2.InventorySlot.weapon,
    base_hid: WEAPON_BASES[1].hid,
    qualifier1_hid: WEAPON_QUALIFIERS1[1].hid,
    qualifier2_hid: WEAPON_QUALIFIERS2[1].hid,
    quality: definitions_2.ItemQuality.legendary,
    base_strength: MAX_STRENGTH - 1,
    enhancement_level: MAX_ENHANCEMENT_LEVEL,
};
exports.DEMO_WEAPON_2 = DEMO_WEAPON_2;
/////////////////////
//# sourceMappingURL=index.js.map