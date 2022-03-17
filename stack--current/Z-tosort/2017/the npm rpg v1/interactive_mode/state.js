

function create({options}) {
	return {
		options,
		version: options.version,

		ignore_key_events: false, // sometime we have to temporarily pause listening to keys
		current_screen_id: 'adventure',
		selected_item_coordinates: null,
		last_displayed_episode: -1,
	}
}

function switch_screen(state, screen_id) {
	state.current_screen_id = screen_id

	if (screen_id !== 'inventory_select')
		state.selected_item_coordinates = null

	return state
}

function select_item(state, item_coordinates) {
	state.selected_item_coordinates = item_coordinates
	return state
}

module.exports = {
	create,
	switch_screen,
	select_item,
}
