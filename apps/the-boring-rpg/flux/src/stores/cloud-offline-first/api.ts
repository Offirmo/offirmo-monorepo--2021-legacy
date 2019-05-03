import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'

import {
	SCHEMA_VERSION,
	State,
} from '@tbrpg/state'

import {
	Action,
	RpcSyncParams,
	RpcSyncResult,
	Method,
} from '@tbrpg/interfaces'

import fetch from '../../utils/fetch'
import { hash_state } from '../../utils/hash-state'


let id = 0
function call_remote_procedure<Params, Resp>({ method, params } : { method: Method, params: Params }): Resp {
	const request_id = ++id

	const request: JSONRpcRequest<Params> = {
		jsonrpc: '2.0',
		id: request_id,
		method,
		params,
	}

	const url = 'https://foo'

	let ok = false // so far
	let error_messages = 'Failed fetch' // so far

	return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: request,
		})
		.then((response: any) => {
			// WARN: we can't destructure response because .json() needs a binding to response
			ok = response.ok
			if (!ok) {
				// TODO should a bad status mandate a failure?
				error_messages += `, status="${response.status}"`
			}

			if (response.bodyUsed)
				return response.json()

			throw new Error('no body in response!')
		})
		.then((response: JSONRpcResponse<any>) => {
			if (!response)
				throw new Error('No response data!')

			const { jsonrpc, id: response_id, error, result } = response
			if (jsonrpc !== '2.0')
				throw new Error(`Invalid jsonRpc version!`)
			if (response_id !== request_id)
				throw new Error(`mismatched RPC id!`)

			if (error) {
				throw new Error(error.message)
			}

			return result
		})
		.catch((err: Error) => {
			ok = false
			error_messages += ', ' + err.message
		})
		.finally(() => {
			if (!ok)
				throw new Error(error_messages);
		})
		.catch((err: Error) => {
			console.error(url, method, request, err)
			throw err
		})
}

export function sync(pending_actions: Action[], current_state: State) {
	const current_state_hash = hash_state(current_state)

	return call_remote_procedure<RpcSyncParams, RpcSyncResult>({
		method: Method.sync,
		params: {
			rpc_v: 1,
			engine_v: SCHEMA_VERSION,
			pending_actions,
			current_state_hash,
		}
	})
}
