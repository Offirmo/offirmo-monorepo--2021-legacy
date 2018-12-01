import { Item, InventorySlot } from '@oh-my-rpg/definitions'

import { Armor } from '@oh-my-rpg/logic-armors'
import { Weapon } from '@oh-my-rpg/logic-weapons'

/////////////////////

interface State {
	schema_version: number
	revision: number

	slotted: {
		[InventorySlot.armor]?: Armor
		[InventorySlot.weapon]?: Weapon
	}
	unslotted_capacity: number
	unslotted: Array<Item>
}

/////////////////////

export {
	Item,
	State,
}

/////////////////////
