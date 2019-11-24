import Knex from 'knex'
import assert from 'tiny-invariant'

import { TABLE_USERS } from './consts'
import get_db from '../db'
import logger from '../utils/logger'



export async function delete_user_by_email(email: string, trx: ReturnType<typeof get_db> = get_db()): Promise<void> {
	logger.log('deleting user by email...', { email })
	await trx(TABLE_USERS)
		.where('email', email)
		.delete()
}

