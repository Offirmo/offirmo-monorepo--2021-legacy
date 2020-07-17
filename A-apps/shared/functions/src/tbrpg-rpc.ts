import { Enum } from 'typescript-string-enums'

import { Method, TbrpgRpc, TbrpgRpcResponse } from '@tbrpg/interfaces'
import { ReleaseChannel, get_allowed_origin } from '@offirmo-private/functions-interface'

import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
	NetlifyClientContext
} from './sub/types'
import {
	JSONRPC_CODE,
	get_default_JsonRpc_error,
} from './sub/consts'

import { create_error } from './sub/utils'

import { process_rpc } from './sub/tbrpg'
import { use_middlewares_with_error_safety_net } from './sub/middlewares/runner'
import { HttpMethod, require_http_method } from './sub/middlewares/require-http-method'
import { require_authenticated } from './sub/middlewares/require-authenticated'
import { XSoftExecutionContext} from './sub/middlewares/types'

////////////////////////////////////

async function handle_cors(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	if (event.httpMethod.toUpperCase() !== 'OPTIONS')
		return next()

	await SEC.xTry('handle_cors()', async ({ logger, CHANNEL }) => {
		logger.log('\n******* handling a tbrpg-rpc… *******')

		const origin = event.headers.origin
		const expected_origin = get_allowed_origin(CHANNEL as ReleaseChannel)
		if (origin !== expected_origin)
			throw create_error(405, {
				expected_origin,
				origin,
			})

		response.statusCode = 200
		response.headers['Access-Control-Allow-Origin'] = expected_origin
		response.body = 'OK'
	})
}

async function using_json_rpc(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	return SEC.xTry('using_json_rpc()', async ({ logger }) => {
		logger.log('\n******* handling a json-rpc msg… *******')

		let statusCode = 500
		let res: TbrpgRpcResponse = {
			jsonrpc: '2.0',
			id: '???',
			error: get_default_JsonRpc_error(),
			result: undefined,
		}

		try {
			res.error!.code = JSONRPC_CODE.invalid_request
			statusCode = 400
			check_sanity(event)
			const req: TbrpgRpc = parse_jsonrpc_requests(res, event)

			res.error!.code = JSONRPC_CODE.internal_error
			res.error!.message = 'Unknown internal error while processing the request!'
			statusCode = 500

			SEC.injectDependencies({
				jsonrpc_request: req,
				jsonrpc_response: res,
			})

			await next()

			if (res.error && res.result)
				throw new Error('Internal error: unclear result after handling!')

			if (res.result)
				statusCode = 200 // was processed correctly
		} catch (err) {
			statusCode = err.statusCode || statusCode

			res.error = err.jsonrpc_response
				? err.jsonrpc_response
				: res.error
					? res.error // the default one we put at the start
					: get_default_JsonRpc_error() // it could have been deleted

			res.error!.message = err.message // forced, or wouldn't have needed to catch

			delete res.result
		}

		response.statusCode = statusCode
		response.body = JSON.stringify(res)
	})
}

async function _handler(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	return SEC.xTry('/tbrpg-rpc', async ({ logger, jsonrpc_request, jsonrpc_response }) => {
		logger.log('\n******* handling a tbrpg-rpc… *******')

		const req: TbrpgRpc = jsonrpc_request as any
		const res: TbrpgRpcResponse = jsonrpc_response as any

		await process_rpc(req, res)

		await next()
	})
}

////////////

function check_sanity(event: APIGatewayEvent) {
	const { body, isBase64Encoded } = event

	if (isBase64Encoded)
		throw create_error('Base 64 unexpected!', {
			statusCode: 422,
		})

	if (!body)
		throw create_error('Missing body!', {
			statusCode: 413,
		})

	if (body.length > 32_000)
		throw create_error('Body too big!', {
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
		//console.error(err)
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

const handler: NetlifyHandler = (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return use_middlewares_with_error_safety_net(
		event,
		badly_typed_context,
		[
			require_http_method([ HttpMethod.POST ]),
			handle_cors,
			require_authenticated,
			using_json_rpc,
			_handler,
		]
	)
}

export { handler }

