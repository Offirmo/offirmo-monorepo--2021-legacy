import { VERSION } from '@tbrpg/flux'
import { RpcPlay, RpcPlayResponse } from '../types'

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
