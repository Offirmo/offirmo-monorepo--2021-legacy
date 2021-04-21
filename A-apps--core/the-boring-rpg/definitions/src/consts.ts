/////////////////////

import { Enum } from 'typescript-string-enums'

import { ItemQuality, InventorySlot } from './types'

///////

export const PRODUCT = '@tbrpg'
export const LIB = '@tbrpg/definitions'

///////

export const ITEM_QUALITIES = Enum.keys(ItemQuality)

// useful for ex. for sorting
export const ITEM_QUALITIES_TO_INT: Readonly<{ [k: string]: number }> = {
	[ItemQuality.common]:     6,
	[ItemQuality.uncommon]:   5,
	[ItemQuality.rare]:       4,
	[ItemQuality.epic]:       3,
	[ItemQuality.legendary]:  2,
	[ItemQuality.artifact]:   1,
}

///////

export const ITEM_SLOTS: InventorySlot[] = Enum.keys(InventorySlot).filter(s => s !== InventorySlot.none)

// useful for ex. for sorting
export const ITEM_SLOTS_TO_INT: Readonly<{ [k: string]: number }> = {
	[InventorySlot.weapon]: 1,
	[InventorySlot.armor]: 2,
}

///////

export const MIN_LEVEL = 1
export const MAX_LEVEL = 9999

/////////////////////

