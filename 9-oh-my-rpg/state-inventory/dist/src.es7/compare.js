/////////////////////
import { InventorySlot, compare_items_by_slot, } from '@oh-my-rpg/definitions';
import { compare_armors_by_strength, } from '@oh-my-rpg/logic-armors';
import { compare_weapons_by_strength, } from '@oh-my-rpg/logic-weapons';
import { LIB_ID, } from './consts';
/////////////////////
function compare_items(a, b) {
    if (a.slot !== b.slot)
        return compare_items_by_slot(a, b);
    switch (a.slot) {
        case InventorySlot.armor:
            return compare_armors_by_strength(a, b);
        case InventorySlot.weapon:
            return compare_weapons_by_strength(a, b);
        default:
            throw new Error(`${LIB_ID}: compare(): unhandled item slot "${a.slot}"!`);
    }
}
/////////////////////
export { compare_items, };
/////////////////////
//# sourceMappingURL=compare.js.map