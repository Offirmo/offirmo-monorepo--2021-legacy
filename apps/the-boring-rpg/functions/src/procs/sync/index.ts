import { VERSION } from '@tbrpg/flux'
import { RpcSync, RpcSyncResponse } from '@tbrpg/interfaces'

////////////////////////////////////

function handle(
	req: RpcSync,
	res: RpcSyncResponse,
): RpcSyncResponse {

	res.result = {
		v: VERSION,
	}
	delete res.error

	return res
}

////////////////////////////////////

export default handle
