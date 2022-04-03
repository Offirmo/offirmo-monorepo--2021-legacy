import { Immutable } from '@offirmo-private/ts-types'
import { InventorySlot, ITEM_SLOTS } from '@tbrpg/definitions'
import { CHARACTER_ATTRIBUTES, CharacterAttribute } from '@tbrpg/state--character'
import { i18n_messages as I18N_ADVENTURES } from '@oh-my-rpg/logic-adventures'
import { Adventure } from '@tbrpg/state'
import { ALL_CURRENCIES, Currency, get_currency_amount } from '@oh-my-rpg/state-wallet'

import * as RichText from '@offirmo-private/rich-text-format'

import { render_item_short } from './items'
import { render_currency_amount } from './wallet'
import { render_monster } from './monster'
import { RenderItemOptions } from './types'
import { DEFAULT_RENDER_ITEM_OPTIONS } from './consts'


function render_adventure(a: Immutable<Adventure>, options: Immutable<RenderItemOptions> = DEFAULT_RENDER_ITEM_OPTIONS): RichText.Document {
	const gains: any = a.gains // alias for typing

	// in this special function, we'll be:
	// 1. generically filling a RichText.Document with any possible sub-elements,
	//    since we don't know whether the adventure messages use them or not.
	const $story_sub_elements: { [k: string]: RichText.Document } = {}
	// encounter
	// item
	// attr, attr_name,
	// level, health, mana, strength, agility, charisma, wisdom, luck
	// coin
	// improved_item
	// 2. also generate some "summaries" for some gains
	let $listing_of_loot = RichText.block_fragment().done()
	let $listing_of_character_improvement = RichText.block_fragment().done()
	let $listing_of_item_improvement = RichText.block_fragment().done()
	// make sure that we handled every possible outcomes
	const handled_adventure_outcomes_so_far: Set<string> = new Set()

	/////// Loot ///////
	;(function render_loot(): void {
		const $loot_list = RichText.unordered_list().done()

		ITEM_SLOTS.forEach((slot: InventorySlot) => {
			//console.info('handling adventure outcome [l1]: ' + slot)
			if (!gains[slot]) return

			const $doc = render_item_short(gains[slot], options)

			$story_sub_elements.item = $doc
			$story_sub_elements.item_slot = RichText.inline_fragment().pushText(slot).done()
			$story_sub_elements[slot] = $doc
			$loot_list.$sub[slot] = $doc

			handled_adventure_outcomes_so_far.add(slot)
		})

		ALL_CURRENCIES.forEach((currency: Currency) => {
			//console.info('handling adventure outcome [l2]: ' + currency)
			if (!gains[currency]) return

			const $doc = render_currency_amount(currency, gains[currency], { render_unit: false })

			$loot_list.$sub[currency] = $story_sub_elements[currency] = $doc

			handled_adventure_outcomes_so_far.add(currency)
		})

		const hasLoot = !!Object.keys($loot_list.$sub).length
		if (hasLoot)
			$listing_of_loot = RichText.block_fragment()
				//.pushLineBreak()
				.pushText('Loot:')
				.pushNode($loot_list, {id: 'list'})
				.done()
	})()

	/////// Attributes / knowledge ///////
	;(function render_character_improvement(): void {
		const $improvement_list = RichText.unordered_list().done()

		CHARACTER_ATTRIBUTES.forEach((attr: CharacterAttribute) => {
			//console.info('handling adventure outcome [c1]: ' + attr)
			if (!gains[attr]) return

			$story_sub_elements.attr_name = RichText.inline_fragment().pushText(attr).done()

			const $doc_attr_gain_value = RichText.inline_fragment().pushText('' + gains[attr]).done()
			$story_sub_elements.attr = $doc_attr_gain_value // generic
			$story_sub_elements[attr] = $doc_attr_gain_value // precise


			$improvement_list.$sub[attr] = attr === 'level'
				? RichText.inline_fragment().pushText('🆙 You leveled up!').done()
				: RichText.inline_fragment().pushText(`You improved your ${attr} by ${gains[attr]}!`).done() // TODO improve

			handled_adventure_outcomes_so_far.add(attr)
		})

		// TODO one day spells / skills

		const has_improvement = !!Object.keys($improvement_list.$sub).length
		if (has_improvement)
			$listing_of_character_improvement = RichText.block_fragment()
				//.pushLineBreak()
				.pushText('Character improvement:')
				.pushNode($improvement_list, {id: 'list'})
				.done()
	})()

	/////// Item enhancement ///////
	;(function render_item_improvement(): void {
		const has_improvement = gains.improvementⵧarmor || gains.improvementⵧweapon
		const $improvement_list = RichText.unordered_list().done()

		// TODO
		if (gains.improvementⵧarmor)
			handled_adventure_outcomes_so_far.add('improvementⵧarmor')
		if (gains.improvementⵧweapon)
			handled_adventure_outcomes_so_far.add('improvementⵧweapon')

		if (has_improvement)
			$listing_of_item_improvement = RichText.block_fragment()
				//.pushLineBreak()
				.pushText('Item improvement:')
				.pushNode($improvement_list, {id: 'list'})
				.done()
	})()

	/////// Encounter ///////
	if (a.encounter)
		$story_sub_elements.encounter = render_monster(a.encounter)

	/////// checks ///////
	const active_adventure_outcomes = Object.keys(gains).filter(prop => !!gains[prop])
	const unhandled_adventure_outcomes = active_adventure_outcomes.filter(prop => !handled_adventure_outcomes_so_far.has(prop))
	if (unhandled_adventure_outcomes.length) {
		console.error(`render_adventure(): *UN*handled outcome properties: "${unhandled_adventure_outcomes}"!`)
		console.info(`render_adventure(): handled outcome properties: "${Array.from(handled_adventure_outcomes_so_far.values())}"`)
		throw new Error('render_adventure(): unhandled outcome properties!')
	}

	/////// Final wrap-up //////
	const _ = I18N_ADVENTURES.en as any
	const story = _.adventures[a.hid]

	const $doc = RichText.block_fragment()
		.pushText(story)
		//.pushLineBreak()
		//.pushNode($listing_of_loot, 'loot')
		//.pushNode($listing_of_item_improvement, 'item_improv')
		//.pushNode($listing_of_character_improvement, 'char_improv')
		.done()

	$doc.$sub = {
		...$doc.$sub,
		...$story_sub_elements,
	}

	return $doc
}


export {
	render_adventure,
}
