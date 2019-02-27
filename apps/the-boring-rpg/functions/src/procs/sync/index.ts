import { VERSION } from '@tbrpg/flux'
import { JSONRPCRequest, JSONRPCResponse } from '../../sub/types'
import { TBRPGCall } from '../types'

function handle(
	req: JSONRPCRequest<TBRPGCall>,
	resp: JSONRPCResponse<TBRPGCall>,
): JSONRPCResponse<TBRPGCall> {
	const { method, params } = req

	resp.result = { method, params }
	delete resp.error

	return resp
}

////////////////////////////////////

export default handle
