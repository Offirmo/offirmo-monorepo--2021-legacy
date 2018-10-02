/////////////////////
import { ItemQuality, InventorySlot, ElementType, create_item_base, compare_items_by_quality, } from '@oh-my-rpg/definitions';
import { Random } from '@offirmo/random';
import { i18n_messages, ENTRIES as static_armor_data } from './data';
import { ArmorPartType, } from './types';
import { get_interval } from './consts';
const ARMOR_BASES = static_armor_data.filter((armor_component) => armor_component.type === ArmorPartType.base);
const ARMOR_QUALIFIERS1 = static_armor_data.filter((armor_component) => armor_component.type === ArmorPartType.qualifier1);
const ARMOR_QUALIFIERS2 = static_armor_data.filter((armor_component) => armor_component.type === ArmorPartType.qualifier2);
const MIN_ENHANCEMENT_LEVEL = 0;
const MAX_ENHANCEMENT_LEVEL = 8;
const MIN_STRENGTH = 1;
const MAX_STRENGTH = 20;
/////////////////////
function pick_random_quality(rng) {
    // legendary =    1/1000
    // epic:     =   10/1000
    // rare:     =  200/1000
    // uncommon  =  389/1000
    // common    =  400/1000
    return Random.bool(400, 1000)(rng)
        ? ItemQuality.common
        : Random.bool(389, 600)(rng)
            ? ItemQuality.uncommon
            : Random.bool(200, 211)(rng)
                ? ItemQuality.rare
                : Random.bool(10, 11)(rng)
                    ? ItemQuality.epic
                    : ItemQuality.legendary;
}
function pick_random_base(rng) {
    return Random.pick(rng, ARMOR_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return Random.pick(rng, ARMOR_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return Random.pick(rng, ARMOR_QUALIFIERS2).hid;
}
const pick_random_base_strength = Random.integer(MIN_STRENGTH, MAX_STRENGTH);
/////////////////////
function create(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    return Object.assign({ base_hid: hints.base_hid || pick_random_base(rng), qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng), qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng) }, create_item_base(InventorySlot.armor, hints.quality || pick_random_quality(rng)), { base_strength: hints.base_strength || pick_random_base_strength(rng), enhancement_level: hints.enhancement_level || 0 });
}
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_armor() {
    const rng = Random.engines.mt19937().autoSeed();
    return create(rng, {
        enhancement_level: Random.integer(0, MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
/////////////////////
// for sorting
function compare_armors_by_strength(a, b) {
    const a_dmg = get_medium_damage_reduction(a);
    const b_dmg = get_medium_damage_reduction(b);
    if (a_dmg !== b_dmg)
        return b_dmg - a_dmg;
    // with equal damage, the least enhanced has more potential
    if (a.enhancement_level !== b.enhancement_level)
        return a.enhancement_level - b.enhancement_level;
    // fallback to other attributes
    return compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid);
}
// TODO immu!
function enhance(armor) {
    if (armor.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
        throw new Error('can’t enhance an armor above the maximal enhancement level!');
    armor.enhancement_level++;
    return armor;
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
const DEMO_ARMOR_1 = {
    uuid: 'uu1~test~demo~armor~0001',
    element_type: ElementType.item,
    slot: InventorySlot.armor,
    base_hid: ARMOR_BASES[0].hid,
    qualifier1_hid: ARMOR_QUALIFIERS1[0].hid,
    qualifier2_hid: ARMOR_QUALIFIERS2[0].hid,
    quality: ItemQuality.uncommon,
    base_strength: MIN_STRENGTH + 1,
    enhancement_level: MIN_ENHANCEMENT_LEVEL,
};
const DEMO_ARMOR_2 = {
    uuid: 'uu1~test~demo~armor~0002',
    element_type: ElementType.item,
    slot: InventorySlot.armor,
    base_hid: ARMOR_BASES[1].hid,
    qualifier1_hid: ARMOR_QUALIFIERS1[1].hid,
    qualifier2_hid: ARMOR_QUALIFIERS2[1].hid,
    quality: ItemQuality.legendary,
    base_strength: MAX_STRENGTH - 1,
    enhancement_level: MAX_ENHANCEMENT_LEVEL,
};
/////////////////////
export { ArmorPartType, MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL, MIN_STRENGTH, MAX_STRENGTH, create, generate_random_demo_armor, enhance, get_damage_reduction_interval, get_medium_damage_reduction, compare_armors_by_strength, i18n_messages, static_armor_data, DEMO_ARMOR_1, DEMO_ARMOR_2, };
/////////////////////
//# sourceMappingURL=index.js.map