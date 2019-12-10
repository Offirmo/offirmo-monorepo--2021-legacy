import { WithTimestamps } from '../types'

/////////////////////
// NOTE: This is CODE data

// only strictly necessary
// fields that can be inferred can be undef / null
export interface BaseUser {
	called?: string
	usual_email: string
	normalized_email?: string
	avatar_url?: string
	roles: string[]
}

export interface User extends NonNullable<BaseUser> {
	// id?
}

export interface NetlifyUser {
	netlify_id: string
	email: string
	provider?: string
	roles: string[]
	avatar_url?: string
	full_name?: string
}

/////////////////////
// corresponding DB data
// (P = persistence)

export interface PUser extends BaseUser, WithTimestamps {
	id: number
	normalized_email: NonNullable<BaseUser['normalized_email']> // needed as index
}

export interface PNetlifyUser extends WithTimestamps {
	own_id: string
	user_id: number
}
