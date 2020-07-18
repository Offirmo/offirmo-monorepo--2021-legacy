import { create_error } from '../utils'

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
import { XSoftExecutionContext } from '../services/sec'

async function process_rpc(
	SEC: XSoftExecutionContext,
	req: Readonly<TbrpgRpc>,
	res: TbrpgRpcResponse,
): Promise<void> {
	const { method } = req

	switch(method) {
		case Method.echo:
			return process_rpc_echo(req as RpcEcho, res as RpcEchoResponse)

		case Method.sync:
			return process_rpc_sync(req as RpcSync, res as RpcSyncResponse)

		default: {
			throw create_error(SEC, 'RPC method not implemented!', {
				method,
				statusCode: 501,
			})
		}
	}
}

////////////////////////////////////

export { process_rpc }
