import { ITEM_SLOTS } from '@oh-my-rpg/definitions';
import { is_full } from '@oh-my-rpg/state-inventory';
import { get_snapshot } from '@oh-my-rpg/state-energy';
import { appraise_value, appraise_power } from '@oh-my-rpg/logic-shop';
import { get_item as _get_item, get_item_in_slot as _get_item_in_slot, } from '@oh-my-rpg/state-inventory';
/////////////////////
function is_inventory_full(state) {
    return is_full(state.inventory);
}
function get_energy_snapshot(state, now) {
    return get_snapshot(state.energy, now);
}
function get_item_in_slot(state, slot) {
    return _get_item_in_slot(state.inventory, slot);
}
function get_item(state, uuid) {
    return _get_item(state.inventory, uuid);
}
function appraise_item_value(state, uuid) {
    const item = get_item(state, uuid);
    if (!item)
        throw new Error('appraise_item_value(): No item!');
    return appraise_value(item);
}
function appraise_item_power(state, uuid) {
    const item = get_item(state, uuid);
    if (!item)
        throw new Error('appraise_item_power(): No item!');
    return appraise_power(item);
}
function appraise_player_power(state) {
    let power = 1;
    ITEM_SLOTS.forEach((slot) => {
        const item = get_item_in_slot(state, slot);
        if (item)
            power += appraise_power(item);
    });
    // TODO appraise attributes relative to class
    return power;
}
function find_element(state, uuid) {
    // only inventory for now
    return get_item(state, uuid);
}
/////////////////////
export { get_energy_snapshot, is_inventory_full, get_item_in_slot, get_item, appraise_item_value, appraise_item_power, find_element, appraise_player_power, };
/////////////////////
//# sourceMappingURL=index.js.map