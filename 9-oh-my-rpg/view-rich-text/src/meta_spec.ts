import { expect } from 'chai'

import { DEMO_STATE } from '@oh-my-rpg/state-meta'
const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi')

import {
	render_account_info,
} from '.'


describe('🗿 👻  meta rendering', function() {

	describe('demo', function() {
		it('shows off', () => {
			const doc = render_account_info(DEMO_STATE)
			//console.log(prettify_json(doc))
			console.log(rich_text_to_ansi(doc))
		})
	})
})
