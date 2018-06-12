/////////////////////
import { InventorySlot } from '@oh-my-rpg/definitions';
import { SCHEMA_VERSION } from './consts';
import { compare_items } from './compare';
/////////////////////
function create() {
    return {
        schema_version: SCHEMA_VERSION,
        revision: 0,
        // todo rename equipped / backpack
        unslotted_capacity: 20,
        slotted: {},
        unslotted: [],
    };
}
/////////////////////
function auto_sort(state) {
    state.unslotted.sort(compare_items);
    return state;
}
/////////////////////
function add_item(state, item) {
    if (state.unslotted.length >= state.unslotted_capacity)
        throw new Error(`state-inventory: can't add item, inventory is full!`);
    state.unslotted.push(item);
    return auto_sort(state);
}
function remove_item_from_unslotted(state, uuid) {
    const new_unslotted = state.unslotted.filter(i => i.uuid !== uuid);
    if (new_unslotted.length === state.unslotted.length)
        throw new Error(`state-inventory: can't remove item #${uuid}, not found!`);
    state.unslotted = new_unslotted;
    return state;
}
function equip_item(state, uuid) {
    const item_to_equip = state.unslotted.find(i => i.uuid === uuid);
    if (!item_to_equip)
        throw new Error(`state-inventory: can't equip item #${uuid}, not found!`);
    const target_slot = item_to_equip.slot;
    const item_previously_in_slot = get_item_in_slot(state, target_slot); // may be null
    // swap them
    state.slotted[target_slot] = item_to_equip;
    state = remove_item_from_unslotted(state, item_to_equip.uuid);
    if (item_previously_in_slot)
        state.unslotted.push(item_previously_in_slot);
    return auto_sort(state);
}
/////////////////////
function get_equipped_item_count(state) {
    return Object.keys(state.slotted).length;
}
function get_unequipped_item_count(state) {
    return state.unslotted.filter(i => !!i).length;
}
function get_item_count(state) {
    return get_equipped_item_count(state) + get_unequipped_item_count(state);
}
function get_unslotted_item(state, uuid) {
    let item = state.unslotted.find(i => i.uuid === uuid);
    return item ? item : null;
}
function get_item(state, uuid) {
    let item = get_unslotted_item(state, uuid);
    item = item || Object.values(state.slotted).find(i => !!i && i.uuid === uuid);
    return item ? item : null;
}
function get_item_in_slot(state, slot) {
    return state.slotted[slot] || null;
}
function* iterables_unslotted(state) {
    yield* state.unslotted;
}
/////////////////////
export { InventorySlot, create, add_item, remove_item_from_unslotted, equip_item, get_equipped_item_count, get_unequipped_item_count, get_item_count, get_unslotted_item, get_item, get_item_in_slot, iterables_unslotted, };
/////////////////////
//# sourceMappingURL=state.js.map