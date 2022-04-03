/////////////////////

import { partial, capitalize } from 'lodash'
import { Enum } from 'typescript-string-enums'
import { Random, Engine } from '@offirmo/random'

import { ItemQuality, InventorySlot, Item, ITEM_SLOTS } from '@tbrpg/definitions'
import { Armor, get_damage_reduction_interval as get_armor_damage_reduction_interval } from '@oh-my-rpg/logic-armors'
import { Weapon, get_damage_interval as get_weapon_damage_interval } from '@oh-my-rpg/logic-weapons'
import { MonsterRank, Monster } from '@oh-my-rpg/logic-monsters'
import { State as InventoryState, iterables_unslotted, get_item_in_slot } from '@tbrpg/state--inventory'
import { State as WalletState, Currency, get_currency_amount } from '@oh-my-rpg/state-wallet'
import { State as CharacterState, CharacterAttribute, CHARACTER_STATS } from '@oh-my-rpg/state-character'
import { Adventure, GainType } from '@tbrpg/state'

import { TextStyle, RenderingOptions } from './types'

const DEFAULT_RENDERING_OPTIONS: RenderingOptions = {
	globalize: {
		formatMessage: (s: any) => s,
		formatNumber: (n: any) => `${n}`,
	},
	stylize: (style: string, s: string) => s
}

/////////////////////

function get_style_for_quality(quality: ItemQuality): TextStyle {
	switch (quality) {
		case ItemQuality.common:
			return TextStyle.item_quality_common
		case ItemQuality.uncommon:
			return TextStyle.item_quality_uncommon
		case ItemQuality.rare:
			return TextStyle.item_quality_rare
		case ItemQuality.epic:
			return TextStyle.item_quality_epic
		case ItemQuality.legendary:
			return TextStyle.item_quality_legendary
		case ItemQuality.artifact:
			return TextStyle.item_quality_artifact
		default:
			throw new Error(`get_style_for_quality(): Unknown ItemQuality : ${quality}`)
	}
}

function get_item_icon_for(i: Item | null): string {
	if (!i)
		return '⋯'

	switch(i.slot) {
		case InventorySlot.weapon:
			return '⚔'
		case InventorySlot.armor:
			return '🛡'
		default:
			throw new Error(`get_item_icon_for(): no icon for slot "${i.slot}" !`)
	}
}

function get_characteristic_icon_for(stat: CharacterAttribute): string {
	switch(stat) {
		case CharacterAttribute.level:
			return '👶'
		case CharacterAttribute.health:
			return '💗'
		case CharacterAttribute.mana:
			return '💙'

		case CharacterAttribute.agility:
			return '🤸'
		case CharacterAttribute.luck:
			return '🤹'
		case CharacterAttribute.strength:
			// 💪
			return '🏋'
		case CharacterAttribute.charisma:
			return '🏊'
		case CharacterAttribute.wisdom:
			// '🙏'
			return '👵'

		default:
			throw new Error(`get_characteristic_icon_for(): no icon for stat "${stat}" !`)
	}
}

///////

function render_armor(i: Armor, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	if (i.slot !== InventorySlot.armor) throw new Error(`render_armor(): can't render a ${i.slot} !`)

	const g = options.globalize

	const b = g.formatMessage(`armor/base/${i.base_hid}`, {})
	const q1 = g.formatMessage(`armor/qualifier1/${i.qualifier1_hid}`, {})
	const q2 = g.formatMessage(`armor/qualifier2/${i.qualifier2_hid}`, {})

	const parts = q2.startsWith('of')
		? [q1, b, q2]
		: [q2, q1, b]

	const name = parts.map(capitalize).join(' ')
	const enhancement_level = i.enhancement_level
		? ` +${i.enhancement_level}`
		: ''
	const [min, max] = get_armor_damage_reduction_interval(i)

	return options.stylize(get_style_for_quality(i.quality),
			`${i.quality} `
			+ options.stylize(TextStyle.important_part, name)
			+ `${enhancement_level}`
		)
		+ ` [${min} ↔ ${max}]`
}

function render_weapon(i: Weapon, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	if (i.slot !== InventorySlot.weapon) throw new Error(`render_weapon(): can't render a ${i.slot} !`)

	const g = options.globalize

	const b = g.formatMessage(`weapon/base/${i.base_hid}`, {})
	const q1 = g.formatMessage(`weapon/qualifier1/${i.qualifier1_hid}`, {})
	const q2 = g.formatMessage(`weapon/qualifier2/${i.qualifier2_hid}`, {})

	const parts = q2.startsWith('of')
		? [q1, b, q2]
		: [q2, q1, b]

	const name = parts.map(capitalize).join(' ')
	const enhancement_level = i.enhancement_level
		? ` +${i.enhancement_level}`
		: ''
	const [min, max] = get_weapon_damage_interval(i)

	return options.stylize(get_style_for_quality(i.quality),
		`${i.quality} `
		+ options.stylize(TextStyle.important_part, name)
		+ `${enhancement_level}`
		)
		+ ` [${min} ↔ ${max}]`
}

function render_item(i: Item | null, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	if (!i)
		return ''

	switch(i.slot) {
		case InventorySlot.weapon:
			return render_weapon(i as Weapon, options)
		case InventorySlot.armor:
			return render_armor(i as Armor, options)
		default:
			throw new Error(`render_item(): don't know how to render a "${i.slot}" !`)
	}
}

function render_monster(m: Monster, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	const name = m.name.split(' ').map(capitalize).join(' ')

	const icon = m.rank === MonsterRank.boss
		? '👑 '
		: m.rank === MonsterRank.elite
			? options.stylize(TextStyle.elite_mark, '★ ')
			: ''

	return `L${m.level} ${m.rank} ${options.stylize(TextStyle.important_part, name)} ${m.possible_emoji}  ${icon}`
}

