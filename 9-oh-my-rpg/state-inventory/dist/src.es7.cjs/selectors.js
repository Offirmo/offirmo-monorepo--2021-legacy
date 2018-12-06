"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////
function is_full(state) {
    return (state.unslotted.length >= state.unslotted_capacity);
}
exports.is_full = is_full;
function get_equipped_item_count(state) {
    return Object.keys(state.slotted).length;
}
exports.get_equipped_item_count = get_equipped_item_count;
function get_unequipped_item_count(state) {
    return state.unslotted.length;
}
exports.get_unequipped_item_count = get_unequipped_item_count;
function get_item_count(state) {
    return get_equipped_item_count(state) + get_unequipped_item_count(state);
}
exports.get_item_count = get_item_count;
function get_unslotted_item(state, uuid) {
    let item = state.unslotted.find(i => i.uuid === uuid);
    return item ? item : null;
}
exports.get_unslotted_item = get_unslotted_item;
function get_item(state, uuid) {
    let item = get_unslotted_item(state, uuid);
    item = item || Object.values(state.slotted).find(i => !!i && i.uuid === uuid);
    return item ? item : null;
}
exports.get_item = get_item;
function get_item_in_slot(state, slot) {
    return state.slotted[slot] || null;
}
exports.get_item_in_slot = get_item_in_slot;
/*
function get_typed_item_in_slot(state: Readonly<State>, slot: InventorySlot): State['slotted'][keyof State['slotted']] | null {
    switch(slot) {
        case InventorySlot.armor:
            return state.slotted[InventorySlot.armor] || null
        case InventorySlot.weapon:
            return state.slotted[InventorySlot.weapon] || null
        default:
            return null
    }
}
*/
function* iterables_unslotted(state) {
    yield* state.unslotted;
}
exports.iterables_unslotted = iterables_unslotted;
/////////////////////
//# sourceMappingURL=selectors.js.map