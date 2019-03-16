import { StringNormalizer } from './types'
import { combine_normalizers } from './normalize'

/////////////////////

const capitalize: StringNormalizer = s => s.length === 0
	? s
	: s[0].toUpperCase() + s.slice(1)

const to_lower_case: StringNormalizer = s => s.toLowerCase()
const to_upper_case: StringNormalizer = s => s.toUpperCase()

// https://devdocs.io/javascript/global_objects/string/trim
const trim: StringNormalizer = s => s.trim()

// https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/
const coerce_to_ascii: StringNormalizer = s => s
	.normalize('NFD')
	.replace(/[\u0300-\u036f]/g, '')

// https://devdocs.io/javascript/global_objects/string/normalize
// https://withblue.ink/2019/03/11/why-you-need-to-normalize-unicode-strings.html
const normalize_unicode: StringNormalizer = s => s.normalize()

// https://stackoverflow.com/a/1981366/587407
const ANY_BLANK_REGEXP = /\s+/g
const coerce_blanks_to_single_spaces: StringNormalizer = s => s.replace(ANY_BLANK_REGEXP, ' ')

// https://stackoverflow.com/a/19313707/587407
const ANY_DELIMITER_REGEXP = new RegExp('[-+()*/:? _]', 'g')
const coerce_delimiters_to_space: StringNormalizer = s => s.replace(ANY_DELIMITER_REGEXP, ' ')

const convert_spaces_to_camel_case: StringNormalizer = s => s.split(' ').map(capitalize).join('')

// for user names, player names...
const coerce_to_safe_nickname = combine_normalizers(
	trim,
	coerce_to_ascii,
	to_lower_case,
	coerce_delimiters_to_space,
	coerce_blanks_to_single_spaces,
	convert_spaces_to_camel_case,
)

const coerce_to_redeemable_code = combine_normalizers(
	trim,
	coerce_to_ascii,
	to_upper_case,
	coerce_delimiters_to_space,
	convert_spaces_to_camel_case,
)

/////////////////////

const NORMALIZERS: Readonly<{ [key: string]: StringNormalizer }> = {
	capitalize,
	to_lower_case,
	to_upper_case,
	trim,
	coerce_to_ascii,
	normalize_unicode,
	coerce_blanks_to_single_spaces,
	coerce_delimiters_to_space,
	convert_spaces_to_camel_case,
	coerce_to_safe_nickname,
	coerce_to_redeemable_code,
}

/////////////////////

export {
	NORMALIZERS,
}
