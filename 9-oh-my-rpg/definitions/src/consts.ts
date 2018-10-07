/////////////////////

import { Enum } from 'typescript-string-enums'

import { ItemQuality, InventorySlot } from './types'

///////

const PRODUCT = '@oh-my-rpg'

///////

const ITEM_QUALITIES = Enum.keys(ItemQuality)

// useful for ex. for sorting
const ITEM_QUALITIES_TO_INT: { [k: string]: number } = {
	[ItemQuality.common]: 6,
	[ItemQuality.uncommon]: 5,
	[ItemQuality.rare]: 4,
	[ItemQuality.epic]: 3,
	[ItemQuality.legendary]: 2,
	[ItemQuality.artifact]: 1,
}

///////

const ITEM_SLOTS = Enum.keys(InventorySlot)

// useful for ex. for sorting
const ITEM_SLOTS_TO_INT: { [k: string]: number } = {
	[InventorySlot.armor]: 2,
	[InventorySlot.weapon]: 1,
}

///////

const MIN_LEVEL = 1
const MAX_LEVEL = 9999

/////////////////////

export {
	PRODUCT,
	ITEM_QUALITIES,
	ITEM_QUALITIES_TO_INT,
	ITEM_SLOTS,
	ITEM_SLOTS_TO_INT,
	MIN_LEVEL,
	MAX_LEVEL,
}

/////////////////////
