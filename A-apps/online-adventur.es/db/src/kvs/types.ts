import { WithTimestamps } from '../types'

import { PUser } from '../users/types'

/////////////////////
// NOTE: This is CODE data

export interface KeyValue<T> {
	key: string
	value: T
	bkp: null | any
	'v-1': null | any
	'v-2': null | any
}

/////////////////////
// corresponding PERSISTENCE (DB) data

export interface PKeyValue<T> extends WithTimestamps {
	user_id: PUser['id']
	key: string
	value: T
	bkp: null | any
	'v-1': null | any
	'v-2': null | any
}

/////////////////////
