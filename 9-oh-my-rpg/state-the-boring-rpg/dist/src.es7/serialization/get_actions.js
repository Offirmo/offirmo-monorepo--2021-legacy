import { get_unslotted_item } from '@oh-my-rpg/state-inventory';
import { ActionCategory, ActionType } from './types';
/////////////////////
function get_actions_for_unslotted_item(state, uuid) {
    const actions = [];
    const equip = {
        type: ActionType.equip_item,
        category: ActionCategory.inventory,
        expected_state_revision: state.revision,
        target_uuid: uuid,
    };
    actions.push(equip);
    const sell = {
        type: ActionType.sell_item,
        category: ActionCategory.inventory,
        expected_state_revision: state.revision,
        target_uuid: uuid,
    };
    actions.push(sell);
    return actions;
}
///////
function get_actions_for_element(state, uuid) {
    const actions = [];
    const as_unslotted_item = get_unslotted_item(state.inventory, uuid);
    if (as_unslotted_item)
        actions.push(...get_actions_for_unslotted_item(state, uuid));
    return actions;
}
/////////////////////
export { get_actions_for_element, };
//# sourceMappingURL=get_actions.js.map