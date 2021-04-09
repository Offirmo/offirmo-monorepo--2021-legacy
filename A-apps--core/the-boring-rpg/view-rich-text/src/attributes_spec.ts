import { expect } from 'chai'

import { DEMO_STATE } from '@tbrpg/state--character'
const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')


import {
	render_attributes,
	render_character_sheet,
} from '.'


describe('🔠  view to @offirmo-private/rich-text-format - attributes', function() {

	describe('full character sheet rendering', function() {

		describe('demo', function() {
			it('shows off', () => {
				const $doc = render_character_sheet(DEMO_STATE)
				const str = rich_text_to_ansi($doc)
				// should just not throw
			})
		})
	})
})
