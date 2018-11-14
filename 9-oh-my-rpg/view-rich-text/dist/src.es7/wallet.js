import { ALL_CURRENCIES, get_currency_amount } from '@oh-my-rpg/state-wallet';
import * as RichText from '@offirmo/rich-text-format';
function render_currency_amount(currency, amount) {
    return RichText.inline_fragment()
        .addClass('currency--' + currency)
        .pushInlineFragment('' + amount, { id: 'amount' }) // TODO format according to locale?
        .pushText(' ' + currency + (amount === 1 ? '' : 's')) // TODO localize properly ;)
        .done();
}
function render_wallet(wallet) {
    const $doc_list = RichText.unordered_list()
        .addClass('inventory--wallet')
        .done();
    ALL_CURRENCIES.forEach((currency) => {
        const amount = get_currency_amount(wallet, currency);
        $doc_list.$sub[currency] = render_currency_amount(currency, amount);
    });
    const $doc = RichText.block_fragment()
        .pushHeading('Wallet:', { id: 'header' })
        .pushNode($doc_list, { id: 'list' })
        .done();
    return $doc;
}
export { render_currency_amount, render_wallet, };
//# sourceMappingURL=wallet.js.map