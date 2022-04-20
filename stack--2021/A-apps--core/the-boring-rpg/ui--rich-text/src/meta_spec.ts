import { expect } from 'chai'

import { DEMO_STATE } from '@oh-my-rpg/state-meta'
const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')

import {
	render_account_info,
} from '.'


describe('🔠  view to @offirmo-private/rich-text-format - meta', function() {

	describe('demo', function() {
		it('shows off', () => {
			const $doc = render_account_info(DEMO_STATE)
			//console.log(prettify_json($doc))
			const str = rich_text_to_ansi($doc)
			// should just not throw
		})
	})
})
