import { ITEM_SLOTS, InventorySlot } from '@oh-my-rpg/definitions';
import { is_full } from '@oh-my-rpg/state-inventory';
import { get_snapshot } from '@oh-my-rpg/state-energy';
import { appraise_value, appraise_power } from '@oh-my-rpg/logic-shop';
import { get_item as _get_item, get_item_in_slot as _get_item_in_slot, } from '@oh-my-rpg/state-inventory';
import { get_oldest_queued_flow, get_oldest_queued_non_flow, } from "@oh-my-rpg/state-engagement";
import { get_engagement_message } from '../engagement';
import { get_achievement_snapshot_by_uuid } from "./achievements";
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
// TODO
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
    let possible_achievement = null;
    try {
        possible_achievement = get_achievement_snapshot_by_uuid(state, uuid);
    }
    catch (err) {
        // not found, swallow
    }
    return possible_achievement || get_item(state, uuid);
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
// TODO code duplication
function get_oldest_pending_flow_engagement(state) {
    const pe = get_oldest_queued_flow(state.engagement);
    if (!pe)
        return null;
    return {
        uid: pe.uid,
        $doc: get_engagement_message(state, pe),
        pe,
    };
}
function get_oldest_pending_non_flow_engagement(state) {
    const pe = get_oldest_queued_non_flow(state.engagement);
    if (!pe)
        return null;
    return {
        uid: pe.uid,
        $doc: get_engagement_message(state, pe),
        pe,
    };
}
/////////////////////
export { get_energy_snapshot, is_inventory_full, get_item_in_slot, get_item, appraise_item_value, appraise_item_power, find_element, find_better_unequipped_armor, find_better_unequipped_weapon, appraise_player_power, get_oldest_pending_flow_engagement, get_oldest_pending_non_flow_engagement, };
export * from './achievements';
/////////////////////
//# sourceMappingURL=index.js.map