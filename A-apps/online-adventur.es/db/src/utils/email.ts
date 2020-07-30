const crypto = require('crypto')
import { NORMALIZERS } from '@offirmo-private/normalize-string'

export function get_gravatar_url(email: string): string {
	email = NORMALIZERS.normalize_email_reasonable(email) // not too much
	const md5 = crypto.createHash('md5').update(email).digest('hex')
	return `https://www.gravatar.com/avatar/${md5}?r=pg&d=retro`
}


export function normalize_email_safe(email: string): string {
	return NORMALIZERS.normalize_email_safe(email)
}

export function normalize_email_reasonable(email: string): string {
	const temp = NORMALIZERS.normalize_email_reasonable(email)
	if (temp.startsWith('offirmo.net@')) {
		return normalize_email_safe(email)
	}
	return temp
}

export function normalize_email_full(email: string): string {
	const temp = NORMALIZERS.normalize_email_full(email)
	if (temp.startsWith('offirmonet@')) {
		return normalize_email_safe(email)
	}
	return temp
}
