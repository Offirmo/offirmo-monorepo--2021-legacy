import { STATUS_CODES } from 'http'
import { XError as _XError } from '@offirmo-private/common-error-fields'
import { XSoftExecutionContext } from '../services/sec'

export interface XError extends _XError {
	res?: any
}

// TODO extern
export function create_error(SEC: XSoftExecutionContext, message: string | number | undefined, details: XError['details'] = {}): XError {
	console.log(`FYI create_error("${message}"`, details,') from', SEC.getLogicalStack())

	if (message && STATUS_CODES[message]) {
		details.statusCode = Number(message)
		message = STATUS_CODES[details.statusCode]
	}

	//console.log('CE', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())
	const err = SEC.createError(String(message), details)
	err.framesToPop!++

	return err
}
