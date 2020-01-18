import { TimestampUTCMs } from '@offirmo-private/timestamps'

import { get_params } from '../params'
import {
	is_year,
	is_month_fragment,
	is_day_fragment,
	is_hour_fragment,
	is_minute_fragment,
	is_second_fragment,
	is_millisecond_fragment,
} from './matchers'
import {
	get_human_readable_timestamp_auto
} from './date_generator'


export interface ParseResult {
	original_name: string

	extension_lc: string
	digits: undefined | null | string
	timestamp_ms: undefined | null | TimestampUTCMs
	is_date_ambiguous: undefined | boolean
	meaningful_part: string
}

const DIGITS = '0123456789'
const SEPARATORS = '-_+.:; \t'
const PARAMS = get_params()

export function parse(name: string, debug: boolean = false): ParseResult {
	debug && console.log('» parsing…', { name })
	const result: ParseResult = {
		original_name: name,
		extension_lc: '',
		digits: '',
		timestamp_ms: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '',
	}

	const name_lc = name.toLowerCase()
	let index = 0
	let digits_start_index = -1
	let prefix = ''
	let suffix = ''
	let digit_separators = ''
	let digits = ''
	let is_date_found = false

	let buffer = name
	debug && console.log({ buffer })

	const split_by_dot = name_lc.split('.')
	if (split_by_dot.length > 1) {
		result.extension_lc = '.' + split_by_dot.slice(-1)[0]
		debug && console.log({ extension_lc: result.extension_lc })
		buffer = name.slice(0, -result.extension_lc.length)
		debug && console.log({ buffer })
	}

	buffer = buffer.trim()
	debug && console.log({ buffer })

	let no_infinite_loop_counter = 255
	let should_exit = false
	do {
		const c = buffer[index]
		const is_separator = (() => {
			if (!SEPARATORS.includes(c)) {
				// requalify some special letters if inside digits
				if (digits && (c === 'h' || c === 'm' || c === 's') && DIGITS.includes(buffer[index + 1])) {
					return true
				}

				return false
			}

			if (digits) {
				// special multi-char separator in macOs screenshots
				if (buffer.slice(index, index + 4) === ' at ') {
					index += 3
					digit_separators += ' at'
				}
				else if (buffer.slice(index, index + 3) === ' à ') {
					index += 2
					digit_separators += ' à'
				}
			}

			return true
		})()
		const is_digit = !is_separator && DIGITS.includes(c)
		const is_other = !is_separator && !is_digit

		debug && console.log(`"${c}" = ${
			is_separator
				? 'separator'
				: is_digit
					? 'digit'
					: 'other'
		}`)

		if (digits) {
			if (is_separator) {
				// ignore but store to use later as a confirmation
				digit_separators += c
			}
			else if (is_digit) {
				digits += c
				digit_separators +=
					digits.length <= 4
						? 'Y'
						: digits.length <= 6
						? 'M'
						: digits.length <= 8
							? 'D'
							: digits.length <= 10
								? 'h'
								: digits.length <= 12
									? 'm'
									: 's'
			}
			else if (is_other) {
				if (digits.length < 8) {
					// not enough to be a date
					prefix += digits
					digits = ''
				}
				else {
					result.digits = digits
					digits = digits.padEnd(17, '0')
					const timestamp_ms = Date.UTC(
						Number(digits.slice( 0,  4)),
						Number(digits.slice( 4,  6)),
						Number(digits.slice( 6,  8)),
						Number(digits.slice( 8, 10)),
						Number(digits.slice(10, 12)),
						Number(digits.slice(12, 14)),
						Number(digits.slice(14, 17)),
					)
					result.timestamp_ms = timestamp_ms
					result.is_date_ambiguous = false

					debug && console.log('FOUND DATE = ', {
						digit_separators,
						result,
					})
				}
			}
		}
		else {
			if (is_date_found) {
				suffix += c
			}
			else {
				if (is_digit) {
					const are_we_in_a_non_matching_digit_sequence = DIGITS.includes(prefix.slice(-1))
					if (are_we_in_a_non_matching_digit_sequence) {
						prefix += c
					}
					else {
						if (digits.length === 0) {
							digits_start_index = 0
							digit_separators = ''
						}
						digits += c
						digit_separators += 'Y' // obviously

						const are_digits_correct_so_far =
							   (digits.length === 4 && is_year(digits))
							|| (digits.length === 6 && is_month_fragment(digits.slice(-2)))
							|| (digits.length === 8 && is_day_fragment(digits.slice(-2)))
							|| (digits.length === 10 && is_hour_fragment(digits.slice(-2)))
							|| (digits.length === 12 && is_minute_fragment(digits.slice(-2)))
							|| (digits.length === 14 && is_second_fragment(digits.slice(-2)))
							|| (digits.length === 17 && is_millisecond_fragment(digits.slice(-3)))
							|| (digits.length % 2) === 1

						if (!are_digits_correct_so_far) {
							// that's not a date
							prefix += buffer.slice(digits_start_index, index + 1)
							digits = ''
						}
					}
				}
				else {
					prefix += c
				}
			}
		}

		index++
		if (index > buffer.length) // we intentionally allow a trailing 'undefined"
			should_exit = true
		no_infinite_loop_counter--
		if (no_infinite_loop_counter <= 0)
			should_exit = true

		debug && console.log({ index, prefix, digits, digits_start_index, digit_separators, suffix, should_exit})
	} while (!should_exit)

	// left-trim the suffix
	while(suffix && SEPARATORS.includes(suffix[0])) {
		suffix = suffix.slice(1)
	}

	let meaningful_part = prefix + suffix

	// right-trim the meaningful (in case no suffix)
	while(meaningful_part && SEPARATORS.includes(meaningful_part.slice(-1)[0])) {
		meaningful_part = meaningful_part.slice(0, meaningful_part.length - 1)
	}

	result.meaningful_part = meaningful_part
	result.timestamp_ms = result.timestamp_ms || null
	debug && console.log('« final', {
		...result,
		human_ts: result.timestamp_ms ? get_human_readable_timestamp_auto(new Date(result.timestamp_ms), result.digits!) : null
	})
	return result
}
