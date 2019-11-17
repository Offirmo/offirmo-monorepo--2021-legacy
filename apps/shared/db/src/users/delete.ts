import Knex from 'knex'
import assert from 'tiny-invariant'

import { TABLE_USERS } from './consts'
import get_db from '../db'
import { WithoutTimestamps } from '../types'
import { BaseUser, User, NetlifyUser } from './types'


export async function delete_user_by_email(email: string, trx: ReturnType<typeof get_db> = get_db()): Promise<void> {
	await trx(TABLE_USERS)
		.where('email', email)
		.delete()
}

