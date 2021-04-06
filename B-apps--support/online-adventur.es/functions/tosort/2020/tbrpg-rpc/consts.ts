////////////////////////////////////

import { JSONRpcResponse } from '@offirmo-private/json-rpc-types'

////////////////////////////////////

const APP = 'OA∙API' // 'functions'

////////////////////////////////////

const JSONRPC_CODE = {
	parse_error: -32700, // Invalid JSON was received by the server.
								// An error occurred on the server while parsing the JSON text.
	invalid_request: -32600, // Invalid Request 	The JSON sent is not a valid Request object.
	method_not_found: -32601, // Method not found 	The method does not exist / is not available.
	invalid_params: -32602, // Invalid params 	Invalid method parameter(s).
	internal_error: -32603, // Internal error 	Internal JSON-RPC error.
	//-32000 to -32099 	Server error 	Reserved for implementation-defined server-errors.
}

function get_default_JsonRpc_error(): JSONRpcResponse<{}>['error'] {
	return {
		code: JSONRPC_CODE.internal_error,
		message: 'Internal error!',
		data: {},
	}
}

////////////////////////////////////

export {
	APP,
	// TODO move in a dedicated lib
	JSONRPC_CODE,
	get_default_JsonRpc_error,
}
