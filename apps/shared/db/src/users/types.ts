import { WithTimestamps } from '../types'

/////////////////////
// NOTE: This is CODE data

export interface BaseUser {
	called: string
	email: string
	avatar_url?: string
	roles: string[]
}

/////////////////////
// corresponding DB data

export interface User extends Partial<BaseUser>, WithTimestamps {
	id: number
}

export interface NetlifyUser extends /*Partial<BaseUser>,*/ WithTimestamps {
	own_id: string
	user_id: number
}

export interface MergedUser extends BaseUser, WithTimestamps {
	id: number
	_: {
		user: User
	}
}
