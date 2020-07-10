
function create(parent_state) {
	const details = parent_state
		? Object.create(parent_state.details)
		: Object.create(null) // NO auto-details here, let's keep it simple. See core or platform specific code.

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
