import { expect } from 'chai'

import * as RichText from '@offirmo-private/rich-text-format'

import {
	Currency,
	DEMO_STATE,
	create as create_wallet,
	add_amount,
} from '@oh-my-rpg/state-wallet'

const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')

import {
	render_wallet,
} from '.'


describe('🔠  view to @offirmo-private/rich-text-format - wallet', function() {

	context('when empty', function() {

		it('should render properly', () => {
			const wallet = create_wallet()
			const $doc = render_wallet(wallet)
			const str = RichText.to_text($doc)

			expect(str).to.be.a('string')
			expect(str).to.contain(' 0 coins')
			expect(str).to.contain(' 0 tokens')
		})
	})

	context('when not empty', function() {

		it('should render properly', () => {
			let wallet = create_wallet()
			wallet = add_amount(wallet, Currency.coin, 12345)
			wallet = add_amount(wallet, Currency.token, 67)

			const $doc = render_wallet(wallet)
			const str = RichText.to_text($doc)

			expect(str).to.be.a('string')
			expect(str).not.to.contain('0')
			expect(str).to.contain(' 12345 coins')
			expect(str).to.contain(' 67 tokens')
		})
	})

	describe('demo', function() {
		it('shows off', () => {
			const $doc = render_wallet(DEMO_STATE)
			//console.log(prettify_json($doc))
			const str = rich_text_to_ansi($doc)
			// should just not throw
		})
	})

})
