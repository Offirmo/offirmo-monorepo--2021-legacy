"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
function render_currency_amount(currency, amount) {
    return RichText.inline_fragment()
        .addClass('currency--' + currency)
        .pushInlineFragment('' + amount, { id: 'amount' }) // TODO format according to locale?
        .pushText(' ' + currency + (amount === 1 ? '' : 's')) // TODO localize properly ;)
        .done();
}
exports.render_currency_amount = render_currency_amount;
function render_wallet(wallet) {
    const $doc_list = RichText.unordered_list()
        .addClass('inventory--wallet')
        .done();
    state_wallet_1.ALL_CURRENCIES.forEach((currency) => {
        const amount = state_wallet_1.get_currency_amount(wallet, currency);
        $doc_list.$sub[currency] = render_currency_amount(currency, amount);
    });
    const $doc = RichText.block_fragment()
        .pushHeading('Wallet:', { id: 'header' })
        .pushNode($doc_list, { id: 'list' })
        .done();
    return $doc;
}
exports.render_wallet = render_wallet;
//# sourceMappingURL=wallet.js.map