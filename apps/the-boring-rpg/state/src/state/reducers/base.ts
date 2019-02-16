/////////////////////

import { Random, Engine } from '@offirmo/random'
import { UUID } from '@offirmo/uuid'

/////////////////////

import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'

import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EngagementState from '@oh-my-rpg/state-engagement'


/////////////////////

import { LIB } from '../../consts'
import { State } from '../../types'
import { get_lib_SEC } from '../../sec'
import { get_available_classes } from '../../selectors'

import { _refresh_achievements } from './achievements'
import {
	_sell_item,
	_update_to_now,
} from './internal'

/////////////////////

function on_start_session(state: Readonly<State>): Readonly<State> {
	// update energy (not 100% needed but good safety)
	state = _update_to_now(state)

	// TODO recap here ?

	// new achievements may have appeared
	// (new content = not the same as a migration)
	return _refresh_achievements(state)
}

function update_to_now(state: Readonly<State>): Readonly<State> {
	return _update_to_now(state)
}

function equip_item(state: Readonly<State>, uuid: UUID): Readonly<State> {
	state = {
		...state,
		u_state: {
			...state.u_state,
			inventory: InventoryState.equip_item(state.u_state.inventory, uuid),

			revision: state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function sell_item(state: Readonly<State>, uuid: UUID): Readonly<State> {
	state = _sell_item(state, uuid)
	return _refresh_achievements({
		...state,
		u_state: {
			...state.u_state,
			revision: state.u_state.revision + 1,
		},
	})
}

function rename_avatar(state: Readonly<State>, new_name: string): Readonly<State> {
	state = {
		...state,

		u_state: {
			...state.u_state,
			avatar: rename(get_lib_SEC(), state.u_state.avatar, new_name),
			revision: state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function change_avatar_class(state: Readonly<State>, new_class: CharacterClass): Readonly<State> {
	if (!get_available_classes(state.u_state).includes(new_class))
		throw new Error(`${LIB}: switch class: invalid class "${new_class}"!`)

	state = {
		...state,

		u_state: {
			...state.u_state,
			avatar: switch_class(get_lib_SEC(), state.u_state.avatar, new_class),
			revision: state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function acknowledge_engagement_msg_seen(state: Readonly<State>, uid: number): Readonly<State> {
	return {
		...state,

		u_state: {
			...state.u_state,
			engagement: EngagementState.acknowledge_seen(state.u_state.engagement, uid),
			revision: state.u_state.revision + 1,
		},
	}
}

/////////////////////

export {
	acknowledge_engagement_msg_seen,
	on_start_session,
	update_to_now,
	equip_item,
	sell_item,
	rename_avatar,
	change_avatar_class,
}
