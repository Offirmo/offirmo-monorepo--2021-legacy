"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze = require("deep-freeze-strict");
const consts_1 = require("./consts");
const types_1 = require("./types");
exports.Currency = types_1.Currency;
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
    return `${currency}_count`;
}
function change_amount_by(state, currency, amount) {
    switch (currency) {
        case types_1.Currency.coin:
            state.coin_count += amount;
            break;
        case types_1.Currency.token:
            state.token_count += amount;
            break;
        default:
            throw new Error(`state-wallet: unrecognized currency: "${currency}`);
    }
    return state;
}
/////////////////////
function add_amount(state, currency, amount) {
    if (amount <= 0)
        throw new Error(`state-wallet: can't add a <= 0 amount`);
    return change_amount_by(state, currency, amount);
}
exports.add_amount = add_amount;
function remove_amount(state, currency, amount) {
    if (amount <= 0)
        throw new Error(`state-wallet: can't remove a <= 0 amount`);
    if (amount > get_currency_amount(state, currency))
        throw new Error(`state-wallet: can't remove more than available, no credit !`);
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
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    coin_count: 23456,
    token_count: 89,
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    // no schema_version = 0
    coin_count: 23456,
    token_count: 89,
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