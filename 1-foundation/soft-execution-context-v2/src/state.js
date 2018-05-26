// IMMUTABLE!

/////////////////////

function create(parent_state) {
	return {
		parent: parent_state || null,
		plugins: {},
	}
}


function activate_plugin(state, PLUGIN, args) {
	const plugin_parent_state = state.parent
		? state.parent.plugins[PLUGIN.id]
		: null

	let plugin_state = PLUGIN.state.create(plugin_parent_state)
	//plugin_state = PLUGIN.state.init_from_creation_args(plugin_state, args)

	return {
		...state,
		plugins: {
			...state.plugins,
			[PLUGIN.id]: plugin_state,
		}
	}
}


function reduce_plugin(state, PLUGIN_ID, reducer) {
	const initial_plugin_state = state.plugins[PLUGIN_ID]
	const new_plugin_state = reducer(initial_plugin_state)

	if (new_plugin_state === initial_plugin_state)
		return state

	return {
		...state,
		plugins: {
			...state.plugins,
			[PLUGIN_ID]: new_plugin_state,
		}
	}
}

/////////////////////

export {
	create,
	activate_plugin,
	reduce_plugin,
}
