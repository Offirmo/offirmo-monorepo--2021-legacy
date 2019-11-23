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
	id: string
}

export interface NetlifyUser extends /*Partial<BaseUser>,*/ WithTimestamps {
	own_id: string
	user_id: string
}

export interface MergedUser extends BaseUser, WithTimestamps {
	id: string
	_: {
		user: User
	}
}
