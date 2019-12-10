import fetch_json from '../../utils/fetch-json'

let request_count = 0

interface HandShakeRequest {}
interface HandShakeResponse {
	game_version: number
	savegames: Array<{
		id: number
		revision: number
		has_diverged: boolean

		avatar_name: string
		klass: string
		level: number
	}>
}

function create(url_root: string) {
	const rpc_url = url_root + '/.netlify/functions/tbrpg-rpc/'

	/*
	function offirmo_request<Params, Result>(
		url: string,
		method: string,
		params: Params,
		id: number | string = request_count++
	): Promise<Result> {
		const request: ORequest<Params> = {
			'o⋄v': 1,
			id,
			params,
		}
		return fetch_json<OResponse<Result>>(
				url,
				{
					method,
					body: JSON.stringify(request),
				},
			)
			.then(
				// format check
				(response: any): OResponse<Result> => {
					if (!response || response['o⋄v'] !== 1)
						throw new Error('NIMP!')

					return response
				},
				(err: any) => {
					// can that happen?
					throw err
				}
			)
			.then(
				// format check
				(response: OResponse<Result>): Result => {
					return response.result
				},
				(err: any) => {
					// can that happen?
					throw err
				}
			)
	}
*/
	/*
	function rpc<Params, Result>(
		method: string,
		params: Params,
		id: number | string = request_count++
	): Promise<Result> {
		// see http://www.simple-is-better.org/json-rpc/transport_http.html
		const request: JSONRpcRequest<Params> = {
			jsonrpc: '2.0',
			id,
			method,
			params,
		}
		return offirmo_request<JSONRpcRequest<Params>, JSONRpcResponse<Result>>(
				rpc_url,
				'PUT',
				request,
				id,
			)
			.then(
				// format check
				(response: JSONRpcResponse<Result>): Result => {
					if (!response || response.jsonrpc !== '2.0')
						throw new Error('NIMP!')

					if (response.error) {
						const { code, message, data } = response.error
						// TODO easy error creation
						const error = new Error(`RPC error: "${String(message)}"!`)
						// TODO decorate
						throw error
					}

					return response.result!
				})
	}

	function handshake(): Promise<HandShakeResponse> {
		const request: HandShakeRequest = {}
		return rpc<HandShakeRequest, HandShakeResponse>(
			'hanshake',
			request,
		)
	}

	return {
		handshake,
	}*/
}


export {
	create,
}
