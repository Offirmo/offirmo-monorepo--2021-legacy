import { expect } from 'chai'

import * as RichText from '@offirmo-private/rich-text-format'

import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors'

const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')

import { render_armor_detailed } from '.'


describe('🔠  view to @offirmo-private/rich-text-format - armor', function() {

	context('when not enhanced', function() {

		it('should render properly', () => {
			const $doc = render_armor_detailed(DEMO_ARMOR_1)
			const str = RichText.to_text($doc)
			expect(str).to.be.a('string')
			expect(str).to.include('Armguards')
			expect(str).to.include('Of the ancients')
			expect(str).to.include('Bone')
			expect(str).not.to.include('+')
		})
	})

	context('when enhanced', function() {

		it('should render properly', () => {
			const $doc = render_armor_detailed(DEMO_ARMOR_2)
			const str = RichText.to_text($doc)
			expect(str).to.be.a('string')
			expect(str).to.include('Belt')
			expect(str).to.include('Brass')
			expect(str).to.include('Apprentice’s')
			expect(str).to.include('+8')
		})
	})

	describe('demos', function() {

		it('shows off armors', () => {

			const doc1 = render_armor_detailed(DEMO_ARMOR_1)
			//console.log(prettify_json(doc1))
			let str = rich_text_to_ansi(doc1)
			// should just not throw

			const doc2 = render_armor_detailed(DEMO_ARMOR_2)
			//console.log(prettify_json(doc2))
			str = rich_text_to_ansi(doc2)
			// should just not throw

			for(let i = 0; i < 10; ++i) {
				const item = generate_random_demo_armor()
				const $doc = render_armor_detailed(item)
				//console.log(prettify_json($doc))
				const str = rich_text_to_ansi($doc)
				// should just not throw
			}
		})
	})
})
