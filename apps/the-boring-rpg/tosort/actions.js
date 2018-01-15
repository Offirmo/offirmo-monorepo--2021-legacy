"use strict";

import * as tbrpg from '@oh-my-rpg/state-the-boring-rpg'
import { get_item } from '@oh-my-rpg/state-inventory'
import { LS_KEYS } from './consts'

function persist(state) {
	localStorage.setItem(LS_KEYS.savegame, JSON.stringify(state))
}

// TODO add error handling mechanism for play bugs, with player feedback

function play(workspace) {
	let { state } = workspace
	state = tbrpg.play(state)
	workspace.state = state
	persist(state)
}

function equip_item(workspace, uuid) {
	let { state } = workspace
	state = tbrpg.equip_item(state, uuid)
	workspace.state = state
	persist(state)
}

function sell_item(workspace, uuid) {
	let { state } = workspace
	state = tbrpg.sell_item(state, uuid)
	workspace.state = state
	persist(state)
}

function appraise_item(workspace, uuid) {
	let { state } = workspace
	return tbrpg.appraise_item(state, uuid)
}

function does_item_exist(workspace, uuid) {
	let { state } = workspace
	return !!get_item(state.inventory, uuid)
}

function rename_avatar(workspace, new_name) {
	let { state } = workspace
	state = tbrpg.rename_avatar(state, new_name)
	workspace.state = state
	persist(state)
}

function change_class(workspace, new_class) {
	let { state } = workspace
	state = tbrpg.change_avatar_class(state, new_class)
	workspace.state = state
	persist(state)
}

function reset_all(workspace) {
	const state = tbrpg.reseed(tbrpg.create())
	workspace.state = state
	persist(state)
}

export {
	play,
	equip_item_at_coordinates,
	sell_item_at_coordinates,
	does_item_exist_at_coordinate,
	appraise_item_at_coordinates,
	rename_avatar,
	change_class,
	reset_all,
}
