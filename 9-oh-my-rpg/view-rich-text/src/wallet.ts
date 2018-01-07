import { State as WalletState, ALL_CURRENCIES, Currency, get_currency_amount } from '@oh-my-rpg/state-wallet'

import * as RichText from '@oh-my-rpg/rich-text-format'

function render_currency_amount(currency: Currency, amount: number): RichText.Document {
	return RichText.span()
		.addClass('currency--' + currency)
		.pushNode(
			RichText.span().pushText('' + amount).done(), // TODO format according to locale?
			'amount'
		)
		.pushText(' ' + currency + (amount === 1 ? '' : 's')) // TODO localize properly ;)
		.done()
}

function render_wallet(wallet: WalletState): RichText.Document {
	const $doc_list = RichText.unordered_list()
		.addClass('inventory--wallet')
		.done()

	ALL_CURRENCIES.forEach((currency: Currency) => {
		const amount = get_currency_amount(wallet, currency)
		$doc_list.$sub[currency] = render_currency_amount(currency, amount)
	})

	const $doc = RichText.section()
		.pushNode(RichText.heading().pushText('Wallet:').done(), 'header')
		.pushNode($doc_list, 'list')
		.done()

	return $doc
}


export {
	render_currency_amount,
	render_wallet,
}
