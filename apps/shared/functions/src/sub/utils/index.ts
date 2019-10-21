import { STATUS_CODES } from 'http'
import { XError as _XError, COMMON_ERROR_FIELDS } from '@offirmo-private/common-error-fields'

interface XError extends _XError {
	res?: any
}

// TODO extern
function create_error(message: string | number | undefined, data: XError['details'] = {}): XError {
	if (message && STATUS_CODES[message]) {
		message = STATUS_CODES[message]
		data.statusCode = Number(message)
	}

	message = String(message || 'Unknown error!')
	if (!(message.toLowerCase()).includes('error')) {
		message = 'Error: ' + message
	}

	const error: XError = new Error(message)
	Object.keys(data).forEach(k => {
		if (COMMON_ERROR_FIELDS.has(k) && k !== 'name' && k !== 'message' && k !== 'stack') {
			(error as any)[k] = data[k]
		}
		else {
			error.details = error.details || {}
			error.details[k] = data[k]
		}
	})
	error.framesToPop = error.framesToPop || 1

	return error
}
/*
function throw_new_error(message: string, data: { [k: string]: boolean | number | string | null } = {}): void {
	throw create_error(message, data)
}
*/

export {
	create_error,
	XError,
}
