import { STATUS_CODES } from 'http'
import { createError, XXError} from '@offirmo/error-utils'
import { XSoftExecutionContext } from '../services/sec'

import { APIGatewayEvent } from '../types'
import { HTTP_STATUS_CODE } from '../consts'

export interface LXXError extends XXError {
	res?: any
}

// TODO extern
export function create_error(message: string | number | undefined, details: LXXError['details'] = {}, SEC?: XSoftExecutionContext): LXXError {
	console.log(`FYI create_error("${message}"`, details,') from', SEC?.getLogicalStack())

	if (message && STATUS_CODES[message]) {
		details.statusCode = Number(message)
		message = STATUS_CODES[details.statusCode]
	}

	//console.log('CE', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())
	const err = SEC
		? SEC.createError(String(message), details)
		: createError(String(message), details)
	err.framesToPop!++

	return err
}



const NETLIFY_ROOT = '/.netlify/functions'

// return [function id]/the/rest
export function get_relevant_path_segments(event: Readonly<APIGatewayEvent>): string[] {
	const original_path = event.path
	let normalized_path = original_path

	const has_trailing_slash = normalized_path.endsWith('/')
	if (has_trailing_slash)
		normalized_path = normalized_path.slice(0, -1)

	const has_useless_root = normalized_path.startsWith(NETLIFY_ROOT)
	if (has_useless_root)
		normalized_path = normalized_path.slice(NETLIFY_ROOT.length)

	const has_useless_prefix_slash = normalized_path.startsWith('/')
	if (has_useless_prefix_slash)
		normalized_path = normalized_path.slice(1)

	const segments = normalized_path.split('/')
	console.log('get_relevant_path_segments()', { original_path, normalized_path, segments})

	return segments
}

export function loosely_get_clean_path(event: Readonly<APIGatewayEvent>): string {
	try {
		return get_relevant_path_segments(event).join('/')
	}
	catch {
		return event?.path
	}
}

export function get_key_from_path(event: Readonly<APIGatewayEvent>, {
	expected_fn,
	expected_segment_count = 2, // default = fn + key
}: {
	expected_fn?: string,
	expected_segment_count?: number | null,
} = {}): string {
	const segments = get_relevant_path_segments(event)

	const actual_fn = segments.shift()
	if (expected_fn && actual_fn !== expected_fn) {
		throw create_error(`Unexpected fn "${actual_fn}" vs. "${expected_fn}"!`, { statusCode: 500 })
	}

	const key = segments.pop()
	if (expected_segment_count !== null && segments.length !== expected_segment_count - 2) {
		throw create_error(`Too many path segments!`, { statusCode: HTTP_STATUS_CODE.error.client.bad_request })
	}
	if (!key) {
		throw create_error(`Missing key!`, { statusCode: HTTP_STATUS_CODE.error.client.bad_request })
	}

	return key
}

export function get_id_from_path(event: Readonly<APIGatewayEvent>, params: Parameters<typeof get_key_from_path>[1] = {}): number {
	const key = get_key_from_path(event, params)
	const num = Number(key)

	if (String(num) !== key) {
		throw create_error(`Id is not an integer!`, { statusCode: HTTP_STATUS_CODE.error.client.bad_request })
	}
	if (!Number.isSafeInteger(num)) {
		throw create_error(`Id is not a safe integer!`, { statusCode: HTTP_STATUS_CODE.error.client.bad_request })
	}

	return num
}
