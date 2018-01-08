"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze = require("deep-freeze-strict");
const consts_1 = require("./consts");
const definitions_1 = require("@oh-my-rpg/definitions");
exports.InventorySlot = definitions_1.InventorySlot;
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
/////////////////////
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        // todo rename equipped / backpack
        unslotted_capacity: 20,
        slotted: {},
        unslotted: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ],
    };
}
exports.create = create;
/////////////////////
// pass the item: can be a hint in case we have "allocated" bags (TODO one day)
function find_unused_coordinates(state, item) {
    return state.unslotted.findIndex(item => !item);
}
function auto_sort(state) {
    // TODO sort by slot/strength
    state.unslotted.sort();
    return state;
}
/////////////////////
function coordinates_to_string(coordinates) {
    return `#${coordinates}`;
}
/////////////////////
function add_item(state, item) {
    const coordinates = find_unused_coordinates(state, item);
    if (coordinates < 0)
        throw new Error(`state-inventory: can't add item, inventory is full!`);
    state.unslotted[coordinates] = item;
    return auto_sort(state);
}
exports.add_item = add_item;
function remove_item(state, coordinates) {
    const item_to_remove = get_item_at_coordinates(state, coordinates);
    if (!item_to_remove)
        throw new Error(`state-inventory: can't remove item at ${coordinates_to_string(coordinates)}, not found!`);
    state.unslotted[coordinates] = null;
    return auto_sort(state);
}
exports.remove_item = remove_item;
function equip_item(state, coordinates) {
    const item_to_equip = get_item_at_coordinates(state, coordinates);
    if (!item_to_equip)
        throw new Error(`state-inventory: can't equip item at ${coordinates_to_string(coordinates)}, not found!`);
    const slot = item_to_equip.slot;
    if (slot === definitions_1.InventorySlot.none)
        throw new Error(`state-inventory: can't equip item at ${coordinates_to_string(coordinates)}, not equipable!`);
    const item_previously_in_slot = get_item_in_slot(state, slot); // may be null
    state.slotted[slot] = item_to_equip;
    state.unslotted[coordinates] = item_previously_in_slot; // whether it's null or not
    return auto_sort(state);
}
exports.equip_item = equip_item;
function unequip_item(state, slot) {
    const item_to_unequip = get_item_in_slot(state, slot);
    if (!item_to_unequip)
        throw new Error(`state-inventory: can't unequip item from slot ${slot}, it\'s empty!`);
    const coordinates = find_unused_coordinates(state, item_to_unequip);
    if (coordinates < 0)
        throw new Error(`state-inventory: can't unequip item, inventory is full!`);
    state.slotted[slot] = null;
    delete state.slotted[slot];
    state.unslotted[coordinates] = item_to_unequip;
    return auto_sort(state);
}
exports.unequip_item = unequip_item;
/////////////////////
function get_equiped_item_count(state) {
    return Object.keys(state.slotted).length;
}
exports.get_equiped_item_count = get_equiped_item_count;
function get_unequiped_item_count(state) {
    return state.unslotted.filter(i => !!i).length;
}
exports.get_unequiped_item_count = get_unequiped_item_count;
function get_item_count(state) {
    return get_equiped_item_count(state) + get_unequiped_item_count(state);
}
exports.get_item_count = get_item_count;
function get_item_at_coordinates(state, coordinates) {
    return state.unslotted[coordinates] || null;
}
exports.get_item_at_coordinates = get_item_at_coordinates;
function get_item_in_slot(state, slot) {
    return state.slotted[slot] || null;
}
exports.get_item_in_slot = get_item_in_slot;
function* iterables_unslotted(state) {
    yield* state.unslotted;
}
exports.iterables_unslotted = iterables_unslotted;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    unslotted_capacity: 20,
    slotted: {
        armor: logic_armors_1.DEMO_ARMOR_2,
        weapon: logic_weapons_1.DEMO_WEAPON_1,
    },
    unslotted: [
        logic_weapons_1.DEMO_WEAPON_2,
        logic_armors_1.DEMO_ARMOR_1,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ],
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    unslotted_capacity: 20,
    slotted: {
        armor: logic_armors_1.DEMO_ARMOR_2,
        weapon: logic_weapons_1.DEMO_WEAPON_1,
    },
    unslotted: [
        logic_weapons_1.DEMO_WEAPON_2,
        logic_armors_1.DEMO_ARMOR_1,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ],
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v1: {
        revision: 42
    },
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map