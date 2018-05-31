
function create(parent_state) {
	const context = parent_state
		? Object.create(parent_state.context)
		: (() => {
			const context = Object.create(null)
			context.logger = console
			context.ENV = typeof NODE_ENV === 'string'
				? NODE_ENV
				: 'development'
			context.DEBUG = false // TOREVIEW
			return context
		})()

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
