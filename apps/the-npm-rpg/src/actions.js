"use strict";

const tbrpg = require('@oh-my-rpg/state-the-boring-rpg')
const {
	get_item_at_coordinates
} = require('@oh-my-rpg/state-inventory')

function play({config}) {
	let state = config.store
	state = tbrpg.play(state)
	config.set(state)
}

function equip_item({config}, uuid) {
	let state = config.store
	state = tbrpg.equip_item(state, uuid)
	config.set(state)
}

function sell_item({config}, uuid) {
	let state = config.store
	state = tbrpg.sell_item(state, uuid)
	config.set(state)
}

function appraise_item({config}, uuid) {
	let state = config.store
	return tbrpg.appraise_item(state, uuid)
}

function does_item_exist_in_unslotted({config}, uuid) {
	let state = config.store
	return !!get_item_at_coordinates(state.inventory, uuid)
}

function rename_avatar({config}, new_name) {
	let state = config.store
	state = tbrpg.rename_avatar(state, new_name)
	config.set(state)
}

function change_class({config}, new_class) {
	let state = config.store
	state = tbrpg.change_avatar_class(state, new_class)
	config.set(state)
}

function reset_all({config}) {
	const state = tbrpg.reseed(tbrpg.create())
	config.clear()
	config.set(state)
}

module.exports = {
	play,
	equip_item_at_coordinates,
	sell_item_at_coordinates,
	does_item_exist_at_coordinate,
	appraise_item_at_coordinates,
	rename_avatar,
	change_class,
	reset_all,
}
