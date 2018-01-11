/////////////////////

import {
	Item,
	InventorySlot,
	compare_items_by_slot,
} from '@oh-my-rpg/definitions'

import {
	Armor,
	compare_armors_by_strength,
} from '@oh-my-rpg/logic-armors'

import {
	Weapon,
	compare_weapons_by_strength,
} from '@oh-my-rpg/logic-weapons'

import {
	LIB_ID,
} from './consts'

/////////////////////

function compare_items(a: Item, b: Item): number {
	if (a.slot !== b.slot)
		return compare_items_by_slot(a, b)

	switch(a.slot) {
		case InventorySlot.armor:
			return compare_armors_by_strength(a as Armor, b as Armor)
		case InventorySlot.weapon:
			return compare_weapons_by_strength(a as Weapon, b as Weapon)
		default:
			throw new Error(`${LIB_ID}: compare(): unhandled item slot "${a.slot}"!`)
	}
}

/////////////////////

export {
	compare_items,
}

/////////////////////
