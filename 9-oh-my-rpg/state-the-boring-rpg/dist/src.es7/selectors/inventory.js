import { InventorySlot } from '@oh-my-rpg/definitions';
import { is_full } from '@oh-my-rpg/state-inventory';
import { appraise_power } from '@oh-my-rpg/logic-shop';
import { get_item as _get_item, get_item_in_slot as _get_item_in_slot, } from '@oh-my-rpg/state-inventory';
/////////////////////
function is_inventory_full(state) {
    return is_full(state.inventory);
}
function get_item_in_slot(state, slot) {
    return _get_item_in_slot(state.inventory, slot);
}
function get_item(state, uuid) {
    return _get_item(state.inventory, uuid);
}
function find_best_unequipped_armor(state) {
    // we take advantage of the fact that the inventory is auto-sorted
    const best_unequipped_armor = state.inventory.unslotted.find(e => e.slot === InventorySlot.armor);
    return best_unequipped_armor
        ? best_unequipped_armor
        : null;
}
function find_better_unequipped_armor(state) {
    const best_unequipped_armor = find_best_unequipped_armor(state);
    if (!best_unequipped_armor)
        return null;
    const best_unequipped_power = appraise_power(best_unequipped_armor);
    const equipped_power = appraise_power(get_item_in_slot(state, InventorySlot.armor));
    if (best_unequipped_power > equipped_power)
        return best_unequipped_armor;
    return null;
}
function find_best_unequipped_weapon(state) {
    // we take advantage of the fact that the inventory is auto-sorted
    const best_unequipped_weapon = state.inventory.unslotted.find(e => e.slot === InventorySlot.weapon);
    return best_unequipped_weapon
        ? best_unequipped_weapon
        : null;
}
function find_better_unequipped_weapon(state) {
    const best_unequipped_weapon = find_best_unequipped_weapon(state);
    if (!best_unequipped_weapon)
        return null;
    const best_unequipped_power = appraise_power(best_unequipped_weapon);
    const equipped_power = appraise_power(get_item_in_slot(state, InventorySlot.weapon));
    if (best_unequipped_power > equipped_power)
        return best_unequipped_weapon;
    return null;
}
/////////////////////
export { is_inventory_full, get_item_in_slot, get_item, find_better_unequipped_armor, find_better_unequipped_weapon, };
/////////////////////
//# sourceMappingURL=inventory.js.map