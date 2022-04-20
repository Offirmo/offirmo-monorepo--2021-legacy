
function create(parent_state) {
	const context = parent_state
		? Object.create(parent_state.context)
		: Object.create(null) // NO auto-injections here, let's keep it simple. See core.

	return {
		context,
	}
}

function injectDependencies(state, key, value) {
	const { context } = state

	context[key] = value

	return {
		...state,
		context,
	}
}

/////////////////////

export {
	create,
	injectDependencies,
}
