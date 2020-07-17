import { WithTimestamps } from '../types'

/////////////////////
// NOTE: This is BASE data

// only strictly necessary
// fields that can be inferred can be undef / null
export interface BaseUser {
	raw_email: string
	normalized_email?: string // inferrable from raw_email
	called?: string // inferrable from raw_email
	avatar_url?: string // inferrable from raw_email
	roles: string[]
}

/////////////////////
// NOTE: This is CODE data

export interface User extends NonNullable<BaseUser> {
	// should we expose the id?
}

// TODO code or base??
export interface NetlifyUser {
	netlify_id: string
	email: string
	provider?: string
	roles: string[]
	avatar_url?: string
	full_name?: string
}

/////////////////////
// corresponding PERSISTENCE (DB) data

export interface PUser extends BaseUser, WithTimestamps {
	id: number
	normalized_email: NonNullable<BaseUser['normalized_email']> // needed as index
}

export interface PNetlifyUser extends WithTimestamps {
	own_id: string
	user_id: number
}
