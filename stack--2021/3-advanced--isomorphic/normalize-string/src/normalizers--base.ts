import { StringNormalizer } from './types'
import { combine_normalizers, default_to } from './normalize'

/////////////////////

export const RECOMMENDED_UNICODE_NORMALIZATION = 'NFC' // https://www.win.tue.nl/~aeb/linux/uc/nfc_vs_nfd.html

export const default_to_empty = default_to('')

export const ensure_string: StringNormalizer = s => String(s)

export const capitalize: StringNormalizer = s => s.length === 0
	? s
	: s[0].toUpperCase() + s.slice(1)

export const to_lower_case: StringNormalizer = s => s.toLowerCase()
export const to_upper_case: StringNormalizer = s => s.toUpperCase()

// https://devdocs.io/javascript/global_objects/string/trim
export const trim: StringNormalizer = s => s.trim()

// https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/
export const coerce_to_ascii: StringNormalizer = s => s
	.normalize('NFD') // D = Decompose = technique to remove non-ascii part
	.replace(/[\u0300-\u036f]/g, '')

// https://devdocs.io/javascript/global_objects/string/normalize
// https://withblue.ink/2019/03/11/why-you-need-to-normalize-unicode-strings.html
export const normalize_unicode: StringNormalizer = s => s.normalize(RECOMMENDED_UNICODE_NORMALIZATION)

// https://stackoverflow.com/a/1981366/587407
const ANY_BLANK_REGEXP = /\s+/g
export const coerce_blanks_to_single_spaces: StringNormalizer = s => s.replace(ANY_BLANK_REGEXP, ' ')

// https://stackoverflow.com/a/19313707/587407
const ANY_DELIMITER_REGEXP = new RegExp('[-+()*/:? _\.ⵧ]', 'g')
export const coerce_delimiters_to_space: StringNormalizer = s => s.replace(ANY_DELIMITER_REGEXP, ' ')

export const convert_spaces_to_camel_case: StringNormalizer = s => s.split(' ').map(capitalize).join('')

// for user names, player names...
export const coerce_to_safe_nickname = combine_normalizers(
	coerce_to_ascii,
	trim,
	to_lower_case,
	coerce_delimiters_to_space,
	coerce_blanks_to_single_spaces,
	convert_spaces_to_camel_case,
)

export const coerce_to_redeemable_code = combine_normalizers(
	trim,
	coerce_to_ascii,
	to_upper_case,
	coerce_delimiters_to_space,
	convert_spaces_to_camel_case,
)

/////////////////////
