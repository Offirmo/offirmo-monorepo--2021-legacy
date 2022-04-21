
/////////////////////

function create(parent_state) {
	const stack = parent_state
		? Object.create(parent_state.stack)
		: (() => {
			const stack = Object.create(null)
			stack.module = undefined
			return stack
		})()

	stack.operation = undefined // should never inherit this one

	return {
		stack,
	}
}

function set_module(state, module) {
	const { stack } = state

	if (stack.module === module)
		return state

	stack.module = module

	return {
		...state,
		stack,
	}
}

function set_operation(state, operation) {
	const { stack } = state

	if (stack.operation === operation)
		return state

	stack.operation = operation

	return {
		...state,
		stack,
	}
}

export {
	create,
	set_module,
	set_operation,
}
