/////////////////////

import { Immutable} from '@offirmo-private/ts-types'
import { UUID } from '@offirmo-private/uuid'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { complete_or_cancel_eager_mutation_propagating_possible_child_mutation } from '@offirmo-private/state-utils'

/////////////////////

import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@tbrpg/state--character'

import * as InventoryState from '@tbrpg/state--inventory'
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
		//last_user_investment_tms: now_ms, //No, this is NOT a valuable user action
		u_state: {
			...state.u_state,

			meta: MetaState.on_start_session(state.u_state.meta, is_web_diversity_supporter),

			revision: previous_state.u_state.revision + 1,
		},
	}

	// TODO recap here ?

	// new achievements may have appeared
	// (new content = not the same as a migration)
	return _refresh_achievements(state)
}

function on_logged_in_refresh(previous_state: Immutable<State>, is_logged_in: boolean, roles: Immutable<string[]> = [], now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	// update energy (not sure needed but good safety)
	let updated_state = _update_to_now(previous_state, now_ms)
	let state = updated_state

	state = {
		...state,
		//last_user_investment_tms: now_ms, //No, this is NOT a valuable user action
		u_state: {
			...state.u_state,
			meta: MetaState.on_logged_in_refresh(state.u_state.meta, is_logged_in, roles),
		},
	}

	// TODO engagement here ?

	state = _refresh_achievements(state)
	state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous_state, state, updated_state, 'on_logged_in_refresh')

	return state
}

function update_to_now(state: Immutable<State>, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	return _update_to_now(state, now_ms)
}

function equip_item(previous_state: Immutable<State>, uuid: UUID, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			inventory: InventoryState.equip_item(state.u_state.inventory, uuid),
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function sell_item(previous_state: Immutable<State>, uuid: UUID, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = _sell_item(state, uuid)
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function rename_avatar(previous_state: Immutable<State>, new_name: string, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			avatar: rename(get_lib_SEC(), state.u_state.avatar, new_name),
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function change_avatar_class(previous_state: Immutable<State>, new_class: CharacterClass, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	if (!get_available_classes(previous_state.u_state).includes(new_class))
		throw new Error(`${LIB}: switch class: invalid class "${new_class}"!`)

	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			avatar: switch_class(get_lib_SEC(), state.u_state.avatar, new_class),
			revision: previous_state.u_state.revision + 1,
		},
	}

	return _refresh_achievements(state)
}

function acknowledge_engagement_msg_seen(previous_state: Immutable<State>, uid: number, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	let state = previous_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...state.u_state,
			engagement: EngagementState.acknowledge_seen(state.u_state.engagement, uid),
			revision: previous_state.u_state.revision + 1,
		},
	}

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
