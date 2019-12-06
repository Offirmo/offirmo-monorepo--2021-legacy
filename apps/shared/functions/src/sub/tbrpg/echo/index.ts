//import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'
import { RpcEcho, RpcEchoResponse } from '@tbrpg/interfaces'

async function handle(
	req: Readonly<RpcEcho>,
	res: RpcEchoResponse,
): Promise<void> {
	const { method, params } = req

	res.result = { method, params }
	delete res.error

}

////////////////////////////////////

export default handle
