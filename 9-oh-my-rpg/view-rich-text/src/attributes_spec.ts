import { expect } from 'chai'

import { DEMO_STATE } from '@oh-my-rpg/state-character'
const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi')


import {
	render_attributes,
	render_character_sheet,
} from '.'


describe('🔠  view to @oh-my-rpg/rich-text-format', function() {

	describe('🏋  full character sheet rendering', function() {

		describe('demo', function() {
			it('shows off', () => {
				const $doc = render_character_sheet(DEMO_STATE)
				console.log(rich_text_to_ansi($doc))
			})
		})
	})
})
