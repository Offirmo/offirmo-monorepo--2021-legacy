import assert from 'tiny-invariant'
import Deferred from '@offirmo/deferred'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'

import { OMRSoftExecutionContext } from '../../sec'
import fetch from '../../utils/fetch'
import { JsonRpcCaller } from './types'
import logger from './logger'

////////////////////////////////////

function create({ rpc_url, method: http_method = 'POST' }: { rpc_url: string, method?: string }): JsonRpcCaller {
	assert(rpc_url)

	let id = 0

	// TODO cancellation token?
	return function call_remote_procedure<Params, Resp>(
		{SEC, method, params}: {
			SEC: OMRSoftExecutionContext,
			method: string,
			params: Params,
		},
	): Promise<Resp> {
		const request_id = ++id

		const request: JSONRpcRequest<Params> = {
			jsonrpc: '2.0',
			id: request_id,
			method,
			params,
		}

		logger.trace(`RPC #${request_id}…`, { rpc_url, http_method, request })

		let is_status_success = false // so far
		let response_for_logging: any

		//let error_messages = 'Failed fetch' // so far

		return Promise.race([
			new Promise((resolve, reject) => setTimeout(() => {
				reject(new Error('Timeout!'))
			}, 5000)),
			fetch(rpc_url, {
				method: http_method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(request),
			}),
		])
			.then((response: any) => {
				response_for_logging = response

				// WARN: we can't destructure response because .json() needs a binding to response
				is_status_success = response.ok

				// we may have a RPC response even if the status is a failure,
				// try to read the body systematically
				if (response.bodyUsed)
					return response.json()

				throw new Error('No body in response!')
			})
			.then((response: JSONRpcResponse<any>) => {
				response_for_logging = response

				if (!response)
					throw new Error('No response data!')

				logger.trace(`RPC #${request_id} answered:`, {rpc_url, http_method, method, params, request, response: response_for_logging})

				const {jsonrpc, id: response_id, error, result} = response
				if (!jsonrpc)
					throw new Error('body is not a jsonRpc response!')
				if (jsonrpc !== '2.0')
					throw new Error('Invalid jsonRpc version!')
				if (response_id !== request_id)
					throw new Error('mismatched RPC id!')

				if (error) {
					// TODO create error with all details
					// inc. status
					throw new Error(error.message)
				}

				return result
			})
			.catch((err: Error) => {
				logger.warn(`RPC #${request_id} failed!`, {rpc_url, http_method, method, params, request, response: response_for_logging, err, err_message: err.message})
				throw err
			})
	}
}

export {
	JsonRpcCaller,
	create,
}
