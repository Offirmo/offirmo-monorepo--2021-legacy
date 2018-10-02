"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const types_1 = require("./types");
/////////////////////
const ALL_CURRENCIES = [
    types_1.Currency.coin,
    types_1.Currency.token,
];
exports.ALL_CURRENCIES = ALL_CURRENCIES;
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        coin_count: 0,
        token_count: 0,
    };
}
exports.create = create;
/////////////////////
function currency_to_state_entry(currency) {
    switch (currency) {
        case types_1.Currency.coin:
        case types_1.Currency.token:
            return `${currency}_count`;
        default:
            throw new Error(`state-wallet: unrecognized currency: "${currency}`);
    }
}
function change_amount_by(state, currency, amount) {
    let state_entry = currency_to_state_entry(currency);
    return Object.assign({}, state, { [state_entry]: state[state_entry] + amount, revision: state.revision + 1 });
}
/////////////////////
function add_amount(state, currency, amount) {
    if (amount <= 0)
        throw new Error('state-wallet: can’t add a <= 0 amount');
    return change_amount_by(state, currency, amount);
}
exports.add_amount = add_amount;
function remove_amount(state, currency, amount) {
    if (amount <= 0)
        throw new Error('state-wallet: can’t remove a <= 0 amount');
    if (amount > get_currency_amount(state, currency))
        throw new Error('state-wallet: can’t remove more than available, no credit !');
    return change_amount_by(state, currency, -amount);
}
exports.remove_amount = remove_amount;
/////////////////////
function get_currency_amount(state, currency) {
    return state[currency_to_state_entry(currency)];
}
exports.get_currency_amount = get_currency_amount;
function* iterables_currency(state) {
    yield* ALL_CURRENCIES;
}
exports.iterables_currency = iterables_currency;
/////////////////////
//# sourceMappingURL=state.js.map