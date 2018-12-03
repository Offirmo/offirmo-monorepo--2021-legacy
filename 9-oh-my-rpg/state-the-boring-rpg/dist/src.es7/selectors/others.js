import { ITEM_SLOTS } from '@oh-my-rpg/definitions';
import { get_snapshot } from '@oh-my-rpg/state-energy';
import { appraise_value, appraise_power } from '@oh-my-rpg/logic-shop';
import { get_item as _get_item, get_item_in_slot as _get_item_in_slot, } from '@oh-my-rpg/state-inventory';
import { get_oldest_queued_flow, get_oldest_queued_non_flow, } from "@oh-my-rpg/state-engagement";
import { get_engagement_message } from '../engagement';
import { get_achievement_snapshot_by_uuid } from "./achievements";
/////////////////////
function get_energy_snapshot(state, now) {
    return get_snapshot(state.energy, now);
}
function appraise_item_value(state, uuid) {
    const item = _get_item(state.inventory, uuid);
    if (!item)
        throw new Error('appraise_item_value(): No item!');
    return appraise_value(item);
}
function appraise_item_power(state, uuid) {
    const item = _get_item(state.inventory, uuid);
    if (!item)
        throw new Error('appraise_item_power(): No item!');
    return appraise_power(item);
}
// TODO
function appraise_player_power(state) {
    let power = 1;
    ITEM_SLOTS.forEach((slot) => {
        const item = _get_item_in_slot(state.inventory, slot);
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
    return possible_achievement || _get_item(state.inventory, uuid);
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
export { get_energy_snapshot, appraise_item_value, appraise_item_power, find_element, appraise_player_power, get_oldest_pending_flow_engagement, get_oldest_pending_non_flow_engagement, };
export * from './achievements';
/////////////////////
//# sourceMappingURL=others.js.map