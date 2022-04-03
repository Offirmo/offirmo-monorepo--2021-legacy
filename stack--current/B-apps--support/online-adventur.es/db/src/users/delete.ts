import { TABLE__USERS } from './consts'
import get_db from '../db'
import { logger, normalize_email_full } from '../utils'

////////////////////////////////////

export async function delete_by_email(
	raw_email: string,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	const normalized_email = normalize_email_full(raw_email)
	logger.log('deleting user by email...', { raw_email, normalized_email })
	await trx(TABLE__USERS)
		.where('normalized_email', normalized_email)
		.delete()
}

// No need for sub-user delete, the deletion cascades
