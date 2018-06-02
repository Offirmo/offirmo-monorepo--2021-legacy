import { Enum } from 'typescript-string-enums'

/////////////////////

// TODO move somewhere else
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
type ItemQuality = Enum<typeof ItemQuality>

const InventorySlot = Enum(
	'weapon',
	'armor',
)
type InventorySlot = Enum<typeof InventorySlot>

///////

interface Item extends Element {
	slot: InventorySlot
	quality: ItemQuality
	// TODO generation date ?
	// TODO made by ?
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
