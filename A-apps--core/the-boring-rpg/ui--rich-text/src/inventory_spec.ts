import { expect } from 'chai'

import * as RichText from '@offirmo-private/rich-text-format'

import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons'
import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors'

import {
	create as create_inventory,
	equip_item,
	add_item,
	remove_item_from_unslotted,
} from '@tbrpg/state--inventory'

import {
	Currency,
	create as create_wallet,
	add_amount,
} from '@oh-my-rpg/state-wallet'

const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')

import { LIB } from './consts'
import {
	render_backpack,
	render_equipment,
	render_full_inventory,
} from '.'


describe(`🔠  ${LIB} - inventory`, function() {

	describe('backpack rendering', function() {

		context('when empty', function() {

			it('should render properly', () => {
				const inventory = create_inventory()
				const $doc = render_backpack(inventory)
				const str = RichText.to_text($doc)

				expect(str).to.be.a('string')
				expect(str).to.contain('empty')
			})
		})

		context('when not empty', function() {

			it('should render properly', () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid)

				const $doc = render_backpack(inventory)
				const str = RichText.to_text($doc)

				expect(str).to.be.a('string')
				expect(str).not.to.contain('00.')
				expect(str).to.contain('01.')
				expect(str).to.contain('05.')
				expect(str).not.to.contain('06.')
			})
		})

		describe('demo', function() {
			it('shows off', () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid)

				const $doc = render_backpack(inventory)
				//console.log(prettify_json($doc))
				const str = rich_text_to_ansi($doc)
				// should just not throw
				//console.log(str)
			})
		})
	})

	describe('active equipment rendering', function() {

		context('when empty', function() {

			it('should render properly', () => {
				const inventory = create_inventory()
				const $doc = render_equipment(inventory)
				const str = RichText.to_text($doc)
				expect(str).to.be.a('string')
				expect(str).to.contain('armor: -')
				expect(str).to.contain('weapon: -')
			})
		})

		context('when not empty', function() {

			it('should render properly', () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, DEMO_WEAPON_1)
				inventory = add_item(inventory, DEMO_ARMOR_2)
				inventory = equip_item(inventory, DEMO_WEAPON_1.uuid)
				inventory = equip_item(inventory, DEMO_ARMOR_2.uuid)

				const $doc = render_equipment(inventory)
				const str = RichText.to_text($doc)
				expect(str).to.be.a('string')
				expect(str).to.contain('armor: Apprentice’s Brass Belt +8')
				expect(str).to.contain('weapon: Adjudicator’s Admirable Axe')
			})
		})

		describe('demo', function() {
			it('shows off', () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, DEMO_WEAPON_1)
				inventory = add_item(inventory, DEMO_ARMOR_2)
				inventory = equip_item(inventory, DEMO_WEAPON_1.uuid)
				inventory = equip_item(inventory, DEMO_ARMOR_2.uuid)

				const $doc = render_equipment(inventory)
				const str = rich_text_to_ansi($doc)
				// should just not throw
			})
		})
	})

	describe('full inventory rendering', function() {

		describe('demo', function() {
			it('shows off', () => {
				let inventory = create_inventory()
				inventory = add_item(inventory, DEMO_WEAPON_1)
				inventory = add_item(inventory, DEMO_ARMOR_2)
				inventory = equip_item(inventory, DEMO_WEAPON_1.uuid)
				inventory = equip_item(inventory, DEMO_ARMOR_2.uuid)
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_weapon())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = add_item(inventory, generate_random_demo_armor())
				inventory = remove_item_from_unslotted(inventory, inventory.unslotted[4].uuid)

				let wallet = create_wallet()
				wallet = add_amount(wallet, Currency.coin, 12345)
				wallet = add_amount(wallet, Currency.token, 67)

				const $doc = render_full_inventory(inventory, wallet)
				const str = rich_text_to_ansi($doc)
				// should just not throw
			})
		})
	})
})
