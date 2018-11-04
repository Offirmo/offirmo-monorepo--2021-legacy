import { expect } from 'chai'

import { DEMO_STATE } from '@oh-my-rpg/state-character'
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi')


import {
	render_attributes,
	render_character_sheet,
} from '.'


describe('🔠  view to @offirmo/rich-text-format - attributes', function() {

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
