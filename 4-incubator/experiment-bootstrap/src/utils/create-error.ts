
interface ExtendedError extends Error {
	name: string
	message: string

	stack?: string

	details?: { [k: string]: boolean | number | string | null }
}


function create_error(message: string, details: ExtendedError['details'] = {}): ExtendedError {
	const error: ExtendedError = new Error(message)
	Object.keys(details).forEach(k => {
		error.details = error.details || {}
		error.details[k] = details[k]
	})

	return error
}

export {
	ExtendedError,
	create_error,
}
