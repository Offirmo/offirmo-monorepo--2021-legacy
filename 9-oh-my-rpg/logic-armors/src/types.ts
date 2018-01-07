import { Enum } from 'typescript-string-enums'

import { Item, InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'

/////////////////////

const ArmorPartType = Enum(
	'base',
	'qualifier1',
	'qualifier2',
)
type ArmorPartType = Enum<typeof ArmorPartType>

///////

// TODO check extends
interface Armor extends Item {
	slot: InventorySlot
	base_hid: string
	qualifier1_hid: string
	qualifier2_hid: string
	quality: ItemQuality
	base_strength: number
	enhancement_level: number
}


/////////////////////

export {
	ArmorPartType,
	Armor,
}

/////////////////////
