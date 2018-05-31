
/////////////////////

function create(parent_state) {
	const details = parent_state
		? Object.create(parent_state.details)
		: (() => {
			const details = Object.create(null)
			//details.module = '?'
			return details
		})()

	return {
		details,
	}
}


function add_detail(state, key, value) {
	const { details } = state

	details[key] = value

	return {
		...state,
		details,
	}
}

/////////////////////

export {
	create,
	add_detail,
}
