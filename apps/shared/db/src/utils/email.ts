const crypto = require('crypto')
const normalizeEmail = require('normalize-email')
import { combine_normalizers, NORMALIZERS } from '@offirmo-private/normalize-string'


// not the same as normalize
export const clean_email = combine_normalizers(
	NORMALIZERS.trim,
	s => s.split(' ').join(''), // remove spaces inside (autocomplete after typing ".")
	NORMALIZERS.to_lower_case, // domains are case insensitive and nearly all systems are case-insensitive
	(s: string): string => {
		validate_email_structure(s)
		return s
	},
)


export function validate_email_structure(possible_email: string): void {
	const [ before, after, ...rest] = possible_email.split('@')

	//console.log({before, after, rest, ta: typeof after})

	if (rest.length)
		throw new Error('Invalid email: more than one @!')
	if (typeof after !== 'string')
		throw new Error('Invalid email: no @!')
	if (after.split('.').length < 2)
		throw new Error('Invalid email: bad domain!')
	if (!before.length || !after.length)
		throw new Error('Invalid email: bad structure!')
}


export const normalize_email = combine_normalizers(
	clean_email,
	normalizeEmail,
)


export function get_gravatar_url(email: string): string {
	email = clean_email(email)
	const md5 = crypto.createHash('md5').update(email).digest('hex')
	return `https://www.gravatar.com/avatar/${md5}?r=pg&d=retro`
}
