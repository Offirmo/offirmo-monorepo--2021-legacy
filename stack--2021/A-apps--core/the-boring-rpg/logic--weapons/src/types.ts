import { Enum } from 'typescript-string-enums'

import { Item, InventorySlot, ItemQuality } from '@tbrpg/definitions'

/////////////////////

const WeaponPartType = Enum(
	'base',
	'qualifier1',
	'qualifier2',
)
type WeaponPartType = Enum<typeof WeaponPartType> // eslint-disable-line no-redeclare

///////

// TODO check extends (own state?)
// TODO full fledged state with revision and schema version
interface Weapon extends Item {
	slot: typeof InventorySlot.weapon
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
