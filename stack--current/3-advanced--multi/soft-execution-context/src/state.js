// Note: let's keep everything immutable

/////////////////////

let instance_count = 0
function create(parent_state) {
	return {
		sid: instance_count++, // not really useful yet, but helps debug
		parent: parent_state || null,
		plugins: {},
		cache: {}, // per-SEC cache for complex computations
	}
}

function activate_plugin(state, PLUGIN/*, args*/) {
	const plugin_parent_state = state.parent
		? state.parent.plugins[PLUGIN.id]
		: null

	const plugin_state = PLUGIN.state.create(plugin_parent_state)

	return {
		...state,
		plugins: {
			...state.plugins,
			[PLUGIN.id]: {
				...plugin_state,
				sid: state.sid, // propagate sid. Not really useful yet, but helps debug
			},
		},
	}
}

function reduce_plugin(state, PLUGIN_ID, reducer) {
	const initial_plugin_state = state.plugins[PLUGIN_ID]
	const new_plugin_state = reducer(initial_plugin_state)

	if (new_plugin_state === initial_plugin_state)
		return state // no change (immutability expected)

	return {
		...state,
		plugins: {
			...state.plugins,
			[PLUGIN_ID]: new_plugin_state,
		},
	}
}

/////////////////////

export {
	create,
	activate_plugin,
	reduce_plugin,
}
