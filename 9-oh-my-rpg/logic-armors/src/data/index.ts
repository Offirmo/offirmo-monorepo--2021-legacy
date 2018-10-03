import { I18nMessages } from '@oh-my-rpg/definitions'

import { ArmorPartType } from '../types'
import { messages as en } from './i18n_en'

const i18n_messages: I18nMessages = {
	en,
}

interface RawArmorEntry {
	type: 'base' | 'qualifier1' | 'qualifier2'
	hid: string
}

const ENTRIES: Readonly<RawArmorEntry>[] = [
	{ type: 'base', hid: 'armguards' },
	{ type: 'base', hid: 'belt' },
	{ type: 'base', hid: 'boots' },
	{ type: 'base', hid: 'bracers' },
	{ type: 'base', hid: 'breastplate' },
	{ type: 'base', hid: 'cloak' },
	{ type: 'base', hid: 'crown' },
	{ type: 'base', hid: 'gauntlets' },
	{ type: 'base', hid: 'gloves' },
	{ type: 'base', hid: 'greaves' },
	{ type: 'base', hid: 'hat' },
	{ type: 'base', hid: 'helmet' },
	{ type: 'base', hid: 'leggings' },
	{ type: 'base', hid: 'mantle' },
	{ type: 'base', hid: 'pants' },
	{ type: 'base', hid: 'robe' },
	{ type: 'base', hid: 'shield' },
	{ type: 'base', hid: 'shoes' },
	{ type: 'base', hid: 'shoulders' },
	{ type: 'base', hid: 'socks' },

	{ type: 'qualifier1', hid: 'bone' },
	{ type: 'qualifier1', hid: 'brass' },
	{ type: 'qualifier1', hid: 'embroidered' },
	{ type: 'qualifier1', hid: 'cardboard' },
	{ type: 'qualifier1', hid: 'composite' },
	{ type: 'qualifier1', hid: 'consecrated' },
	{ type: 'qualifier1', hid: 'crafted' },
	{ type: 'qualifier1', hid: 'cursed' },
	{ type: 'qualifier1', hid: 'emerald' },
	{ type: 'qualifier1', hid: 'engraved' },
	{ type: 'qualifier1', hid: 'golden' },
	{ type: 'qualifier1', hid: 'heavy' },
	{ type: 'qualifier1', hid: 'holy' },
	{ type: 'qualifier1', hid: 'invincible' },
	{ type: 'qualifier1', hid: 'iron' },
	{ type: 'qualifier1', hid: 'jade' },
	{ type: 'qualifier1', hid: 'light' },
	{ type: 'qualifier1', hid: 'mechanical' },
	{ type: 'qualifier1', hid: 'mysterious' },
	{ type: 'qualifier1', hid: 'old' },
	{ type: 'qualifier1', hid: 'onyx' },
	{ type: 'qualifier1', hid: 'powerful' },
	{ type: 'qualifier1', hid: 'practical' },
	{ type: 'qualifier1', hid: 'proven' },
	{ type: 'qualifier1', hid: 'robust' },
	{ type: 'qualifier1', hid: 'sapphire' },
	{ type: 'qualifier1', hid: 'scale' },
	{ type: 'qualifier1', hid: 'silver' },
	{ type: 'qualifier1', hid: 'simple' },
	{ type: 'qualifier1', hid: 'skeleton' },
	{ type: 'qualifier1', hid: 'solid' },
	{ type: 'qualifier1', hid: 'steel' },
	{ type: 'qualifier1', hid: 'strange' },
	{ type: 'qualifier1', hid: 'subtile' },
	{ type: 'qualifier1', hid: 'swift' },
	{ type: 'qualifier1', hid: 'unwavering' },
	{ type: 'qualifier1', hid: 'used' },
	{ type: 'qualifier1', hid: 'wooden' },

	{ type: 'qualifier2', hid: 'ancients' },
	{ type: 'qualifier2', hid: 'apprentice' },
	{ type: 'qualifier2', hid: 'beginner' },
	{ type: 'qualifier2', hid: 'brave' },
	{ type: 'qualifier2', hid: 'conqueror' },
	{ type: 'qualifier2', hid: 'cruel_tyrant' },
	{ type: 'qualifier2', hid: 'defender' },
	{ type: 'qualifier2', hid: 'destructor' },
	{ type: 'qualifier2', hid: 'dwarven' },
	{ type: 'qualifier2', hid: 'elite' },
	{ type: 'qualifier2', hid: 'elven' },
	{ type: 'qualifier2', hid: 'expert' },
	{ type: 'qualifier2', hid: 'explorer' },
	{ type: 'qualifier2', hid: 'gladiator' },
	{ type: 'qualifier2', hid: 'goddess' },
	{ type: 'qualifier2', hid: 'guard' },
	{ type: 'qualifier2', hid: 'judgement' },
	{ type: 'qualifier2', hid: 'king' },
	{ type: 'qualifier2', hid: 'mediator' },
	{ type: 'qualifier2', hid: 'mercenary' },
	{ type: 'qualifier2', hid: 'militia' },
	{ type: 'qualifier2', hid: 'nightmare' },
	{ type: 'qualifier2', hid: 'noble' },
	{ type: 'qualifier2', hid: 'noob' },
	{ type: 'qualifier2', hid: 'pilgrim' },
	{ type: 'qualifier2', hid: 'pioneer' },
	{ type: 'qualifier2', hid: 'profane' },
	{ type: 'qualifier2', hid: 'sorcerer' },
	{ type: 'qualifier2', hid: 'tormentor' },
	{ type: 'qualifier2', hid: 'training' },
	{ type: 'qualifier2', hid: 'twink' },
	{ type: 'qualifier2', hid: 'tyrant' },
	{ type: 'qualifier2', hid: 'upholder' },
	{ type: 'qualifier2', hid: 'warfield_king' },
	{ type: 'qualifier2', hid: 'warfield' },
	{ type: 'qualifier2', hid: 'warrior' },
	{ type: 'qualifier2', hid: 'wise' },
]


const ARMOR_BASES =
	ENTRIES.filter((armor_component: any) => armor_component.type === ArmorPartType.base) as
		Readonly<{type: 'base', hid: string}>[]
const ARMOR_QUALIFIERS1 =
	ENTRIES.filter((armor_component: any) => armor_component.type === ArmorPartType.qualifier1) as
		Readonly<{type: 'qualifier1', hid: string}>[]
const ARMOR_QUALIFIERS2 =
	ENTRIES.filter((armor_component: any) => armor_component.type === ArmorPartType.qualifier2) as
		Readonly<{type: 'qualifier2', hid: string}>[]


export {
	RawArmorEntry,
	I18nMessages,

	i18n_messages,
	ENTRIES,
	ARMOR_BASES,
	ARMOR_QUALIFIERS1,
	ARMOR_QUALIFIERS2,
}
