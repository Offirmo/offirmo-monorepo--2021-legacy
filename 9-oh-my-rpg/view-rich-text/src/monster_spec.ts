import { expect } from 'chai'

import { generate_random_demo_monster } from '@oh-my-rpg/logic-monsters'
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg/client-node/src/services/rich_text_to_ansi')

import {
	render_monster,
} from '.'


describe('🔠  view to @offirmo/rich-text-format - monster', function() {

	describe('demo', function() {
		it('shows off', () => {
			for(let i = 0; i < 10; ++i) {
				const m = generate_random_demo_monster()
				const $doc = render_monster(m)
				//console.log(prettify_json($doc))
				const str = rich_text_to_ansi($doc)
				// should just not throw
			}
		})
	})
})
