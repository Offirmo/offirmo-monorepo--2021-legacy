/////////////////////
/////////////////////
function is_full(state) {
    return (state.unslotted.length >= state.unslotted_capacity);
}
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
export { is_full, get_equipped_item_count, get_unequipped_item_count, get_item_count, get_unslotted_item, get_item, get_item_in_slot, iterables_unslotted, };
/////////////////////
//# sourceMappingURL=selectors.js.map