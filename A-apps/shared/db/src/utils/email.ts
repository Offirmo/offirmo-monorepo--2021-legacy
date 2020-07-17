const crypto = require('crypto')
import { NORMALIZERS } from '@offirmo-private/normalize-string'

export function get_gravatar_url(email: string): string {
	email = NORMALIZERS.normalize_email_reasonable(email) // not too much
	const md5 = crypto.createHash('md5').update(email).digest('hex')
	return `https://www.gravatar.com/avatar/${md5}?r=pg&d=retro`
}
