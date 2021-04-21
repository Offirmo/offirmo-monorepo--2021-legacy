/////////////////////

import { Random, Engine } from '@offirmo/random'
import { Item, InventorySlot } from '@tbrpg/definitions'
import {
	Weapon,
	create as create_weapon,
	get_medium_damage,
} from '@oh-my-rpg/logic-weapons'
import {
	Armor,
	create as create_armor,
	get_medium_damage_reduction,
} from '@oh-my-rpg/logic-armors'

/////////////////////

function create(rng: Engine): void {
	// TODO one day
}

/////////////////////

// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_shop(): void {
	const rng: Engine = Random.engines.mt19937().autoSeed()
	return create(rng)
}

/////////////////////

export {
	generate_random_demo_shop,
	create,
}

/////////////////////
