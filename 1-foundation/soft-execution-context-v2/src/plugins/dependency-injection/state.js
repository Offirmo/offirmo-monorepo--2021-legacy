
function create(parent_state) {
	const context = parent_state
		? Object.create(parent_state.context)
		: (() => {
			const context = Object.create(null)
			context.logger = console
			return context
		})()

	return {
		context,
	}
}

function inject_dependency(state, key, value) {
	const { context } = state

	context[key] = value

	return {
		...state,
		context,
	}
}


function init_from_creation_args(state) {
	return state
}

export {
	create,
	inject_dependency,
	init_from_creation_args,
}
