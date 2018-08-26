import { InventorySlot } from '@oh-my-rpg/definitions'
import {
	MAX_ENHANCEMENT_LEVEL,
	Armor,
	get_damage_reduction_interval as get_armor_damage_reduction_interval
} from '@oh-my-rpg/logic-armors'
import * as RichText from '@offirmo/rich-text-format'
import { i18n_messages as I18N_ARMORS } from '@oh-my-rpg/logic-armors'

import { RenderItemOptions } from './types'
import { DEFAULT_RENDER_ITEM_OPTIONS } from './consts'

function render_armor_name(i: Armor): RichText.Document {
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

function render_armor(i: Armor, options: RenderItemOptions = DEFAULT_RENDER_ITEM_OPTIONS): RichText.Document {
	if (i.slot !== InventorySlot.armor)
		throw new Error(`render_armor(): can't render a ${i.slot}!`)

	const $node_quality = RichText.span().pushText(i.quality).done()

	const [min, max] = get_armor_damage_reduction_interval(i)
	const $node_values = RichText.span()
		.addClass('armor--values')
		.pushText(`[${min} - ${max}]`)
		.done()

	const builder = RichText.span()
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

function render_armor_short(i: Armor, options: RenderItemOptions = DEFAULT_RENDER_ITEM_OPTIONS): RichText.Document {
	const $doc = render_armor(i, options)

	$doc.$classes = $doc.$classes || []
	$doc.$classes.push('item', 'item--' + i.slot, 'item--quality--' + i.quality)

	return $doc
}

function render_armor_detailed(i: Armor): RichText.Document {
	const $node_title = render_armor_short(i)
	const $node_quality = RichText.span()
		.addClass('item--quality--' + i.quality)
		.pushText(i.quality)
		.done()
	const $node_enhancement = RichText.span()
		.addClass('item--enhancement')
		.pushText(`${i.enhancement_level}/${MAX_ENHANCEMENT_LEVEL}`)
		.done()
	const [min, max] = get_armor_damage_reduction_interval(i)
	const $node_values = RichText.span()
		.addClass('armor--values')
		.pushText(`absorbs damage: ${min} - ${max}`)
		.done()

	const builder = RichText.block_fragment()
		.pushNode($node_title, 'title')
		.pushLineBreak()
		.pushText('quality: ')
		.pushNode($node_quality, 'quality')
		.pushLineBreak()
		.pushText('enhancement: ')
		.pushNode($node_enhancement, 'enhancement')
		.pushLineBreak()
		.pushNode($node_values, 'values')

	return builder.done()
}

export {
	render_armor_short,
	render_armor_detailed,
}
