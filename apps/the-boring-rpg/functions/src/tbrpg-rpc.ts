import { Enum } from 'typescript-string-enums'

import {
	APIGatewayEvent,
	Context,
	Response,
	NetlifyHandler,
	JSONRPC_CODE,
	DEFAULT_JSONRPC_ERROR_PAYLOAD
} from './sub/types'

import { create_error } from './sub/utils'

import { Method, TbrpgRpc, TbrpgRpcResponse } from '@tbrpg/interfaces'
import { process_rpc } from './procs'

////////////////////////////////////


const handler: NetlifyHandler = async (
	event: APIGatewayEvent,
	context: Context,
): Promise<Response> => {
	console.log('\n*******\n* handling a tbrpg-rpc…')

	let statusCode = 500
	let res: TbrpgRpcResponse = {
		jsonrpc: '2.0',
		id: '???',
		error: DEFAULT_JSONRPC_ERROR_PAYLOAD,
		result: undefined,
	}

	try {
		res.error!.code = JSONRPC_CODE.invalid_request
		statusCode = 400
		check_sanity(event)
		const req: TbrpgRpc = parse_jsonrpc_requests(res, event)

		res.error!.code = JSONRPC_CODE.internal_error
		res.error!.message = 'internal error while processing the request!'
		statusCode = 500

		// TODO extract Context
		res = process_rpc(req, res)

		if (res.error && res.result)
			throw new Error('Internal error: unclear result after handling!')

		if (res.result)
			statusCode = 200 // was processed correctly
	}
	catch (err) {
		statusCode = err.statusCode || statusCode

		res.error = err.jsonrpc_response
			? err.jsonrpc_response
			: res.error
				? res.error
				: DEFAULT_JSONRPC_ERROR_PAYLOAD // it could have been deleted

		res.error!.message = err.message // forced, or wouldn't have needed to catch

		delete res.result
	}

	return {
		statusCode,
		body: JSON.stringify(res),
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

function parse_jsonrpc_requests(res: TbrpgRpcResponse, event: APIGatewayEvent): TbrpgRpc {
	let data: any
	try {
		data = JSON.parse(event.body!)
	}
	catch(err) {
		console.error(err)
		res.error!.code = JSONRPC_CODE.parse_error
		throw create_error('JSON.Parse error!', {
			statusCode: 400,
		})
	}

	if (Array.isArray(data)) {
		// we don't support batching
		res.error!.code = JSONRPC_CODE.parse_error
		throw create_error('Batch RPC not implemented!', {
			statusCode: 501,
		})
	}

	if (Object.keys(data).sort().join(',') !== 'id,jsonrpc,method,params'
		|| data.jsonrpc !== '2.0'
		|| !(Number.isInteger(data.id) || typeof data.id === 'string')
	) {
		res.error!.code = JSONRPC_CODE.invalid_request
		throw create_error('Bad JSON-RPC structure!', {
			statusCode: 400,
		})
	}

	res.id = data.id
	res.error!.data.method = data.method // for convenience

	if (Object.keys(data.params).length < 1) {
		res.error!.code = JSONRPC_CODE.invalid_params
		throw create_error('Invalid params!', {
			statusCode: 400,
		})
	}

	if (!Enum.isType(Method, data.method)) {
		res.error!.code = JSONRPC_CODE.method_not_found
		throw create_error('Invalid RPC method!', {
			statusCode: 400,
		})
	}

	// ok, it looks like a real valid TBRPG RPC
	return data
}

////////////////////////////////////

export { handler }
