import { Enum } from 'typescript-string-enums'

import { UUID } from '@offirmo/uuid'

/////////////////////

const ElementType = Enum(
	'item',
	// TODO expand
	'location',
	'lore',
)
type ElementType = Enum<typeof ElementType> // eslint-disable-line no-redeclare

///////

interface Element {
	readonly uuid: UUID
	element_type: ElementType
	// TODO add schema version ?
}

/////////////////////

const ItemQuality = Enum(
	'common',
	'uncommon',
	'rare',
	'epic',
	'legendary',
	'artifact',
)
type ItemQuality = Enum<typeof ItemQuality> // eslint-disable-line no-redeclare

const InventorySlot = Enum(
	'weapon',
	'armor',
)
type InventorySlot = Enum<typeof InventorySlot> // eslint-disable-line no-redeclare

///////

interface Item extends Element {
	slot: InventorySlot
	quality: ItemQuality
	// TODO generation date ?
	// TODO made by ?
}

/////////////////////

export {
	ElementType,
	Element,
	ItemQuality,
	InventorySlot,
	Item,
}

/////////////////////
