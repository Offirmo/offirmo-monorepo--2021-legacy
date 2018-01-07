/////////////////////

import { Enum } from 'typescript-string-enums'

import { ItemQuality, InventorySlot } from './types'

///////

const ITEM_QUALITIES = Enum.keys(ItemQuality)

///////

const ITEM_SLOTS: InventorySlot[] = [
	InventorySlot.weapon,
	InventorySlot.armor,
]

///////

const MIN_LEVEL = 1
const MAX_LEVEL = 9999

/////////////////////

export {
	ITEM_QUALITIES,
	ITEM_SLOTS,
	MIN_LEVEL,
	MAX_LEVEL,
}

/////////////////////
