"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
exports.InventorySlot = definitions_1.InventorySlot;
const consts_1 = require("./consts");
const compare_1 = require("./compare");
const selectors_1 = require("./selectors");
const sec_1 = require("./sec");
/////////////////////
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('rename', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            // todo rename equipped / backpack ?
            unslotted_capacity: 20,
            slotted: {},
            unslotted: [],
        });
    });
}
exports.create = create;
/////////////////////
function _auto_sort(state) {
    state.unslotted.sort(compare_1.compare_items_by_slot_then_strength);
    return state;
}
function internal_remove_item(state, uuid) {
    const new_unslotted = state.unslotted.filter(i => i.uuid !== uuid);
    if (new_unslotted.length === state.unslotted.length)
        throw new Error(`state-inventory: can’t remove item #${uuid}, not found!`);
    // removing won't change the sort order, so no need to auto-sort
    state.unslotted = new_unslotted;
    return state;
}
/////////////////////
function add_item(state, item) {
    if (selectors_1.is_full(state))
        throw new Error('state-inventory: can’t add item, inventory is full!');
    return _auto_sort(Object.assign({}, state, { unslotted: [...state.unslotted, item], revision: state.revision + 1 }));
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
    const item_previously_in_slot = selectors_1.get_item_in_slot(state, target_slot); // may be null
    // swap them
    let new_state = Object.assign({}, state, { slotted: Object.assign({}, state.slotted, { [target_slot]: item_to_equip }), revision: state.revision + 1 });
    new_state = internal_remove_item(new_state, item_to_equip.uuid);
    if (item_previously_in_slot)
        new_state.unslotted.push(item_previously_in_slot);
    return _auto_sort(new_state);
}
exports.equip_item = equip_item;
/////////////////////
//# sourceMappingURL=state.js.map