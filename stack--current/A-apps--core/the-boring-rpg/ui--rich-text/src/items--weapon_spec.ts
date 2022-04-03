import { expect } from 'chai'

import * as RichText from '@offirmo-private/rich-text-format'
import { dump_prettified_any } from '@offirmo-private/prettify-any'

import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons'

const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')

import { render_weapon_detailed } from '.'


describe('🔠  view to @offirmo-private/rich-text-format -  weapon', function() {

	context('when not enhanced', function() {

		it('should render properly', () => {
			const $doc = render_weapon_detailed(DEMO_WEAPON_1)
			const str = RichText.to_text($doc)
			expect(str).to.be.a('string')
			expect(str).to.include('Axe')
			expect(str).to.include('Admirable')
			expect(str).to.include('Adjudicator’s')
			expect(str).not.to.include('+')
		})
	})

	context('when enhanced', function() {

		it('should render properly', () => {
			const $doc = render_weapon_detailed(DEMO_WEAPON_2)
			const str = RichText.to_text($doc)
			expect(str).to.be.a('string')
			expect(str).to.include('Bow')
			expect(str).to.include('Arcanic')
			expect(str).to.include('Ambassador’s')
			expect(str).to.include('+8')
		})
	})

	describe('demos', function() {

		it('shows off weapons', () => {

			const doc1 = render_weapon_detailed(DEMO_WEAPON_1, 2000)
			//dump_prettified_any(doc1)
			let str = rich_text_to_ansi(doc1)
			// should just not throw

			const doc2 = render_weapon_detailed(DEMO_WEAPON_2, 2000)
			//dump_prettified_any(doc2)
			str = rich_text_to_ansi(doc2)
			// should just not throw

			for(let i = 0; i < 10; ++i) {
				const item = generate_random_demo_weapon()
				const $doc = render_weapon_detailed(item, 2000)
				//dump_prettified_any($doc)
				const str = rich_text_to_ansi($doc)
				//console.log(str)
				// should just not throw
			}
		})
	})
})
