import { VERSION } from '@tbrpg/flux'
import { RpcPlay, RpcPlayResponse } from '@tbrpg/rpc-interface'

////////////////////////////////////

function handle(
	req: RpcPlay,
	res: RpcPlayResponse,
): RpcPlayResponse {

	res.result = {
		// TODO
	}
	delete res.error

	return res
}

////////////////////////////////////

export default handle
