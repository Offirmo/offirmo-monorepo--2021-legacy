import { Enum } from 'typescript-string-enums'

import { TimestampUTCMs } from '@offirmo/timestamps'
import {ActionType} from "@tbrpg/flux/src";

import {
	JSONRPCRequest as JsonRpcRequest,
	JSONRPCResponse as JsonRpcResponse,
} from '../sub/types'

/////////////////////

const Method = Enum(
	// utils
	'echo',

	// tbrpg meta
	'sync',

	// tbrpg actions
	'play',
)
type Method = Enum<typeof Method> // eslint-disable-line no-redeclare

/////////////////////

interface BaseRpc {
	//expected_state_revision?: number // safety. TODO useful??
}

interface RpcEcho extends JsonRpcRequest<any> {
	method: typeof Method.echo
}

interface RpcSync extends JsonRpcRequest<{}> {
	method: typeof Method.sync
}

interface RpcPlay extends JsonRpcRequest<{
	actions: ActionType[]
}> {
	method: typeof Method.play
}

interface RpcEchoResponse extends JsonRpcResponse<any> {
}

interface RpcSyncResponse extends JsonRpcResponse<{
	v: string
}> {}

interface RpcPlayResponse extends JsonRpcResponse<{

}> {}

/*
interface RpcEcho extends BaseRpc {
	//type: typeof Method.echo
}

interface RpcSync extends BaseRpc {
	//type: typeof Method.sync
}

interface RpcPlay extends BaseRpc {
	//type: typeof Method.play
	actions: ActionType[]
}
*/

type TbrpgRpc =
	RpcEcho |
	RpcSync |
	RpcPlay

type TbrpgRpcResponse =
	RpcEchoResponse |
	RpcSyncResponse |
	RpcPlayResponse

/////////////////////

export {
	Method,

	RpcEcho,
	RpcSync,
	RpcPlay,
	TbrpgRpc,

	RpcEchoResponse,
	RpcSyncResponse,
	RpcPlayResponse,
	TbrpgRpcResponse,
}
