import { ENHANCEMENT_MULTIPLIER, QUALITY_STRENGTH_MULTIPLIER, QUALITY_STRENGTH_SPREAD, MAX_ENHANCEMENT_LEVEL } from './consts';
/////////////////////
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
function get_damage_reduction_interval(armor) {
    const ATTACK_VS_DEFENSE_RATIO = 0.5;
    return get_interval(armor.base_strength, armor.quality, armor.enhancement_level, ATTACK_VS_DEFENSE_RATIO);
}
function get_medium_damage_reduction(armor) {
    const reduction_range = get_damage_reduction_interval(armor);
    return Math.round((reduction_range[0] + reduction_range[1]) / 2);
}
/////////////////////
// TODO immu!
function enhance(armor) {
    if (armor.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
        throw new Error('can’t enhance an armor above the maximal enhancement level!');
    armor.enhancement_level++;
    return armor;
}
/////////////////////
export { get_interval, get_damage_reduction_interval, get_medium_damage_reduction, enhance, };
//# sourceMappingURL=utils.js.map