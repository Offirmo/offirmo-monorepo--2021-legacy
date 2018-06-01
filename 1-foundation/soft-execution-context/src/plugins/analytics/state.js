
function create(parent_state) {
	const details = parent_state
		? Object.create(parent_state.details)
		: (() => {
			const details = Object.create(null)
			// TODO add auto-details? Here?
			return details
		})()

	return {
		details,
	}
}

function addDetail(state, key, value) {
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
	addDetail,
}
