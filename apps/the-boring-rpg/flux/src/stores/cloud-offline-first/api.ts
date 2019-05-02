import {
	SCHEMA_VERSION,
	State,
} from '@tbrpg/state'
import {
	Action,
	RpcSync,
	Method,
} from '@tbrpg/interfaces'

import { hash_state } from '../../utils/hash-state'
let id = 0

export function sync(pending_actions: Action[], current_state: State) {
	++id
	const current_state_hash = hash_state(current_state)

	const request: RpcSync = {
		jsonrpc: '2.0',
		id,
		method: Method.sync,
		params: {
			rpc_v: 1,
			engine_v: SCHEMA_VERSION,
			pending_actions,
			current_state_hash,
		}
	}

	
}
