"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
exports.InventorySlot = definitions_1.InventorySlot;
const consts_1 = require("./consts");
const compare_1 = require("./compare");
const sec_1 = require("./sec");
/////////////////////
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('rename', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            // todo rename equipped / backpack
            unslotted_capacity: 20,
            slotted: {},
            unslotted: [],
        });
    });
}
exports.create = create;
/////////////////////
function internal_auto_sort(state) {
    state.unslotted.sort(compare_1.compare_items);
    return state;
}
function internal_remove_item(state, uuid) {
    const new_unslotted = state.unslotted.filter(i => i.uuid !== uuid);
    if (new_unslotted.length === state.unslotted.length)
        throw new Error(`state-inventory: can’t remove item #${uuid}, not found!`);
    state.unslotted = new_unslotted;
    return state;
}
/////////////////////
function add_item(state, item) {
    if (is_full(state))
        throw new Error('state-inventory: can’t add item, inventory is full!');
    return internal_auto_sort(Object.assign({}, state, { unslotted: [...state.unslotted, item], revision: state.revision + 1 }));
}
exports.add_item = add_item;
function remove_item_from_unslotted(state, uuid) {
    return internal_remove_item(Object.assign({}, state, { revision: state.revision + 1 }), uuid);
}
exports.remove_item_from_unslotted = remove_item_from_unslotted;
function equip_item(state, uuid) {
    const item_to_equip = state.unslotted.find(i => i.uuid === uuid);
    if (!item_to_equip)
        throw new Error(`state-inventory: can’t equip item #${uuid}, not found!`);
    const target_slot = item_to_equip.slot;
    const item_previously_in_slot = get_item_in_slot(state, target_slot); // may be null
    // swap them
    let new_state = Object.assign({}, state, { slotted: Object.assign({}, state.slotted, { [target_slot]: item_to_equip }), revision: state.revision + 1 });
    new_state = internal_remove_item(new_state, item_to_equip.uuid);
    if (item_previously_in_slot)
        new_state.unslotted.push(item_previously_in_slot);
    return internal_auto_sort(new_state);
}
exports.equip_item = equip_item;
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
    return state.unslotted.filter(i => !!i).length;
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
function* iterables_unslotted(state) {
    yield* state.unslotted;
}
exports.iterables_unslotted = iterables_unslotted;
/////////////////////
//# sourceMappingURL=state.js.map