import {
	UUID,
	Item,
} from '@oh-my-rpg/definitions'

/////////////////////

// can be upgraded later for having bags, etc.
type InventoryCoordinates = number

///////

interface State {
	schema_version: number
	revision: number

	slotted: {
		[slot: string]: Item | null
	}
	unslotted_capacity: number
	unslotted: Array<Item>
}

/////////////////////

export {
	UUID,
	Item,
	InventoryCoordinates,
	State,
}

/////////////////////
