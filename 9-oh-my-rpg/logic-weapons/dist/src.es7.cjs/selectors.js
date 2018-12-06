"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const consts_1 = require("./consts");
/////////////////////
// actualized strength
// quality multipliers (see spreadsheet for calculation)
const QUALITY_STRENGTH_MULTIPLIER = {
    common: 1,
    uncommon: 19,
    rare: 46,
    epic: 91,
    legendary: 182,
    artifact: 333,
};
const QUALITY_STRENGTH_SPREAD = {
    common: 6,
    uncommon: 5,
    rare: 4,
    epic: 3,
    legendary: 2,
    artifact: 1,
};
const ENHANCEMENT_MULTIPLIER = 0.2;
function get_interval(base_strength, quality, enhancement_level, coef = 1) {
    const spread = QUALITY_STRENGTH_SPREAD[quality];
    const strength_multiplier = QUALITY_STRENGTH_MULTIPLIER[quality];
    const enhancement_multiplier = (1 + ENHANCEMENT_MULTIPLIER * enhancement_level);
    // constrain interval
    const min_strength = Math.max(base_strength - spread, 1);
    const max_strength = Math.min(base_strength + spread, 20);
    return [
        Math.round(min_strength * strength_multiplier * enhancement_multiplier * coef),
        Math.round(max_strength * strength_multiplier * enhancement_multiplier * coef)
    ];
}
/////////////////////
function get_damage_interval(weapon) {
    return get_interval(weapon.base_strength, weapon.quality, weapon.enhancement_level);
}
exports.get_damage_interval = get_damage_interval;
function get_medium_damage(weapon) {
    const damage_range = get_damage_interval(weapon);
    return Math.round((damage_range[0] + damage_range[1]) / 2);
}
exports.get_medium_damage = get_medium_damage;
function matches(weapon, elements) {
    let matches = true; // so far
    if (!weapon)
        throw new Error(`${consts_1.LIB} matches: can't match nothing!`);
    if (elements.slot && elements.slot !== definitions_1.InventorySlot.weapon)
        throw new Error(`${consts_1.LIB} matches: can't match against a non-weapon slot "${elements.slot}"!`);
    if (weapon.slot !== definitions_1.InventorySlot.weapon)
        return false;
    Object.keys(elements)
        .forEach((k) => {
        if (!(k in weapon))
            throw new Error(`${consts_1.LIB} matches: can't match on non-weapon key "${k}"!`);
        if (elements[k] !== weapon[k])
            matches = false;
    });
    return matches;
}
exports.matches = matches;
/////////////////////
//# sourceMappingURL=selectors.js.map