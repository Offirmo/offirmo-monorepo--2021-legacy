/////////////////////
import { Random } from '@offirmo/random';
import { ItemQuality, InventorySlot, ElementType, } from '@oh-my-rpg/definitions';
import { MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL, MIN_STRENGTH, MAX_STRENGTH, } from './consts';
import { WEAPON_BASES, WEAPON_QUALIFIERS1, WEAPON_QUALIFIERS2, } from './data';
import { create } from './state';
/////////////////////
const DEMO_WEAPON_1 = {
    uuid: 'uu1~test~demo~weapon~001',
    element_type: ElementType.item,
    slot: InventorySlot.weapon,
    base_hid: WEAPON_BASES[0].hid,
    qualifier1_hid: WEAPON_QUALIFIERS1[0].hid,
    qualifier2_hid: WEAPON_QUALIFIERS2[0].hid,
    quality: ItemQuality.uncommon,
    base_strength: MIN_STRENGTH + 1,
    enhancement_level: MIN_ENHANCEMENT_LEVEL,
};
const DEMO_WEAPON_2 = {
    uuid: 'uu1~test~demo~weapon~002',
    element_type: ElementType.item,
    slot: InventorySlot.weapon,
    base_hid: WEAPON_BASES[1].hid,
    qualifier1_hid: WEAPON_QUALIFIERS1[1].hid,
    qualifier2_hid: WEAPON_QUALIFIERS2[1].hid,
    quality: ItemQuality.legendary,
    base_strength: MAX_STRENGTH - 1,
    enhancement_level: MAX_ENHANCEMENT_LEVEL,
};
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_weapon() {
    const rng = Random.engines.mt19937().autoSeed();
    return create(rng, {
        enhancement_level: Random.integer(0, MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
/////////////////////
export { DEMO_WEAPON_1, DEMO_WEAPON_2, generate_random_demo_weapon, };
/////////////////////
//# sourceMappingURL=examples.js.map