import { Enum } from 'typescript-string-enums'
import { UUID } from '@offirmo/uuid'

/////////////////////

// An element is everything which can be interacted with and/or has a rich tooltip
// ex. item, place, achievement, title...

const ElementType = Enum(
	'item',
	'achievement_snapshot',
	// TODO expand
	'location',
	'lore',
)
type ElementType = Enum<typeof ElementType> // eslint-disable-line no-redeclare

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
	'none' // TODO
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

// TODO use this
// TODO use it in element?
interface BaseState {
	schema_version: number
	revision: number
}

/////////////////////

export {
	ElementType,
	Element,

	ItemQuality,
	InventorySlot,
	Item,

	BaseState,
}

/////////////////////
