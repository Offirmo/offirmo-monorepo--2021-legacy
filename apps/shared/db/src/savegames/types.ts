import { WithTimestamps } from '../types'

/////////////////////
// Code data

export interface BaseSavegame<T> {
	summary: string
	latest: T
	backup: T
	'v-1'?: T
	'v-2'?: T
	'v-3'?: T
	is_touched: boolean
	last_untouched?: T
}

/////////////////////
// corresponding DB data

export interface SaveGame<T> extends BaseSavegame<T>, WithTimestamps {
	id: string
	user_id: string
}
