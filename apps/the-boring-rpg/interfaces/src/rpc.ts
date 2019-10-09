import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'

import { State } from '@tbrpg/state'

import { Action } from './actions'

////////////////////////////////////

const Method = Enum(
	'echo', // for tests
	'sync',
	'list_savegames',
)
type Method = Enum<typeof Method> // eslint-disable-line no-redeclare

/////////////////////

interface CommonResult {
	common: {
		numver: number
		latest_notable: unknown[] // TODO social
		admin_messages: unknown[] // TODO
	}
}

interface RpcEcho extends JSONRpcRequest<any> {
	method: typeof Method.echo
}
interface RpcEchoResponse extends JSONRpcResponse<any> {
}

///////

interface SyncParams {
	numver: number

	// incremental mode
	pending_actions?: Action[]
	current_state_hash?: string

	// full bkp mode
	// this implies that the savegame may have been touched
	state?: State
}
interface SyncResult extends CommonResult {
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

///////

interface ListSavegamesParams {
	numver: number
}
interface ListSavegamesResult extends CommonResult {
	// TODO
}

interface RpcListSavegames extends JSONRpcRequest<ListSavegamesParams> {
	method: typeof Method.list_savegames
}
interface RpcListSavegamesResponse extends JSONRpcResponse<ListSavegamesResult> {
	result: ListSavegamesResult
}

/////////////////////

type TbrpgRpc =
	RpcEcho |
	RpcSync |
	RpcListSavegames

type TbrpgRpcResponse =
	RpcEchoResponse |
	RpcSyncResponse |
	RpcListSavegamesResponse

/////////////////////

export {
	JSONRpcRequest,
	JSONRpcResponse,

	Method,
/*
	SyncParams,
	SyncResult,*/

	RpcEcho,
	RpcSync,
	RpcListSavegames,
	TbrpgRpc,

	RpcEchoResponse,
	RpcSyncResponse,
	RpcListSavegamesResponse,
	TbrpgRpcResponse,
}
