import { Enum } from 'typescript-string-enums'

import { Item, InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'

/////////////////////

const WeaponPartType = Enum(
	'base',
	'qualifier1',
	'qualifier2',
)
type WeaponPartType = Enum<typeof WeaponPartType>

///////

// TODO check extends
interface Weapon extends Item {
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
	WeaponPartType,
	Weapon,
}

/////////////////////
