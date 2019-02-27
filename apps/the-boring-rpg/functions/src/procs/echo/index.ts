import { JSONRPCRequest, JSONRPCResponse } from '../../sub/types'
import { RpcEcho, RpcEchoResponse } from '../types'

function handle(
	req: RpcEcho,
	res: RpcEchoResponse,
): RpcEchoResponse {
	const { method, params } = req

	res.result = { method, params }
	delete res.error

	return res
}

////////////////////////////////////

export default handle
