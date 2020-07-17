import { StringNormalizer } from './types'

import {
	default_to_empty,
	ensure_string,
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
} from './normalizers--base'

import {
	normalize_email_safe,
	normalize_email_reasonable,
	normalize_email_full,
} from './normalizer--email'

/////////////////////

export const NORMALIZERS: Readonly<{ [key: string]: StringNormalizer }> = {
	default_to_empty,
	ensure_string,
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
	normalize_email_safe,
	normalize_email_reasonable,
	normalize_email_full,
}

/////////////////////
