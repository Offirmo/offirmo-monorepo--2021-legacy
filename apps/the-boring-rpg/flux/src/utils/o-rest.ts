import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo/timestamps'

////////////////////////////////////
// https://www.jsonrpc.org/specification

interface JSONRPCRequest<T> {
	jsonrpc: '2.0'
	id: number | string
	method: string
	params: T
}

interface JSONRPCResponse<T> {
	jsonrpc: '2.0'
	id: number | string
	error?: {
		code: number
		message: string
		data?: any
	}
	result?: T
}

////////////////////////////////////
// https://geemus.gitbooks.io/http-api-design/content/en/responses/

interface ORequest<T> {
	'o⋄v': 1
	id: number | string
	params: T
}

interface OResponse<T> {
	'o⋄v': 1
	id: number | string

	// made to be compatible with JSONRPC
	error?: {
		code: number // may ~ HTTP status
		message: string
		data?: any

		id?: string // category of error
		cta?: string
		cta_href?: string
	}

	result: T

	_meta: {
		request: {
			id: number
		}
		received_at: TimestampUTCMs
		processing_time_ms: number
	}
}

////////////////////////////////////

export {
	JSONRPCRequest,
	JSONRPCResponse,
	ORequest,
	OResponse,
}
