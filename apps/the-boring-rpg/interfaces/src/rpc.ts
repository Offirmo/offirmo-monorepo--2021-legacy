import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'

import { State } from '@tbrpg/state'

import { Action } from './actions'

////////////////////////////////////

const Method = Enum(
	'echo', // for tests
	'sync',
)
type Method = Enum<typeof Method> // eslint-disable-line no-redeclare

/////////////////////

interface RpcEcho extends JSONRpcRequest<any> {
	method: typeof Method.echo
}
interface RpcEchoResponse extends JSONRpcResponse<any> {
}

///////

interface SyncParams {
	engine_v: string

	// incremental mode
	pending_actions?: Action[]
	current_state_hash?: string

	// full bkp mode
	// this implies that the savegame may have been touched
	state?: State
}
interface SyncResult {
	engine_v: string // to force an update if needed
	processed_up_to_time: TimestampUTCMs
	authoritative_state?: State // only if needed (ex. more recent on server)
	// TODO more stuff: message, recent good drops...
	// Or TODO put the common stuff in a common type?
}

interface RpcSync extends JSONRpcRequest<SyncParams> {
	method: typeof Method.sync
}
interface RpcSyncResponse extends JSONRpcResponse<SyncResult> {
	result: SyncResult
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
	SyncResult,

	RpcEchoResponse,
	RpcSyncResponse,
	TbrpgRpcResponse,
}
