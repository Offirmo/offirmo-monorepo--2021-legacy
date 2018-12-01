/////////////////////
import { ItemQuality, InventorySlot, create_item_base, } from '@oh-my-rpg/definitions';
import { Random } from '@offirmo/random';
import { i18n_messages, WEAPON_BASES, WEAPON_QUALIFIERS1, WEAPON_QUALIFIERS2, } from './data';
import { MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL, MIN_STRENGTH, MAX_STRENGTH, } from './consts';
/////////////////////
function pick_random_quality(rng) {
    // common    =  400/1000
    // uncommon  =  389/1000
    // rare:     =  200/1000
    // epic:     =   10/1000
    // legendary =    1/1000
    let p = Random.integer(1, 1000)(rng);
    if (p <= 400)
        return ItemQuality.common;
    p -= 400;
    if (p <= 389)
        return ItemQuality.uncommon;
    p -= 389;
    if (p <= 200)
        return ItemQuality.rare;
    p -= 200;
    if (p <= 10)
        return ItemQuality.epic;
    return ItemQuality.legendary;
}
function pick_random_base(rng) {
    return Random.pick(rng, WEAPON_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return Random.pick(rng, WEAPON_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return Random.pick(rng, WEAPON_QUALIFIERS2).hid;
}
const pick_random_base_strength = Random.integer(MIN_STRENGTH, MAX_STRENGTH);
/////////////////////
function create(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    const base = create_item_base(InventorySlot.weapon, hints.quality || pick_random_quality(rng));
    return Object.assign({}, base, { base_hid: hints.base_hid || pick_random_base(rng), qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng), qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng), base_strength: hints.base_strength || pick_random_base_strength(rng), enhancement_level: hints.enhancement_level || MIN_ENHANCEMENT_LEVEL });
}
// TODO state, immu
function enhance(weapon) {
    if (weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
        throw new Error('can’t enhance a weapon above the maximal enhancement level!');
    weapon.enhancement_level++;
    return weapon;
}
/////////////////////
export { create, enhance, i18n_messages, };
/////////////////////
//# sourceMappingURL=state.js.map