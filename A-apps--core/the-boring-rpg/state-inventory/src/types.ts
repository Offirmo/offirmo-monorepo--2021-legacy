import { BaseUState } from '@offirmo-private/state-utils'

import { Item, InventorySlot } from '@oh-my-rpg/definitions'
import { Armor } from '@oh-my-rpg/logic-armors'
import { Weapon } from '@oh-my-rpg/logic-weapons'

/////////////////////

interface State extends BaseUState {
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
