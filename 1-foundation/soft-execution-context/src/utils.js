import { INTERNAL_PROP } from './constants'


function flattenToOwn(object) {
	//console.log('flattenToOwn', object)
	if (!object) return object
	if (Array.isArray(object)) return object
	if (typeof object !== 'object') return object

	const res = Object.create(null)

	for (const property in object) {
		//console.log('flattenToOwn prop', property, object[property])

		res[property] = object[property]
	}

	return res
}


// for debug
function _flattenSEC(SEC) {
	const plugins = {
		...SEC[INTERNAL_PROP].plugins,
	}

	plugins.dependency_injection.context = flattenToOwn(
		plugins.dependency_injection.context
	)

	plugins.error_handling.details = flattenToOwn(
		plugins.error_handling.details
	)

	plugins.logical_stack.stack = flattenToOwn(
		plugins.logical_stack.stack
	)

	return plugins
}

// needed for various tree traversal algorithms
function _getSECStatePath(SEC) {
	if (!SEC[INTERNAL_PROP].cache.statePath) {
		const path = []
		let state = SEC[INTERNAL_PROP]

		while (state) {
			path.unshift(state)
			state = state.parent
		}

		SEC[INTERNAL_PROP].cache.statePath = path
	}

	return SEC[INTERNAL_PROP].cache.statePath
}

export {
	flattenToOwn,
	_flattenSEC,
	_getSECStatePath,
}
