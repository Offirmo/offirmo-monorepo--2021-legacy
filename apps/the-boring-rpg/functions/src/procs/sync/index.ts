import { VERSION } from '@tbrpg/flux'
import { RpcSync, RpcSyncResponse } from '@tbrpg/interfaces'

////////////////////////////////////

function handle(
	req: RpcSync,
	res: RpcSyncResponse,
): RpcSyncResponse {

	res.error!.message = 'not implemented!'
	/*res.result = {
		rpc_v: 1,
		engine_v: VERSION,
		//authoritative_state: null
	}
	delete res.error*/

	return res
}

////////////////////////////////////

export default handle
