import { expect } from 'chai'

import * as RichText from '@oh-my-rpg/rich-text-format'

import { InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'
import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons'
import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors'

const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi')
const prettyjson = require('prettyjson')
function prettify_json(data: any, options = {}) {
	return prettyjson.render(data, options)
}

import {
	render_weapon,
	render_armor,
	render_item,
} from '.'


describe('⚔ 🛡 item rendering', function() {

	describe('⚔  weapon rendering', function() {

		context('when not enhanced', function() {

			it('should render properly', () => {
				const $doc = render_weapon(DEMO_WEAPON_1)
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
				const $doc = render_weapon(DEMO_WEAPON_2)
				const str = RichText.to_text($doc)
				expect(str).to.be.a('string')
				expect(str).to.include('Bow')
				expect(str).to.include('Arcanic')
				expect(str).to.include('Ambassador’s')
				expect(str).to.include('+8')
			})
		})
	})

	describe('🛡  armor rendering', function() {

		context('when not enhanced', function() {

			it('should render properly', () => {
				const $doc = render_armor(DEMO_ARMOR_1)
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
				const $doc = render_armor(DEMO_ARMOR_2)
				const str = RichText.to_text($doc)
				expect(str).to.be.a('string')
				expect(str).to.include('Belt')
				expect(str).to.include('Brass')
				expect(str).to.include('Apprentice’s')
				expect(str).to.include('+8')
			})
		})
	})

	describe('demos', function() {

		it('shows off weapons', () => {

			const doc2 = render_weapon(DEMO_WEAPON_2)
			//console.log(prettify_json(doc2))
			console.log(rich_text_to_ansi(doc2))

			const doc1 = render_weapon(DEMO_WEAPON_1)
			//console.log(prettify_json(doc1))
			console.log(rich_text_to_ansi(doc1))

			for(let i = 0; i < 10; ++i) {
				const item = generate_random_demo_weapon()
				const doc = render_weapon(item)
				//console.log(prettify_json(doc))
				console.log(rich_text_to_ansi(doc))
			}
		})

		it('shows off armors', () => {

			const doc2 = render_armor(DEMO_ARMOR_2)
			//console.log(prettify_json(doc2))
			console.log(rich_text_to_ansi(doc2))

			const doc1 = render_armor(DEMO_ARMOR_1)
			//console.log(prettify_json(doc1))
			console.log(rich_text_to_ansi(doc1))

			for(let i = 0; i < 10; ++i) {
				const item = generate_random_demo_armor()
				const doc = render_armor(item)
				//console.log(prettify_json(doc))
				console.log(rich_text_to_ansi(doc))
			}
		})
	})
})
