////////////////////////////////////

import { get_params } from '../params'

const PARAMS = get_params()

///////////////////// NO Regexp :) /////////////////////

export const SEPARATORS = '-_+.:; \t'

export function is_digit(char: string): boolean {
	return !!char && char === String(parseInt(char[0]))
}

export function deep_trim(s: string): string {
	while (s && SEPARATORS.includes(s.slice(-1))) {
		s = s.slice(0, s.length - 1)
	}
	while (s && SEPARATORS.includes(s[0])) {
		s = s.slice(1)
	}
	return s
}

export function is_year(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(4, '0') !== s) return false

	return n >= PARAMS.date_lower_boundⳇₓyear && n <= PARAMS.date_upper_boundⳇₓyear
}

export function is_month_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 1 && n <= 12
}

export function is_day_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 1 && n <= 31
}

export function is_compact_date(s: string): boolean {
	if (s.length !== 8) return false

	if (!is_year(s.slice(0, 4))) return false
	if (!is_month_fragment(s.slice(4, 6))) return false
	if (!is_day_fragment(s.slice(6, 8))) return false

	return true
}

export function is_hour_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 0 && n < 24
}

export function is_minute_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 0 && n < 60
}

export const is_second_fragment = is_minute_fragment

export function is_millisecond_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(3, '0') !== s) return false

	return true
}

export function is_YYYYMMDD(s: string): boolean {
	return s.length === 8
		&& is_year(s.slice(0, 4))
		&& is_month_fragment(s.slice(4, 6))
		&& is_day_fragment(s.slice(6, 8))
}

export function is_DDMMYYYY(s: string): boolean {
	return s.length === 8
		&& is_day_fragment(s.slice(0, 2))
		&& is_month_fragment(s.slice(2, 4))
		&& is_year(s.slice(4, 8))
}

// TODO clarify case
export const NON_MEANINGFUL_FULL: string[] = [
	// greedier first
	'PHOTO',
	'FILE',
	'PICT',
	'IMG',
	'VID',

	'MM', // from us
]

///////////////////// WITH Regexp :( /////////////////////

export const NON_MEANINGFUL_ENDINGS_RE: { [k:string]: RegExp } = {
	// greedier first
	// https://javascript.info/regexp-groups#named-groups

	trailing_copy_en: /( -)? copy( (?<copy_index>\d+))?$/,
	leading_copy_en: /^copy (\((?<copy_index>\d+)\) )?(of )?/,

	trailing_copy_fr: /( -)? copie( (?<copy_index>\d+))?$/,
	leading_copy_fr: /^copie (\((?<copy_index>\d+)\) )?(de )?(secours de )?/,

	trailing_copy_counter_parenthesis:  /(\((?<copy_index>\d+)\))?$/, // between ()
	trailing_copy_counter_catalina:     /( (?<copy_index>\d{1,2}))?$/, // no (), just space + trailing number
	trailing_copy_counter_brackets:     /(\[(?<copy_index>\d+)\])?$/, // between []
}

////////////////////////////////////
