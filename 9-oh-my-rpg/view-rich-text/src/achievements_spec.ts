import { expect } from 'chai'
const strip_ansi = require('strip-ansi')

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import { ALL_GOOD_ADVENTURE_ARCHETYPES, ALL_BAD_ADVENTURE_ARCHETYPES } from '@oh-my-rpg/logic-adventures'
import {
	Adventure,
	create,
	play,
	get_achievements_snapshot,
} from '@oh-my-rpg/state-the-boring-rpg'

const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi')

import { render_achievements_snapshot } from '.'

describe('🔠  view to @offirmo/rich-text-format - achievements', function() {

	it('should render properly - demo', () => {
		const state = play(create())


		const $doc = render_achievements_snapshot(get_achievements_snapshot(state))
		//console.log(prettify_json($doc))
		const str = rich_text_to_ansi($doc)
		console.log(str)
		expect(str).to.be.a('string')
	})
})
