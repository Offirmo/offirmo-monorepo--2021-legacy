"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
/////////////////////
const ARMOR_DMG_REDUCTION_TO_POWER_RATIO = 5.;
function appraise_armor_power(armor, potential) {
    armor = Object.assign({}, armor, { enhancement_level: potential ? logic_armors_1.MAX_ENHANCEMENT_LEVEL : armor.enhancement_level });
    return Math.round(logic_armors_1.get_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_POWER_RATIO);
}
const WEAPON_DMG_TO_POWER_RATIO = 5.;
function appraise_weapon_power(weapon, potential) {
    weapon = Object.assign({}, weapon, { enhancement_level: potential ? logic_weapons_1.MAX_ENHANCEMENT_LEVEL : weapon.enhancement_level });
    return Math.round(logic_weapons_1.get_medium_damage(weapon) * WEAPON_DMG_TO_POWER_RATIO);
}
// appraise power normalized across different item slots
function appraise_power_normalized(item, potential = true) {
    switch (item.slot) {
        case definitions_1.InventorySlot.armor:
            return appraise_armor_power(item, potential) / logic_armors_1.ATTACK_VS_DEFENSE_RATIO;
        case definitions_1.InventorySlot.weapon:
            return appraise_weapon_power(item, potential);
        default:
            throw new Error(`appraise_power_normalized(): no appraisal scheme for slot "${item.slot}" !`);
    }
}
exports.appraise_power_normalized = appraise_power_normalized;
function appraise_power(item, potential = true) {
    switch (item.slot) {
        case definitions_1.InventorySlot.armor:
            return appraise_armor_power(item, potential);
        case definitions_1.InventorySlot.weapon:
            return appraise_weapon_power(item, potential);
        default:
            throw new Error(`appraise_power(): no appraisal scheme for slot "${item.slot}" !`);
    }
}
exports.appraise_power = appraise_power;
///////
// TODO take rarity into account (shouldn't be linear)
const ARMOR_DMG_REDUCTION_TO_COINS_RATIO = 1.8;
function appraise_armor_value(armor) {
    return Math.round(logic_armors_1.get_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_COINS_RATIO);
}
const WEAPON_DMG_TO_COINS_RATIO = 0.8;
function appraise_weapon_value(weapon) {
    return Math.round(logic_weapons_1.get_medium_damage(weapon) * WEAPON_DMG_TO_COINS_RATIO);
}
function appraise_value(item) {
    switch (item.slot) {
        case definitions_1.InventorySlot.armor:
            return appraise_armor_value(item);
        case definitions_1.InventorySlot.weapon:
            return appraise_weapon_value(item);
        default:
            throw new Error(`appraise_value(): no appraisal scheme for slot "${item.slot}" !`);
    }
}
exports.appraise_value = appraise_value;
//# sourceMappingURL=selectors.js.map