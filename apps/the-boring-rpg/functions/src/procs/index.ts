import { Enum } from 'typescript-string-enums'

import {
	JSONRPCRequest,
	JSONRPCResponse,
	JSONRPC_CODE,
	DEFAULT_JSONRPC_ERROR_PAYLOAD
} from '../sub/types'

import { create_error } from '../sub/utils'

import {
	TbrpgRpc,
	TbrpgRpcResponse,
	Method,
	RpcEcho,
	RpcEchoResponse,
	RpcSync,
	RpcSyncResponse,
	RpcPlay,
	RpcPlayResponse,
} from './types'

import process_rpc_echo from './echo'
import process_rpc_sync from './sync'
import process_rpc_play from './play'

function process_rpc(
	req: TbrpgRpc,
	res: TbrpgRpcResponse,
): TbrpgRpcResponse {

	switch(req.method) {
		case Method.echo:
			return process_rpc_echo(req as RpcEcho, res as RpcEchoResponse)

		case Method.sync:
			return process_rpc_sync(req as RpcSync, res as RpcSyncResponse)

		case Method.play:
			return process_rpc_play(req as RpcPlay, res as RpcPlayResponse)

		default: {
			throw create_error('RPC method not implemented!', {
				statusCode: 501,
			})
		}
	}
}

////////////////////////////////////

export { process_rpc }
