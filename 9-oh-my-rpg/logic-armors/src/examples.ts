import {
	ItemQuality,
	InventorySlot,
	ElementType,
} from '@oh-my-rpg/definitions'

import {Armor} from './types'
import {MAX_ENHANCEMENT_LEVEL, MAX_STRENGTH, MIN_ENHANCEMENT_LEVEL, MIN_STRENGTH} from './index'
import { ARMOR_BASES, ARMOR_QUALIFIERS1, ARMOR_QUALIFIERS2 } from './data'

const DEMO_ARMOR_1: Readonly<Armor> = {
	uuid: 'uu1~test~demo~armor~0001',
	element_type: ElementType.item,
	slot: InventorySlot.armor,
	base_hid: ARMOR_BASES[0].hid,
	qualifier1_hid: ARMOR_QUALIFIERS1[0].hid,
	qualifier2_hid: ARMOR_QUALIFIERS2[0].hid,
	quality: ItemQuality.uncommon,
	base_strength: MIN_STRENGTH + 1,
	enhancement_level: MIN_ENHANCEMENT_LEVEL,
}

const DEMO_ARMOR_2: Readonly<Armor> = {
	uuid: 'uu1~test~demo~armor~0002',
	element_type: ElementType.item,
	slot: InventorySlot.armor,
	base_hid: ARMOR_BASES[1].hid,
	qualifier1_hid: ARMOR_QUALIFIERS1[1].hid,
	qualifier2_hid: ARMOR_QUALIFIERS2[1].hid,
	quality: ItemQuality.legendary,
	base_strength: MAX_STRENGTH - 1,
	enhancement_level: MAX_ENHANCEMENT_LEVEL,
}

export {
	DEMO_ARMOR_1,
	DEMO_ARMOR_2,
}
