import { TABLE_USERS } from './consts'
import { normalize_email_full } from '../utils/email'
import get_db from '../db'
import logger from '../utils/logger'

////////////////////////////////////

export async function delete_user_by_email(
	email: string,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	email = normalize_email_full(email)
	logger.log('deleting user by email...', { email })
	await trx(TABLE_USERS)
		.where('normalized_email', email)
		.delete()
}

// No need for sub-user delete, the deletion cascades
