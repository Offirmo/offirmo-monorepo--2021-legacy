import { InventorySlot, Item } from '@oh-my-rpg/definitions'
import {
	Armor,
	get_damage_reduction_interval as get_armor_damage_reduction_interval
} from '@oh-my-rpg/logic-armors'
import {
	Weapon,
	get_damage_interval as get_weapon_damage_interval
} from '@oh-my-rpg/logic-weapons'

import * as RichText from '@oh-my-rpg/rich-text-format'

import { i18n_messages as I18N_ARMORS } from '@oh-my-rpg/logic-armors'
import { i18n_messages as I18N_WEAPONS } from '@oh-my-rpg/logic-weapons'


function render_armor_name(i: Armor): RichText.Document {
	if (i.slot !== InventorySlot.armor)
		throw new Error(`render_armor(): can't render a ${i.slot}!`)

	const _ = I18N_ARMORS.en as any
	const b = _.armor.base[i.base_hid]
	const q1 = _.armor.qualifier1[i.qualifier1_hid]
	const q2 = _.armor.qualifier2[i.qualifier2_hid]

	const builder = RichText.span()
		.addClass('item__name')
		.pushText(
			q2.startsWith('of')
				? '{{q1|Capitalize}} {{base|Capitalize}} {{q2|Capitalize}}'
				: '{{q2|Capitalize}} {{q1|Capitalize}} {{base|Capitalize}}'
		)

	if (i.enhancement_level) {
		const $node_enhancement = RichText.span()
			.addClass('item--enhancement')
			.pushText(`+${i.enhancement_level}`)
			.done()

		builder.pushText(' ').pushNode($node_enhancement, 'enhancement')
	}

	const $doc = builder.done()
	$doc.$sub.base = RichText.span().pushText(b).done()
	$doc.$sub.q1 = RichText.span().pushText(q1).done()
	$doc.$sub.q2 = RichText.span().pushText(q2).done()

	return $doc
}

function render_weapon_name(i: Weapon): RichText.Document {
	if (i.slot !== InventorySlot.weapon)
		throw new Error(`render_weapon(): can't render a ${i.slot}!`)

	const _ = I18N_WEAPONS.en as any
	const b = _.weapon.base[i.base_hid]
	const q1 = _.weapon.qualifier1[i.qualifier1_hid]
	const q2 = _.weapon.qualifier2[i.qualifier2_hid]

	const builder = RichText.span()
		.addClass('item__name')
		.pushText(
			q2.startsWith('of')
				? '{{q1|Capitalize}} {{base|Capitalize}} {{q2|Capitalize}}'
				: '{{q2|Capitalize}} {{q1|Capitalize}} {{base|Capitalize}}'
		)

	if (i.enhancement_level) {
		const $node_enhancement = RichText.span()
			.addClass('item--enhancement')
			.pushText(`+${i.enhancement_level}`)
			.done()

		builder.pushText(' ').pushNode($node_enhancement, 'enhancement')
	}

	const $doc = builder.done()
	$doc.$sub.base = RichText.span().pushText(b).done()
	$doc.$sub.q1 = RichText.span().pushText(q1).done()
	$doc.$sub.q2 = RichText.span().pushText(q2).done()

	return $doc
}

interface RenderItemOptions {
	display_quality?: boolean
	display_values?: boolean
}
const DEFAULT_RENDER_ITEM_OPTIONS = {
	display_quality: true,
	display_values: true,
}

function render_armor(i: Armor, options: RenderItemOptions = DEFAULT_RENDER_ITEM_OPTIONS): RichText.Document {
	if (i.slot !== InventorySlot.armor)
		throw new Error(`render_armor(): can't render a ${i.slot}!`)

	const $node_quality = RichText.span().pushText(i.quality).done()

	const [min, max] = get_armor_damage_reduction_interval(i)
	const $node_values = RichText.span()
		.addClass('armor--values')
		.pushText(`[${min} ↔ ${max}]`)
		.done()

	const builder = RichText.span()
		.addClass('item', 'item--armor', 'item--quality--' + i.quality)
		.pushRawNode($node_quality, 'quality')
		.pushRawNode(render_armor_name(i), 'name')
		.pushRawNode($node_values, 'values')

	if(options.display_quality)
		builder.pushText('{{quality}} ')

	builder.pushText('{{name}}')

	if(options.display_values)
		builder.pushText(' {{values}}')

	return builder.done()
}

function render_weapon(i: Weapon, options: RenderItemOptions = DEFAULT_RENDER_ITEM_OPTIONS): RichText.Document {
	if (i.slot !== InventorySlot.weapon)
		throw new Error(`render_weapon(): can't render a ${i.slot}!`)

	const $node_quality = RichText.span().pushText(i.quality).done()

	const [min, max] = get_weapon_damage_interval(i)
	const $node_values = RichText.span()
		.addClass('weapon--values')
		.pushText(`[${min} ↔ ${max}]`)
		.done()

	const builder = RichText.span()
		.addClass('item', 'item--weapon', 'item--quality--' + i.quality)
		.pushRawNode($node_quality, 'quality')
		.pushRawNode(render_weapon_name(i), 'name')
		.pushRawNode($node_values, 'values')

	if(options.display_quality)
		builder.pushText('{{quality}} ')

	builder.pushText('{{name}}')

	if(options.display_values)
		builder.pushText(' {{values}}')

	return builder.done()
}

function render_item(i: Item, options: RenderItemOptions = DEFAULT_RENDER_ITEM_OPTIONS): RichText.Document {
	if (!i)
		return RichText.span().pushText('').done()

	switch(i.slot) {
		case InventorySlot.armor:
			return render_armor(i as Armor, options)
		case InventorySlot.weapon:
			return render_weapon(i as Weapon, options)
		default:
			throw new Error(`render_item(): don't know how to render a "${i.slot}" !`)
	}
}

export {
	RenderItemOptions,
	render_armor_name,
	render_armor,
	render_weapon_name,
	render_weapon,
	render_item,
}
