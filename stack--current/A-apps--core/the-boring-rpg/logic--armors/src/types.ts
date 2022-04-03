import { Enum } from 'typescript-string-enums'

import { Item, InventorySlot, ItemQuality } from '@tbrpg/definitions'

/////////////////////

const ArmorPartType = Enum(
	'base',
	'qualifier1',
	'qualifier2',
)
type ArmorPartType = Enum<typeof ArmorPartType> // eslint-disable-line no-redeclare

///////

// TODO full fledged state with revision and schema version
interface Armor extends Item {
	slot: typeof InventorySlot.armor
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
