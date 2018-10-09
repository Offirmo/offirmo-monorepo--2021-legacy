import { is_full } from '@oh-my-rpg/state-inventory'

/////////////////////

import {
	State,
} from './types'


/////////////////////

function is_inventory_full(state: Readonly<State>): boolean {
	return is_full(state.inventory)
}

/////////////////////

export {
	is_inventory_full,
}

/////////////////////
