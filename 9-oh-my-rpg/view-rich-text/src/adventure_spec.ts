import { expect } from 'chai'
const strip_ansi = require('strip-ansi')

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import { ALL_GOOD_ADVENTURE_ARCHETYPES } from '@oh-my-rpg/logic-adventures'
import {
	Adventure,
	create,
	play,
	DEMO_ADVENTURE_01,
	DEMO_ADVENTURE_02,
	DEMO_ADVENTURE_03,
	DEMO_ADVENTURE_04,
} from '@oh-my-rpg/state-the-boring-rpg'

const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi')

import { render_adventure } from '.'

const prettyjson = require('prettyjson')
function prettify_json(data: any, options = {}) {
	return prettyjson.render(data, options)
}

describe('📃  adventure rendering', function() {

	it('should render properly - with gain of skills', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_01)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('You were attacked and nearly killed')
		expect(str).to.include('L7 elite★ chicken 🐓')
		expect(str).to.include('+1 luck!')
		expect(str).to.include('\nCharacter improvement:')
	})

	it('should render properly - with gain of coins', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_02)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('A dying man on the street left you everything he had.')
		expect(str).to.include('You gained')
		expect(str).to.include('1234 coins')
		expect(str).to.include('\nLoot:')
	})

	it('should render properly - with gain of item(s)', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_03)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('You come across an old man with eccentric apparel')
		expect(str).to.include('\nLoot:\n - ⚔  uncommon Adjudicator’s Admirable Axe [19 ↔ 133]')
	})

	it('should render properly - with gain of item improvement', () => {
		const $doc = render_adventure(DEMO_ADVENTURE_04)
		//console.log(prettify_json($doc))

		const str = strip_ansi(rich_text_to_ansi($doc))
		console.log(str)
		expect(str).to.be.a('string')
		expect(str).to.include('You won\'t take back the princess!')
		expect(str).to.include('\nLoot:\n - 💰  123 coins')
		expect(str).to.include('\nItem improvement:')
	})

	describe('adventures', function() {
		beforeEach(() => xxx_internal_reset_prng_cache())

		ALL_GOOD_ADVENTURE_ARCHETYPES
			//.slice(0, 1)
			.forEach(({hid, good}, index) => {
			describe(`${good ? '✅' : '🚫'}  adventure #${index} "${hid}"`, function() {
				it('should be playable', () => {
					let state = create()
					state = play(state, hid)

					const $doc = render_adventure(state.last_adventure!)
					//console.log(prettify_json($doc))
					const str = rich_text_to_ansi($doc)
					//console.log(str)
					// should just not throw
				})
			})
		})
	})
})
