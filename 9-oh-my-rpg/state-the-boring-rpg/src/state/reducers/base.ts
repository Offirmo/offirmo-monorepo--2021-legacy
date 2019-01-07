/////////////////////

import { Random, Engine } from '@offirmo/random'
import { UUID } from '@offirmo/uuid'

/////////////////////

import { Item } from '@oh-my-rpg/definitions'

import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'

import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EngagementState from '@oh-my-rpg/state-engagement'

import { Currency } from '@oh-my-rpg/state-wallet'

/////////////////////

import { State } from '../../types'

import {
	appraise_item_value,
} from '../../selectors'

import { get_lib_SEC } from '../../sec'

import { _refresh_achievements } from './achievements'
import {
	_sell_item,
} from './internal'

/////////////////////

function on_start_session(state: Readonly<State>): Readonly<State> {
	// new achievements may have appeared
	// (new content = not the same as a migration)
	return _refresh_achievements(state)
}

function equip_item(state: Readonly<State>, uuid: UUID): Readonly<State> {
	state = {
		...state,
		inventory: InventoryState.equip_item(state.inventory, uuid),

		revision: state.revision + 1,
	}

	return _refresh_achievements(state)
}

function sell_item(state: Readonly<State>, uuid: UUID): Readonly<State> {
	state = _sell_item(state, uuid)
	return _refresh_achievements({
		...state,
		revision: state.revision + 1,
	})
}

function rename_avatar(state: Readonly<State>, new_name: string): Readonly<State> {
	state = {
		...state,
		avatar: rename(get_lib_SEC(), state.avatar, new_name),

		revision: state.revision + 1,
	}

	return _refresh_achievements(state)
}

function change_avatar_class(state: Readonly<State>, new_class: CharacterClass): Readonly<State> {
	state = {
		...state,
		avatar: switch_class(get_lib_SEC(), state.avatar, new_class),

		revision: state.revision + 1,
	}

	return _refresh_achievements(state)
}

function acknowledge_engagement_msg_seen(state: Readonly<State>, uid: number): Readonly<State> {
	return {
		...state,

		engagement: EngagementState.acknowledge_seen(state.engagement, uid),

		revision: state.revision + 1,
	}
}

/////////////////////

export {
	acknowledge_engagement_msg_seen,
	on_start_session,
	equip_item,
	sell_item,
	rename_avatar,
	change_avatar_class,
}