function render_characteristics(state: CharacterState, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	const {last_adventure: la} = options

	return CHARACTER_STATS.map((stat: CharacterAttribute) => {
		const icon = get_characteristic_icon_for(stat)
		const label = stat
		const value = state.attributes[stat]

		const padded_label = `${label}............`.slice(0, 11)
		const padded_human_values = `.......${value}`.slice(-4)

		const update_notice = options.stylize(TextStyle.change_outline,
			la && la.gains && la.gains[stat]
			? ` recently increased by ${la.gains[stat]}! 🆙 `
			: ''
		)

		return `${icon}  ${padded_label}${padded_human_values}${update_notice}`
	}).join('\n')
}

function render_equipment(inventory: InventoryState, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	const equipped_items = ITEM_SLOTS.map(partial(get_item_in_slot, inventory))
	const {last_adventure: la} = options

	return equipped_items.map((i: Item | null, index: number) => {
		const padded_slot = `${ITEM_SLOTS[index]}  `.slice(0, 6)
		if (!i)
			return `${padded_slot}: -`

		const icon = get_item_icon_for(i)
		const label = render_item(i, options)

		const update_notice = options.stylize(TextStyle.change_outline,
			i && la && la.gains && (
					(la.gains.weapon_improvement && i.slot === 'weapon')
				|| (la.gains.armor_improvement && i.slot === 'armor')
			)
			? ` enhanced! 🆙 `
			: ''
		)

		return `${padded_slot}: ${icon}  ${label}${update_notice}`
	}).join('\n')
}

function render_inventory(inventory: InventoryState, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	const misc_items = Array.from(iterables_unslotted(inventory))
	const {last_adventure: la} = options

	return misc_items.map((i: Item, index: number) => {
		const icon = get_item_icon_for(i)
		const label = render_item(i, options)
		const padded_human_index = `  ${'abcdefghijklmnopqrstuvwxyz'[index]}.`.slice(-3)

		const update_notice = options.stylize(TextStyle.change_outline,
			i && la && (la.gains.weapon === i || la.gains.armor === i)
			? ` new! 🎁`
			: ''
		)

		return `${padded_human_index} ${icon}  ${label}${update_notice}`
	}).join('\n')
}

function render_wallet(wallet: WalletState, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	const {last_adventure: la} = options

	const coins_update_notice = options.stylize(TextStyle.change_outline,
		la && la.gains.coins
		? ` gained ${la.gains.coins}! 🆙 `
		: ''
	)
	const tokens_update_notice = options.stylize(TextStyle.change_outline,
		la && la.gains.tokens
		? ` gained ${la.gains.tokens}! 🆙 `
		: ''
	)

	return `💰  ${wallet.coin_count} coins${coins_update_notice}
💠  ${wallet.token_count} tokens${tokens_update_notice}`
}

function render_adventure_gain(a: Adventure, gain_type: GainType, gains_for_display: {[k:string]: string | number}): string {
	switch(gain_type) {
		case 'weapon':
			return `⚔  New item: ${gains_for_display.formattedWeapon}`
		case 'armor':
			return `🛡  New item: ${gains_for_display.formattedArmor}`
		case 'coins':
			return `💰  Received ${gains_for_display.formattedCoins} coins`
		case 'level':
			return `🆙  Leveled up!`
		case 'health':
		case 'mana':
		case 'strength':
		case 'agility':
		case 'charisma':
		case 'wisdom':
		case 'luck':
			return `🆙  ${gain_type} increased!`
		default:
			return `🔥  TODO gain message for "${gain_type}"`
	}
}

function render_adventure(a: Adventure, options: RenderingOptions = DEFAULT_RENDERING_OPTIONS): string {
	const g = options.globalize

	const formattedWeapon = a.gains.weapon ? render_item(a.gains.weapon, options) : ''
	const formattedArmor = a.gains.armor ? render_item(a.gains.armor, options) : ''
	const formattedItem = formattedWeapon || formattedArmor
	const charac_name: string = Enum.keys(CharacterAttribute).find(stat => !!a.gains[stat]) as string

	// formatting to natural language
	const gains_for_display = {
		...(a.gains as any), // ignore warning for weapons etc.
		formattedCoins: a.gains.coins ? g.formatNumber(a.gains.coins) : '',
		formattedWeapon,
		formattedArmor,
		formattedItem,
		charac_name,
		charac: (a.gains as any)[charac_name],
	}

	const encounter = a.encounter ? render_monster(a.encounter, options) : ''

	const raw_message_multiline = g.formatMessage(`adventures/${a.hid}`, {
		encounter,
		...gains_for_display
	})
	const raw_message = raw_message_multiline
		.split('\n')
		.map((s: string) => s.trim())
		.filter((s: string) => !!s)
		.join(' ')

	const gained: GainType[] = Object.keys(a.gains)
		.filter((gain_type: GainType) => !!(a.gains as any)[gain_type])
		.map((gain_type: GainType) => {
			if (!Enum.isType(GainType, gain_type))
				throw new Error(`render_adventure(): unexpected gain type "${gain_type}"!`)
			return gain_type
		})

	//console.log({gained, gains_for_display})

	const msg_parts = [
		raw_message,
		'',
		...gained.map((gain_type: GainType) => render_adventure_gain(a, gain_type, gains_for_display))
		]

	return msg_parts.join('\n')
}

/////////////////////

export {
	TextStyle,
	RenderingOptions,
	DEFAULT_RENDERING_OPTIONS,

	render_weapon,
	render_armor,
	render_item,
	render_monster,
	render_characteristics,
	render_equipment,
	render_inventory,
	render_wallet,
	render_adventure,
}

/////////////////////
