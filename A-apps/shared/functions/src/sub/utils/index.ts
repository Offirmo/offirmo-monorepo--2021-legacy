import { STATUS_CODES } from 'http'
import { XError as _XError, COMMON_ERROR_FIELDS } from '@offirmo-private/common-error-fields'

export interface XError extends _XError {
	res?: any
}

// TODO extern
export function create_error(message: string | number | undefined, details: XError['details'] = {}): XError {
	console.log(`FYI create_error() "${message}"`, details)
	if (message && STATUS_CODES[message]) {
		details.statusCode = Number(message)
		message = STATUS_CODES[details.statusCode]
	}

	message = String(message || 'Unknown error!')
	if (!(message.toLowerCase()).includes('error')) {
		message = 'Error: ' + message
	}

	const error: XError = new Error(message)
	Object.keys(details).forEach(k => {
		//console.log(k)
		if (COMMON_ERROR_FIELDS.has(k) && k !== 'name' && k !== 'message' && k !== 'stack') {
			(error as any)[k] = details[k]
		}
		else {
			error.details = error.details || {}
			error.details[k] = details[k]
		}
	})
	error.framesToPop = error.framesToPop || 1

	return error
}
