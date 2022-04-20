import { VERSION } from '@tbrpg/flux'
import { RpcSync, RpcSyncResponse } from '@tbrpg/interfaces'

////////////////////////////////////

async function handle(
	req: Readonly<RpcSync>,
	res: RpcSyncResponse,
): Promise<void> {


	res.error!.message = 'not implemented!'
	/*res.result = {
		rpc_v: 1,
		engine_v: VERSION,
		//authoritative_state: null
	}
	delete res.error*/
}

////////////////////////////////////

export default handle
