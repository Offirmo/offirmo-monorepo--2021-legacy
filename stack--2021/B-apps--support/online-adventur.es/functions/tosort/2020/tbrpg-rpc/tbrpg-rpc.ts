/*
process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
*/
import '@offirmo/universal-debug-api-node'

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
import require_authenticated from './sub/middlewares/require-authenticated'
import handle_cors from './sub/middlewares/handle_cors'
import { XSoftExecutionContext} from './sub/middlewares/types'

////////////////////////////////////

async function using_json_rpc(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	return SEC.xTry('using_json_rpc()', async ({ SEC, logger }) => {
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
			check_sanity(SEC, event)
			const req: TbrpgRpc = parse_jsonrpc_requests(SEC, res, event)

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
	return SEC.xTry('/tbrpg-rpc', async ({ SEC, logger, jsonrpc_request, jsonrpc_response }) => {
		logger.log('\n******* handling a tbrpg-rpc… *******')

		const req: TbrpgRpc = jsonrpc_request as any
		const res: TbrpgRpcResponse = jsonrpc_response as any

		await process_rpc(SEC, req, res)

		await next()
	})
}

////////////

function check_sanity(SEC: XSoftExecutionContext, event: APIGatewayEvent) {
	const { body, isBase64Encoded } = event

	if (isBase64Encoded)
		throw create_error(SEC, 'Base 64 unexpected!', {
			statusCode: 422,
		})

	if (!body)
		throw create_error(SEC, 'Missing body!', {
			statusCode: 413,
		})

	if (body.length > 32_000)
		throw create_error(SEC, 'Body too big!', {
			statusCode: 413,
		})
}

////////////

function parse_jsonrpc_requests(SEC: XSoftExecutionContext, res: TbrpgRpcResponse, event: APIGatewayEvent): TbrpgRpc {
	let data: any
	try {
		data = JSON.parse(event.body!)
	}
	catch(err) {
		//console.error(err)
		res.error!.code = JSONRPC_CODE.parse_error
		throw create_error(SEC, 'JSON.Parse error!', {
			statusCode: 400,
		})
	}

	if (Array.isArray(data)) {
		// we don't support batching
		res.error!.code = JSONRPC_CODE.parse_error
		throw create_error(SEC, 'Batch RPC not implemented!', {
			statusCode: 501,
		})
	}

	if (Object.keys(data).sort().join(',') !== 'id,jsonrpc,method,params'
		|| data.jsonrpc !== '2.0'
		|| !(Number.isInteger(data.id) || typeof data.id === 'string')
	) {
		res.error!.code = JSONRPC_CODE.invalid_request
		throw create_error(SEC, 'Bad JSON-RPC structure!', {
			statusCode: 400,
		})
	}

	res.id = data.id
	res.error!.data.method = data.method // for convenience

	if (Object.keys(data.params).length < 1) {
		res.error!.code = JSONRPC_CODE.invalid_params
		throw create_error(SEC, 'Invalid params!', {
			statusCode: 400,
		})
	}

	if (!Enum.isType(Method, data.method)) {
		res.error!.code = JSONRPC_CODE.method_not_found
		throw create_error(SEC, 'Invalid RPC method!', {
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
