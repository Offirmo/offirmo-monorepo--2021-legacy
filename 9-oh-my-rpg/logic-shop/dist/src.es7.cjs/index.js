"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
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
const ARMOR_DMG_REDUCTION_TO_COINS_RATIO = 1.8;
function appraise_armor(armor) {
    return Math.round(logic_armors_1.get_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_COINS_RATIO);
}
const WEAPON_DMG_TO_COINS_RATIO = 0.8;
function appraise_weapon(weapon) {
    return Math.round(logic_weapons_1.get_medium_damage(weapon) * WEAPON_DMG_TO_COINS_RATIO);
}
///////
function appraise(item) {
    switch (item.slot) {
        case definitions_1.InventorySlot.armor:
            return appraise_armor(item);
        case definitions_1.InventorySlot.weapon:
            return appraise_weapon(item);
        default:
            throw new Error(`appraise(): no appraisal scheme for slot "${item.slot}" !`);
    }
}
exports.appraise = appraise;
/////////////////////
//# sourceMappingURL=index.js.map