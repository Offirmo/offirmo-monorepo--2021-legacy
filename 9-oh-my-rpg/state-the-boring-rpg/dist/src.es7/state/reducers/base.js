/////////////////////
import { increase_stat, rename, switch_class, } from '@oh-my-rpg/state-character';
import * as WalletState from '@oh-my-rpg/state-wallet';
import * as InventoryState from '@oh-my-rpg/state-inventory';
import * as EngagementState from '@oh-my-rpg/state-engagement';
import { Currency } from '@oh-my-rpg/state-wallet';
import { appraise_item_value, } from '../../selectors';
import { get_lib_SEC } from '../../sec';
import { _refresh_achievements } from './achievements';
/////////////////////
function _receive_stat_increase(state, stat, amount = 1) {
    return Object.assign({}, state, { avatar: increase_stat(get_lib_SEC(), state.avatar, stat, amount) });
}
function _receive_item(state, item) {
    // inventory shouldn't be full since we prevent playing in this case
    return Object.assign({}, state, { inventory: InventoryState.add_item(state.inventory, item) });
}
function _receive_coins(state, amount) {
    return Object.assign({}, state, { wallet: WalletState.add_amount(state.wallet, Currency.coin, amount) });
}
function _receive_tokens(state, amount) {
    return Object.assign({}, state, { wallet: WalletState.add_amount(state.wallet, Currency.token, amount) });
}
/////////////////////
function on_start_session(state) {
    // new achievements may have appeared
    // (new content = not the same as a migration)
    return _refresh_achievements(state);
}
function equip_item(state, uuid) {
    state = Object.assign({}, state, { inventory: InventoryState.equip_item(state.inventory, uuid), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function sell_item(state, uuid) {
    const price = appraise_item_value(state, uuid);
    state = Object.assign({}, state, { inventory: InventoryState.remove_item_from_unslotted(state.inventory, uuid), wallet: WalletState.add_amount(state.wallet, Currency.coin, price), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function rename_avatar(state, new_name) {
    state = Object.assign({}, state, { avatar: rename(get_lib_SEC(), state.avatar, new_name), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function change_avatar_class(state, new_class) {
    state = Object.assign({}, state, { avatar: switch_class(get_lib_SEC(), state.avatar, new_class), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function acknowledge_engagement_msg_seen(state, uid) {
    return Object.assign({}, state, { engagement: EngagementState.acknowledge_seen(state.engagement, uid), revision: state.revision + 1 });
}
/////////////////////
export { _receive_stat_increase, _receive_item, _receive_coins, _receive_tokens, acknowledge_engagement_msg_seen, on_start_session, equip_item, sell_item, rename_avatar, change_avatar_class, };
//# sourceMappingURL=base.js.map