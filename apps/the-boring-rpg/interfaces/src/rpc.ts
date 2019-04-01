import { Enum } from 'typescript-string-enums'
import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'
import { State } from '@tbrpg/state'

import { PlayedAction } from './actions'

////////////////////////////////////

const Method = Enum(
	'echo',

	'sync',

	//'play',
)
type Method = Enum<typeof Method> // eslint-disable-line no-redeclare

/////////////////////

interface RpcEcho extends JSONRpcRequest<any> {
	method: typeof Method.echo
}

interface SyncParams {
	engine_v: string
	pending_actions: PlayedAction[]
	current_state_hash: string
}
interface RpcSyncParams extends SyncParams {
	rpc_v: 1,
}
interface RpcSync extends JSONRpcRequest<RpcSyncParams> {
	method: typeof Method.sync
}

/////////////////////

interface RpcEchoResponse extends JSONRpcResponse<any> {
}

interface RpcSyncResult {
	rpc_v: 1,
	engine_v: string
	authoritative_state?: State // only if not matching
}
interface RpcSyncResponse extends JSONRpcResponse<RpcSyncResult> {
	result: RpcSyncResult
}


/////////////////////

type TbrpgRpc =
	RpcEcho |
	RpcSync

type TbrpgRpcResponse =
	RpcEchoResponse |
	RpcSyncResponse

/////////////////////

export {
	JSONRpcRequest,
	JSONRpcResponse,

	Method,

	RpcEcho,
	RpcSync,
	TbrpgRpc,

	SyncParams,
	RpcSyncParams,

	RpcEchoResponse,
	RpcSyncResponse,
	TbrpgRpcResponse,
}
