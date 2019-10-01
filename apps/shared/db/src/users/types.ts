import { WithTimestamps } from '../types'

export interface BaseUser {
	called: string
	email: string
	avatar_url?: string
	roles: string[]
}

export interface User extends Partial<BaseUser> {
	id: string
}

export interface NetlifyUser extends Partial<BaseUser> {
	own_id: string
	user_id: string
}

export interface MergedUser extends BaseUser, WithTimestamps {
	id: string
}
