"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const state_character_1 = require("@oh-my-rpg/state-character");
const WalletState = tslib_1.__importStar(require("@oh-my-rpg/state-wallet"));
const InventoryState = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const EngagementState = tslib_1.__importStar(require("@oh-my-rpg/state-engagement"));
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const selectors_1 = require("../../selectors");
const sec_1 = require("../../sec");
const achievements_1 = require("./achievements");
/////////////////////
function _receive_stat_increase(state, stat, amount = 1) {
    return Object.assign({}, state, { avatar: state_character_1.increase_stat(sec_1.get_lib_SEC(), state.avatar, stat, amount) });
}
exports._receive_stat_increase = _receive_stat_increase;
function _receive_item(state, item) {
    // inventory shouldn't be full since we prevent playing in this case
    return Object.assign({}, state, { inventory: InventoryState.add_item(state.inventory, item) });
}
exports._receive_item = _receive_item;
function _receive_coins(state, amount) {
    return Object.assign({}, state, { wallet: WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, amount) });
}
exports._receive_coins = _receive_coins;
function _receive_tokens(state, amount) {
    return Object.assign({}, state, { wallet: WalletState.add_amount(state.wallet, state_wallet_1.Currency.token, amount) });
}
exports._receive_tokens = _receive_tokens;
/////////////////////
function on_start_session(state) {
    // new achievements may have appeared
    // (new content = not the same as a migration)
    return achievements_1._refresh_achievements(state);
}
exports.on_start_session = on_start_session;
function equip_item(state, uuid) {
    state = Object.assign({}, state, { inventory: InventoryState.equip_item(state.inventory, uuid), revision: state.revision + 1 });
    return achievements_1._refresh_achievements(state);
}
exports.equip_item = equip_item;
function sell_item(state, uuid) {
    const price = selectors_1.appraise_item_value(state, uuid);
    state = Object.assign({}, state, { inventory: InventoryState.remove_item_from_unslotted(state.inventory, uuid), wallet: WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, price), revision: state.revision + 1 });
    return achievements_1._refresh_achievements(state);
}
exports.sell_item = sell_item;
function rename_avatar(state, new_name) {
    state = Object.assign({}, state, { avatar: state_character_1.rename(sec_1.get_lib_SEC(), state.avatar, new_name), revision: state.revision + 1 });
    return achievements_1._refresh_achievements(state);
}
exports.rename_avatar = rename_avatar;
function change_avatar_class(state, new_class) {
    state = Object.assign({}, state, { avatar: state_character_1.switch_class(sec_1.get_lib_SEC(), state.avatar, new_class), revision: state.revision + 1 });
    return achievements_1._refresh_achievements(state);
}
exports.change_avatar_class = change_avatar_class;
function acknowledge_engagement_msg_seen(state, uid) {
    return Object.assign({}, state, { engagement: EngagementState.acknowledge_seen(state.engagement, uid), revision: state.revision + 1 });
}
exports.acknowledge_engagement_msg_seen = acknowledge_engagement_msg_seen;
//# sourceMappingURL=base.js.map