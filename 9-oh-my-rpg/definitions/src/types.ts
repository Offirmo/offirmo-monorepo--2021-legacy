import { Enum } from 'typescript-string-enums'

/////////////////////

interface I18nMessages {
	[k: string]: string | I18nMessages
}

type UUID = string

/////////////////////

const ElementType = Enum(
	'item',
	// TODO expand
	'location',
	'lore',
)
type ElementType = Enum<typeof ElementType>

///////

interface Element {
	uuid: UUID
	element_type: ElementType
	// todo add schema version ?
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
type ItemQuality = Enum<typeof ItemQuality>

const InventorySlot = Enum(
	'none',
	'weapon',
	'armor',
)
type InventorySlot = Enum<typeof InventorySlot>

///////

interface Item extends Element {
	slot: InventorySlot
	quality: ItemQuality
	// todo generation date ?
	// made by ?
}

/////////////////////

export {
	I18nMessages,
	UUID,
	ElementType,
	Element,
	ItemQuality,
	InventorySlot,
	Item,
}

/////////////////////
