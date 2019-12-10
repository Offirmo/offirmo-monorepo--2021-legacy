import { expect } from 'chai'
const strip_ansi = require('strip-ansi')

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import { ALL_GOOD_ADVENTURE_ARCHETYPES, ALL_BAD_ADVENTURE_ARCHETYPES } from '@oh-my-rpg/logic-adventures'
import {
	create,
	play,
	DEMO_ADVENTURE_01,
	DEMO_ADVENTURE_02,
	DEMO_ADVENTURE_03,
	DEMO_ADVENTURE_04,
} from '@tbrpg/state'

const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')


import { render_adventure } from '.'

describe('🔠  view to @offirmo-private/rich-text-format - adventure', function() {

	it('should render properly - with gain of skills', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_01)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		//console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('You were attacked and nearly killed')
		expect(str).to.include('L7')
		expect(str).to.include('elite')
		expect(str).to.include('chicken')
		expect(str).to.include('+1 luck!')
	})

	it('should render properly - with gain of coins', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_02)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		//console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('A dying man on the street left you everything he had.')
		expect(str).to.include('You gain')
		expect(str).to.include('1234 coins')
	})

	it('should render properly - with gain of item(s)', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_03)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		//console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('You come across an old man with eccentric apparel')
		expect(str).to.include('Adjudicator’s Admirable Axe')
	})

	it('should render properly - with gain of item improvement', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_04)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		//console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('You won’t take back the princess!')
		expect(str).to.include('123 coins')
		expect(str).to.include('enchant')
	})

	describe('adventures', function() {
		beforeEach(() => xxx_internal_reset_prng_cache())

		ALL_GOOD_ADVENTURE_ARCHETYPES
			.forEach(({hid, good}, index) => {
				describe(`✅  adventure #${index} "${hid}"`, function() {
					it('should be playable', () => {
						let state = create()
						state = play(state, undefined, hid)

						const $doc = render_adventure(state.u_state.last_adventure!)
						//console.log(prettify_json($doc))

						// should just not throw
						const str = rich_text_to_ansi($doc)
						//console.log(str)
					})
				})
			})

		ALL_BAD_ADVENTURE_ARCHETYPES
			.forEach(({hid, good}, index) => {
				describe(`❎  adventure #${index} "${hid}"`, function() {
					it('should be playable', () => {
						let state = create()

						state = play(state)
						state = play(state)
						state = play(state)
						state = play(state)
						state = play(state)
						state = play(state)
						state = play(state)

						state = play(state, undefined, hid)

						const $doc = render_adventure(state.u_state.last_adventure!)
						//console.log(prettify_json($doc))
						const str = rich_text_to_ansi($doc)
						//console.log(str)
						// should just not throw
					})
				})
			})
	})
})
