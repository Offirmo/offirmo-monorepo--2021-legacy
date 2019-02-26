import { Enum } from 'typescript-string-enums'

import {
	JSONRPCRequest,
	JSONRPCResponse,
} from '@offirmo/ts-types'

import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
} from './sub/types'

import { create_error, throw_new_error } from './sub/utils'

import { TBRPGCall, Method } from './procs/types'

const JSONRPC_CODE = {
	parse_error: -32700, // Invalid JSON was received by the server.
	                     // An error occurred on the server while parsing the JSON text.
	invalid_request: -32600, // Invalid Request 	The JSON sent is not a valid Request object.
	method_not_found: -32601, // Method not found 	The method does not exist / is not available.
	invalid_params: -32602, // Invalid params 	Invalid method parameter(s).
	internal_error: -32603, // Internal error 	Internal JSON-RPC error.
	//-32000 to -32099 	Server error 	Reserved for implementation-defined server-errors.
}

////////////////////////////////////
const DEFAULT_ERROR_PAYLOAD = {
	code: JSONRPC_CODE.internal_error,
	message: 'Internal error!',
	data: {},
}

const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	context: Context,
): Promise<Response> => {
	console.log('\n*******\n* handling a tbrpg-rpc…')

	let statusCode = 500
	let jsonrpc_response: JSONRPCResponse<TBRPGCall> = {
		jsonrpc: '2.0',
		id: '???',
		error: DEFAULT_ERROR_PAYLOAD,
		result: undefined,
	}

	try {
		jsonrpc_response.error!.code = JSONRPC_CODE.invalid_request
		statusCode = 400
		check_sanity(event)
		const jsonrpc_request = parse_jsonrpc_requests(jsonrpc_response, event)

		jsonrpc_response.error!.code = JSONRPC_CODE.internal_error
		statusCode = 500
		// TODO extract Context
		jsonrpc_response = process_rpc(jsonrpc_request, jsonrpc_response, context)

		statusCode = 200 // was processed
	}
	catch (err) {
		statusCode = err.statusCode || 500

		if (err.jsonrpc_response)
			jsonrpc_response = err.jsonrpc_response

		if (!jsonrpc_response.error) {
			jsonrpc_response.error = jsonrpc_response.error || DEFAULT_ERROR_PAYLOAD
		}
		jsonrpc_response.error!.message = err.message

		delete jsonrpc_response.result
	}

	return {
		statusCode,
		body: JSON.stringify(jsonrpc_response),
	}
}

////////////

function check_sanity(event: APIGatewayEvent) {
	const { httpMethod, body, isBase64Encoded } = event

	if (httpMethod !== 'PUT')
		throw create_error('Wrong HTTP method!', {
			statusCode: 405,
		})

	if (isBase64Encoded)
		throw create_error('Base 64 unexpected!', {
			statusCode: 422,
		})

	if (!body || body.length > 30_000)
		throw create_error('Bad body!', {
			statusCode: 413,
		})
}

////////////

function parse_jsonrpc_requests(resp: JSONRPCResponse<TBRPGCall>, event: APIGatewayEvent): JSONRPCRequest<TBRPGCall> {
	let data: any
	try {
		data = JSON.parse(event.body!)
	}
	catch(err) {
		console.error(err)
		resp.error!.code = JSONRPC_CODE.parse_error
		throw create_error('JSON.Parse error!', {
			statusCode: 400,
		})
	}

	if (Array.isArray(data)) {
		// we don't support batching
		resp.error!.code = JSONRPC_CODE.parse_error
		throw create_error('Batch RPC not implemented!', {
			statusCode: 501,
		})
	}

	if (Object.keys(data).sort().join(',') !== 'id,jsonrpc,method,params'
		|| data.jsonrpc !== '2.0'
		|| !(Number.isInteger(data.id) || typeof data.id === 'string')
	) {
		resp.error!.code = JSONRPC_CODE.invalid_request
		throw create_error('Bad JSON-RPC structure!', {
			statusCode: 400,
		})
	}

	resp.id = data.id

	if (Object.keys(data.params).length < 1) {
		resp.error!.code = JSONRPC_CODE.invalid_params
		throw create_error('Invalid params!', {
			statusCode: 400,
		})
	}

	if (!Enum.isType(Method, data.method)) {
		resp.error!.code = JSONRPC_CODE.method_not_found
		throw create_error('Invalid RPC method!', {
			statusCode: 400,
		})
	}

	// ok, it looks like a real valid TBRPG RPC
	return data
}

////////////

function process_rpc(
	req: JSONRPCRequest<TBRPGCall>,
	resp: JSONRPCResponse<TBRPGCall>,
	context: Context
): JSONRPCResponse<TBRPGCall> {
	resp.error!.code = JSONRPC_CODE.internal_error

	const { id, method, params } = req
	switch(method) {
		case Method.echo: {
			resp.result = { method, params }
			delete resp.error
			break
		}
		default: {
			throw create_error('RPC method not implemented!', {
				statusCode: 501,
			})
		}
	}

	return resp
}

////////////////////////////////////

export { handler }
