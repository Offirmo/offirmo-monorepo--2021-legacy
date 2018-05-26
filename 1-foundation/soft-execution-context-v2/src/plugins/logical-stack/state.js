
function create(parent_state) {
	const stack = parent_state
		? Object.create(parent_state.stack)
		: (() => {
			const stack = Object.create(null)
			stack.module = '?'
			return stack
		})()

	stack.operation= '?' // shouldn't inherit this one

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


function init_from_creation_args(state, {module, operation}) {
	if (module)
		state = set_module(state, module)
	if (operation)
		state = set_operation(state, operation)

	return state
}

export {
	create,
	set_module,
	set_operation,
	init_from_creation_args,
}
