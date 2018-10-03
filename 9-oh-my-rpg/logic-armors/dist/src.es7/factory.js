/////////////////////
import { ItemQuality, InventorySlot, create_item_base, } from '@oh-my-rpg/definitions';
import { Random } from '@offirmo/random';
import { i18n_messages, ARMOR_BASES, ARMOR_QUALIFIERS1, ARMOR_QUALIFIERS2, ENTRIES as static_armor_data } from './data';
import { MIN_STRENGTH, MAX_STRENGTH, MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL } from './consts';
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
        enhancement_level: Random.integer(MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
/////////////////////
export { create, generate_random_demo_armor, i18n_messages, static_armor_data, };
/////////////////////
//# sourceMappingURL=factory.js.map