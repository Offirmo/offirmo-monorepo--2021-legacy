/////////////////////
import { Random } from '@offirmo/random';
import { InventorySlot } from '@oh-my-rpg/definitions';
import { get_medium_damage, } from '@oh-my-rpg/logic-weapons';
import { get_medium_damage_reduction, } from '@oh-my-rpg/logic-armors';
/////////////////////
function create(rng) {
    // TODO one day
}
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_shop() {
    const rng = Random.engines.mt19937().autoSeed();
    return create(rng);
}
/////////////////////
const ARMOR_DMG_REDUCTION_TO_COINS_RATIO = 1.8;
function appraise_armor(armor) {
    return Math.round(get_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_COINS_RATIO);
}
const WEAPON_DMG_TO_COINS_RATIO = 0.8;
function appraise_weapon(weapon) {
    return Math.round(get_medium_damage(weapon) * WEAPON_DMG_TO_COINS_RATIO);
}
///////
function appraise(item) {
    switch (item.slot) {
        case InventorySlot.armor:
            return appraise_armor(item);
        case InventorySlot.weapon:
            return appraise_weapon(item);
        default:
            throw new Error(`appraise(): no appraisal scheme for slot "${item.slot}" !`);
    }
}
/////////////////////
export { generate_random_demo_shop, create, appraise, };
/////////////////////
//# sourceMappingURL=index.js.map