"use strict";
////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=selectors.js.map