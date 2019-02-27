import { Enum } from 'typescript-string-enums'

import {
	JSONRPCRequest,
	JSONRPCResponse,
	JSONRPC_CODE,
	DEFAULT_JSONRPC_ERROR_PAYLOAD
} from '../sub/types'

import { create_error } from '../sub/utils'

import { TBRPGCall, Method } from './types'

import process_rpc_echo from './echo'
import process_rpc_sync from './sync'
import process_rpc_play from './echo'

function process_rpc(
	req: JSONRPCRequest<TBRPGCall>,
	res: JSONRPCResponse<TBRPGCall>,
): JSONRPCResponse<TBRPGCall> {
	const { method } = req

	switch(method) {
		case Method.echo:
			return process_rpc_echo(req, res)

		case Method.sync:
			return process_rpc_sync(req, res)

		case Method.play:
			return process_rpc_play(req, res)

		default: {
			throw create_error('RPC method not implemented!', {
				statusCode: 501,
			})
		}
	}
}

////////////////////////////////////

export { process_rpc }
