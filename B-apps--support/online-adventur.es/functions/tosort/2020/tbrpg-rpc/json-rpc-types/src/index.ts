/////////////////////
// https://www.jsonrpc.org/specification

interface JSONRpcRequest<T> {
	jsonrpc: '2.0'
	id: number | string
	method: string
	params: T // TODO maybe {}
}

interface JSONRpcResponse<T> {
	jsonrpc: '2.0'
	id: number | string
	error?: {
		code: number
		message: string
		data?: any // TODO maybe {}
	}
	result?: T // TODO maybe {}
}
////////////////////////////////////

export {
	JSONRpcRequest,
	JSONRpcResponse,
}
