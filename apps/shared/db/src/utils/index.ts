const normalizeEmail = require('normalize-email')
import { combine_normalizers, NORMALIZERS } from '@offirmo-private/normalize-string'


function validate_structure(possible_email: string): void {
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
	NORMALIZERS.trim,
	s => s.split(' ').join(''), // remove spaces inside (autocomplete)
	NORMALIZERS.to_lower_case,
	normalizeEmail,
	(s: string): string => {
		validate_structure(s)
		return s
	},
)
