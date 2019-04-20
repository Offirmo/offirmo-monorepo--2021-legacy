import { create_error } from '../sub/utils'

import {
	TbrpgRpc,
	TbrpgRpcResponse,
	Method,
	RpcEcho,
	RpcEchoResponse,
	RpcSync,
	RpcSyncResponse,
} from '@tbrpg/interfaces'

import process_rpc_echo from './echo'
import process_rpc_sync from './sync'

function process_rpc(
	req: TbrpgRpc,
	res: TbrpgRpcResponse,
): TbrpgRpcResponse {

	switch(req.method) {
		case Method.echo:
			return process_rpc_echo(req as RpcEcho, res as RpcEchoResponse)

		case Method.sync:
			return process_rpc_sync(req as RpcSync, res as RpcSyncResponse)

		default: {
			throw create_error('RPC method not implemented!', {
				statusCode: 501,
			})
		}
	}
}

////////////////////////////////////

export { process_rpc }
