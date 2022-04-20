import { expect } from 'chai'
const strip_ansi = require('strip-ansi')

import {
	create,
	play,
	get_achievements_snapshot,
} from '@tbrpg/state'

const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')

import { render_achievements_snapshot } from '.'

describe('🔠  view to @offirmo-private/rich-text-format - achievements', function() {

	it('should render properly - demo', () => {
		const state = play(create())

		const $doc = render_achievements_snapshot(get_achievements_snapshot(state.u_state))
		//console.log(prettify_json($doc))
		const str = rich_text_to_ansi($doc)
		console.log(str)
		expect(str).to.be.a('string')
	})
})
