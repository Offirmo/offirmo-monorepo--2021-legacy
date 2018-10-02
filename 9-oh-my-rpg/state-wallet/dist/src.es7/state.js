/////////////////////
import { SCHEMA_VERSION } from './consts';
import { Currency, } from './types';
/////////////////////
const ALL_CURRENCIES = [
    Currency.coin,
    Currency.token,
];
function create() {
    return {
        schema_version: SCHEMA_VERSION,
        revision: 0,
        coin_count: 0,
        token_count: 0,
    };
}
/////////////////////
function currency_to_state_entry(currency) {
    switch (currency) {
        case Currency.coin:
        case Currency.token:
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
function remove_amount(state, currency, amount) {
    if (amount <= 0)
        throw new Error('state-wallet: can’t remove a <= 0 amount');
    if (amount > get_currency_amount(state, currency))
        throw new Error('state-wallet: can’t remove more than available, no credit !');
    return change_amount_by(state, currency, -amount);
}
/////////////////////
function get_currency_amount(state, currency) {
    return state[currency_to_state_entry(currency)];
}
function* iterables_currency(state) {
    yield* ALL_CURRENCIES;
}
/////////////////////
export { ALL_CURRENCIES, create, add_amount, remove_amount, get_currency_amount, iterables_currency, };
/////////////////////
//# sourceMappingURL=state.js.map