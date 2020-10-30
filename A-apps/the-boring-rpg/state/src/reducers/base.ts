/////////////////////

import { Immutable} from '@offirmo-private/ts-types'
import { UUID } from '@offirmo-private/uuid'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { propagate_child_revision_increment_upward } from '@offirmo-private/state-utils'

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
import * as MetaState from '@oh-my-rpg/state-meta'


/////////////////////

import { LIB } from '../consts'
import { State } from '../types'
import { get_lib_SEC } from '../services/sec'
import { get_available_classes } from '../selectors'

import { _refresh_achievements } from './achievements'
import {
	_sell_item,
	_update_to_now,
} from './internal'

/////////////////////

function on_start_session(previous_state: Immutable<State>, is_web_diversity_supporter: boolean, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	// update energy (not sure needed but good safety)
	let state = _update_to_now(previous_state, now_ms)

	state = {
		...state,
		u_state: {
			...state.u_state,
			last_user_action_tms: now_ms,
			meta: MetaState.on_start_session(state.u_state.meta, is_web_diversity_supporter),
		},
	}

	// TODO recap here ?

	state = propagate_child_revision_increment_upward(previous_state, state)

	// new achievements may have appeared
	// (new content = not the same as a migration)
	return _refresh_achievements(state)
}

function on_logged_in_refresh(previous_state: Immutable<State>, is_logged_in: boolean, roles: Immutable<string[]> = [], now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state

	// update energy (not sure needed but good safety)
	state = _update_to_now(state, now_ms)

	state = {
		...state,
		u_state: {
			...state.u_state,
			//last_user_action_tms: now_ms, // XXX this is NOT a user action
			meta: MetaState.on_logged_in_refresh(state.u_state.meta, is_logged_in, roles),
		},
	}

	// TODO engagement here ?

	state = propagate_child_revision_increment_upward(previous_state, state)

	// new achievements may have appeared
	// (new content = not the same as a migration)
	// this may indeed cause a revision
	return _refresh_achievements(state)
}

function update_to_now(state: Immutable<State>, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	return _update_to_now(state, now_ms)
}

function equip_item(previous_state: Immutable<State>, uuid: UUID, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = {
		...state,
		u_state: {
			...state.u_state,
			last_user_action_tms: now_ms,
			inventory: InventoryState.equip_item(state.u_state.inventory, uuid),
		},
	}
	state = propagate_child_revision_increment_upward(previous_state, state)
	return _refresh_achievements(state)
}

function sell_item(previous_state: Immutable<State>, uuid: UUID, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = _sell_item(state, uuid)
	state = {
		...state,
		u_state: {
			...state.u_state,
			last_user_action_tms: now_ms,
		},
	}
	state = propagate_child_revision_increment_upward(previous_state, state)
	return _refresh_achievements(state)
}

function rename_avatar(previous_state: Immutable<State>, new_name: string, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = {
		...state,

		u_state: {
			...state.u_state,
			last_user_action_tms: now_ms,
			avatar: rename(get_lib_SEC(), state.u_state.avatar, new_name),
		},
	}
	state = propagate_child_revision_increment_upward(previous_state, state)
	return _refresh_achievements(state)
}

function change_avatar_class(previous_state: Immutable<State>, new_class: CharacterClass, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	if (!get_available_classes(previous_state.u_state).includes(new_class))
		throw new Error(`${LIB}: switch class: invalid class "${new_class}"!`)

	let state = previous_state
	state = {
		...state,

		u_state: {
			...state.u_state,
			last_user_action_tms: now_ms,
			avatar: switch_class(get_lib_SEC(), state.u_state.avatar, new_class),
		},
	}
	state = propagate_child_revision_increment_upward(previous_state, state)
	return _refresh_achievements(state)
}

function acknowledge_engagement_msg_seen(previous_state: Immutable<State>, uid: number, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = {
		...state,

		u_state: {
			...state.u_state,
			last_user_action_tms: now_ms,
			engagement: EngagementState.acknowledge_seen(state.u_state.engagement, uid),
		},
	}

	state = propagate_child_revision_increment_upward(previous_state, state)

	return state
}

/////////////////////

export {
	acknowledge_engagement_msg_seen,
	on_start_session,
	on_logged_in_refresh,
	update_to_now,
	equip_item,
	sell_item,
	rename_avatar,
	change_avatar_class,
}
