/////////////////////

import {
	Item,
	InventorySlot,
	compare_items_by_slot,
} from '@tbrpg/definitions'

import {
	Armor,
	compare_armors_by_potential,
} from '@oh-my-rpg/logic-armors'

import {
	Weapon,
	compare_weapons_by_potential,
} from '@oh-my-rpg/logic-weapons'

import {
	LIB,
} from './consts'

/////////////////////

function compare_items_by_slot_then_strength(a: Readonly<Item>, b: Readonly<Item>): number {
	if (a.slot !== b.slot)
		return compare_items_by_slot(a, b)

	switch (a.slot) {
		case InventorySlot.armor: {
			const sort = compare_armors_by_potential(a as Armor, b as Armor)
			if (!Number.isInteger(sort))
				throw new Error(`${LIB}: compare():  error sorting armors!`)
			return sort
		}
		case InventorySlot.weapon: {
			const sort = compare_weapons_by_potential(a as Weapon, b as Weapon)
			if (!Number.isInteger(sort))
				throw new Error(`${LIB}: compare():  error sorting weapons!`)
			return sort
		}
		default:
			throw new Error(`${LIB}: compare(): unhandled item slot "${a.slot}"!`)
	}
}

/////////////////////

export {
	compare_items_by_slot_then_strength,
}

/////////////////////
