import { overrideHook } from '@offirmo/universal-debug-api-placeholder'
import { XXError } from '@offirmo/error-utils'

import { ReleaseChannel, OAServerResponseBody } from './types'
import { LIB, SERVER_RESPONSE_VERSION } from './consts'

/////////////////////////////////////////////////

export function get_allowed_origin(channel: ReleaseChannel): string {
	switch(channel) {
		case 'dev':
			return 'http://localhost:8080'
		case 'staging':
			return 'https://offirmo-monorepo.netlify.app'
		case 'prod':
			return 'https://www.online-adventur.es'
		default:
			throw new Error(`[${LIB}] no allowed origin for channel "${channel}"!`)
	}
}

function _get_api_base_url(channel: ReleaseChannel): string {
	switch(channel) {
		case 'dev':
			return 'http://localhost:9000'
		case 'staging':
			return 'https://offirmo-monorepo.netlify.app/.netlify/functions'
		case 'prod':
			return 'https://www.online-adventur.es/.netlify/functions'
		default:
			if ((channel as any) === 'unknown')
				return 'https://test.test'
			throw new Error(`[${LIB}] no base URL for channel "${channel}"!`)
	}
}

export function get_api_base_url(channel: ReleaseChannel): string {
	return overrideHook<string>('api-base-url', _get_api_base_url(channel))
}

export function create_server_response_body__blank<T>(): OAServerResponseBody<T> {
	return {
		v: SERVER_RESPONSE_VERSION,
		data: undefined,
		error: undefined,
		side: {},
		meta: {},
	}
}

export function create_server_response_body__error<T>(error: Readonly<XXError>): OAServerResponseBody<T> {
	const body = create_server_response_body__blank<T>()

	body.error = {
		message: error.message,
		code: error.code,
		logical_stack: error._temp?.SEC?.getLogicalStack(),
	}

	return body
}

export function create_server_response_body__data<T>(data: T): OAServerResponseBody<T> {
	const body = create_server_response_body__blank<T>()

	body.data = data

	return body
}

export function is_server_response_body(body: any): body is OAServerResponseBody<any> {
	return body && body.v && body.side && body.meta && (body.data || body.error)
}
