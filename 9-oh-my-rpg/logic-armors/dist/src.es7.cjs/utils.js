"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
/////////////////////
function get_interval(base_strength, quality, enhancement_level, coef = 1) {
    const spread = consts_1.QUALITY_STRENGTH_SPREAD[quality];
    const strength_multiplier = consts_1.QUALITY_STRENGTH_MULTIPLIER[quality];
    const enhancement_multiplier = (1 + consts_1.ENHANCEMENT_MULTIPLIER * enhancement_level);
    // constrain interval
    const min_strength = Math.max(base_strength - spread, 1);
    const max_strength = Math.min(base_strength + spread, 20);
    return [
        Math.round(min_strength * strength_multiplier * enhancement_multiplier * coef),
        Math.round(max_strength * strength_multiplier * enhancement_multiplier * coef)
    ];
}
exports.get_interval = get_interval;
function get_damage_reduction_interval(armor) {
    const ATTACK_VS_DEFENSE_RATIO = 0.5;
    return get_interval(armor.base_strength, armor.quality, armor.enhancement_level, ATTACK_VS_DEFENSE_RATIO);
}
exports.get_damage_reduction_interval = get_damage_reduction_interval;
function get_medium_damage_reduction(armor) {
    const reduction_range = get_damage_reduction_interval(armor);
    return Math.round((reduction_range[0] + reduction_range[1]) / 2);
}
exports.get_medium_damage_reduction = get_medium_damage_reduction;
/////////////////////
// TODO immu!
function enhance(armor) {
    if (armor.enhancement_level >= consts_1.MAX_ENHANCEMENT_LEVEL)
        throw new Error('can’t enhance an armor above the maximal enhancement level!');
    armor.enhancement_level++;
    return armor;
}
exports.enhance = enhance;
//# sourceMappingURL=utils.js.map