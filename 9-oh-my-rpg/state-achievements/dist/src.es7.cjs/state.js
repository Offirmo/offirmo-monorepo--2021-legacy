"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const consts_1 = require("./consts");
const types_1 = require("./types");
const data_1 = tslib_1.__importDefault(require("./data"));
/////////////////////
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        statistics: {},
    };
}
exports.create = create;
/////////////////////
/////////////////////
/*
function add_amount(state: State, currency: Currency, amount: number): State {
    if (amount <= 0)
        throw new Error('state-wallet: can’t add a <= 0 amount')

    return change_amount_by(state, currency, amount)
}

function remove_amount(state: State, currency: Currency, amount: number): State {
    if (amount <= 0)
        throw new Error('state-wallet: can’t remove a <= 0 amount')

    if (amount > get_currency_amount(state, currency))
        throw new Error('state-wallet: can’t remove more than available, no credit !')

    return change_amount_by(state, currency, -amount)
}
*/
/////////////////////
// TODO memoize
function get_sorted_visible_achievements(state) {
    const { statistics } = state;
    return data_1.default
        .map((def) => {
        return {
            key: def.key,
            status: def.get_status(statistics),
        };
    })
        .filter(entry => entry.status !== types_1.AchievementStatus.hidden);
}
exports.get_sorted_visible_achievements = get_sorted_visible_achievements;
/////////////////////
//# sourceMappingURL=state.js.map