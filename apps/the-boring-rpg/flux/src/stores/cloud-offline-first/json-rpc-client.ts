import assert from 'tiny-invariant'
import Deferred from '@offirmo/deferred'
import { TimestampUTCMs, get_UTC_timestamp_ms } from "@offirmo-private/timestamps";
import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'

import { SoftExecutionContext } from '../../sec'
import fetch from '../../utils/fetch'
import { JsonRpcCaller } from './types'

////////////////////////////////////


//const url = 'http://localhost:9000/tbrpg-rpc'
// http://localhost:9000/tbrpg-rpc
// https://www.online-adventur.es/.netlify/functions/tbrpg-rpc
// https://offirmo-monorepo.netlify.com/.netlify/functions/tbrpg-rpc

function create({ rpc_url }: { rpc_url: string }): JsonRpcCaller {
	assert(rpc_url)

	let id = 0

	return function call_remote_procedure<Params, Resp>(
		{SEC, method, params}: {
			SEC: SoftExecutionContext,
			method: string,
			params: Params,
		}
	): Promise<Resp> {
		const request_id = ++id

		const request: JSONRpcRequest<Params> = {
			jsonrpc: '2.0',
			id: request_id,
			method,
			params,
		}

		let is_status_success = false // so far
		//let error_messages = 'Failed fetch' // so far

		return Promise.race([
			new Promise((resolve, reject) => setTimeout(() => {
				reject(new Error(`Timeout!`))
			}, 5000)),
			fetch(rpc_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: request,
			})
		])
			.then((response: any) => {
				// WARN: we can't destructure response because .json() needs a binding to response
				is_status_success = response.ok

				// we may have a RPC response even if the status is a failure,
				// try to read the body systematically
				if (response.bodyUsed)
					return response.json()

				throw new Error('No body in response!')
			})
			.then((response: JSONRpcResponse<any>) => {
				if (!response)
					throw new Error('No response data!')

				const {jsonrpc, id: response_id, error, result} = response
				if (!jsonrpc)
					throw new Error(`body is not a jsonRpc response!`)
				if (jsonrpc !== '2.0')
					throw new Error(`Invalid jsonRpc version!`)
				if (response_id !== request_id)
					throw new Error(`mismatched RPC id!`)

				if (error) {
					// TODO create error with all details
					// inc. status
					throw new Error(error.message)
				}

				return result
			})
			.catch((err: Error) => {
				console.error(`RPC failed!`, {rpc_url, method, params, request, err})
				throw err
			})
	}
}

export {
	JsonRpcCaller,
	create,
}
