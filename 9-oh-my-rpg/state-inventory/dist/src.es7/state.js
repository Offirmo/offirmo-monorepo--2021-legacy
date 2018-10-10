/////////////////////
import { InventorySlot } from '@oh-my-rpg/definitions';
import { SCHEMA_VERSION } from './consts';
import { compare_items } from './compare';
import { is_full, get_item_in_slot } from './selectors';
import { get_lib_SEC } from './sec';
/////////////////////
function create(SEC) {
    return get_lib_SEC(SEC).xTry('rename', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: SCHEMA_VERSION,
            revision: 0,
            // todo rename equipped / backpack
            unslotted_capacity: 20,
            slotted: {},
            unslotted: [],
        });
    });
}
/////////////////////
function internal_auto_sort(state) {
    state.unslotted.sort(compare_items);
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
function remove_item_from_unslotted(state, uuid) {
    return internal_remove_item(Object.assign({}, state, { revision: state.revision + 1 }), uuid);
}
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
/////////////////////
export { InventorySlot, create, add_item, remove_item_from_unslotted, equip_item, };
/////////////////////
//# sourceMappingURL=state.js.map