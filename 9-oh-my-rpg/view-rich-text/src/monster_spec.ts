import { expect } from 'chai'

import { generate_random_demo_monster } from '@oh-my-rpg/logic-monsters'
const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi')

import {
	render_monster,
} from '.'


describe('🗿 👻  monster rendering', function() {

	describe('demo', function() {
		it('shows off', () => {
			for(let i = 0; i < 10; ++i) {
				const m = generate_random_demo_monster()
				const doc = render_monster(m)
				//console.log(prettify_json(doc))
				console.log(rich_text_to_ansi(doc))
			}
		})
	})
})
