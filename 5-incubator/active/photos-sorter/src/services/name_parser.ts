import { TimestampUTCMs } from '@offirmo-private/timestamps'

import { get_params } from '../params'
import {
	is_year,
	is_month_fragment,
	is_day_fragment,
	is_hour_fragment,
	is_minute_fragment,
	is_second_fragment,
	is_millisecond_fragment, is_DDMMYYYY, is_YYYYMMDD,
} from './matchers'
import {
	get_human_readable_timestamp_auto
} from './date_generator'


export type DatePattern = 'YYYYMMDD' | 'DDMMYYYY' | 'D-M-Y' | 'unknown'

export interface ParseResult {
	original_name: string

	extension_lc: string
	digits: undefined | null | string
	timestamp_ms: undefined | null | TimestampUTCMs
	is_date_ambiguous: undefined | boolean
	meaningful_part: string
}

export function _get_y2k_year_from_fragment(s: string, separator = 70): number | null {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return null

	const y = (n >= separator ? 1900 : 2000) + n

	if (y >= PARAMS.YYYY_lower_bound && y <= PARAMS.YYYY_upper_bound)
		return y

	return null
}

const DIGITS = '0123456789'
const SEPARATORS = '-_+.:; \t'
const PARAMS = get_params()

export interface DigitsParseResult {
	summary: 'no_match' | 'need_more' | 'ok' | 'perfect' | 'too_much'
	timestamp_ms: undefined | null | TimestampUTCMs
	is_ambiguous: boolean
}
export function _parse_digit_blocks(digit_blocks: string): DigitsParseResult {
	const blocks: string[] = digit_blocks.split('-')
	const first_block: string = blocks[0]
	const last_block: string = blocks.slice(-1)[0]

	const result: DigitsParseResult = {
		summary: 'no_match',
		timestamp_ms: undefined,
		is_ambiguous: false,
	}

	if ((blocks.length === 1 && first_block.length < 8)
		|| (first_block.length <=2 && blocks.length < 3)) {
		result.summary = 'need_more'
		return result
	}

	let date_pattern: DatePattern = first_block.length < 8
		? 'D-M-Y'
		: is_YYYYMMDD(first_block)
			? 'YYYYMMDD'
			: is_DDMMYYYY(first_block)
				? 'DDMMYYYY'
				: 'unknown'
	if (date_pattern === 'unknown') {
		result.timestamp_ms = null
		return result
	}

	if (is_DDMMYYYY(first_block) && is_YYYYMMDD(first_block))
		result.is_ambiguous = true

	let date_creation_args: number[] = []

	let error = false
	switch (date_pattern) {
		case 'D-M-Y': {
			if (blocks.length >= 1 && !is_day_fragment(blocks[0]))
				error = true
			if (blocks.length >= 2 && !is_month_fragment(blocks[1]))
				error = true
			if (blocks.length >= 3 && _get_y2k_year_from_fragment(blocks[2]) === null)
				error = true

			if (error) {
				result.timestamp_ms = null
				return result
			}

			if (blocks.length < 3) {
				result.summary = 'need_more'
				return result
			}

			date_creation_args.push(_get_y2k_year_from_fragment(blocks[2])!)
			date_creation_args.push(Number(blocks[1]) - 1)
			date_creation_args.push(Number(blocks[0]))
			break
		}
		case "YYYYMMDD": {
			date_creation_args.push(Number(first_block.slice(0, 4)))
			date_creation_args.push(Number(first_block.slice(4, 6)) - 1)
			date_creation_args.push(Number(first_block.slice(6, 8)))
			break
		}
		case "DDMMYYYY": {
			date_creation_args.push(Number(first_block.slice(4, 8)))
			date_creation_args.push(Number(first_block.slice(2, 4)) - 1)
			date_creation_args.push(Number(first_block.slice(0, 2)))
			break
		}
		default:
			throw new Error('Impossible!')
	}

	const date_block_count = date_pattern === 'D-M-Y' ? 3 : 1

	console.log('parsing digit blocks…', {
		blocks,
		first_block,
		last_block,
		date_pattern,
		date_block_count,
		date_creation_args
	})
	if (blocks.length >= date_block_count + 1 && !is_hour_fragment(blocks[date_block_count]))
		error = true
	else
		date_creation_args.push(Number(blocks[date_block_count]))

	if (blocks.length >= date_block_count + 2 && !is_minute_fragment(blocks[date_block_count + 1]))
		error = true
	else
		date_creation_args.push(Number(blocks[date_block_count + 1]))

	if (blocks.length >= date_block_count + 3 && !is_second_fragment(blocks[date_block_count + 2]))
		error = true
	else
		date_creation_args.push(Number(blocks[date_block_count + 2]))

	if (blocks.length >= date_block_count + 4 && !is_millisecond_fragment(blocks[date_block_count + 3]))
		error = true
	else
		date_creation_args.push(Number(blocks[date_block_count + 3]))

	if (error) {
		result.timestamp_ms = null
		return result
	}

	if (blocks.length > date_block_count + 4) {
		result.summary = 'too_much'
		return result
	}

	if (blocks.length === date_block_count + 4) {
		result.summary = 'perfect'
		console.log(result.summary, {date_creation_args})
		result.timestamp_ms = Date.UTC(...(date_creation_args as [ number, number ]))
		return result
	}

	if (blocks.length === date_block_count
		 || blocks.length === date_block_count + 3) {
		result.summary = 'ok'
		console.log(result.summary, {date_creation_args})
		result.timestamp_ms = Date.UTC(...(date_creation_args as [ number, number ]))
		return result
	}

	result.summary = 'need_more'
	return result
}


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

	let buffer = name
	let index = 0
	let prefix = ''
	let suffix = ''
	let digits_start_index = -1
	let digit_separators = ''
	let digit_blocks = ''
	let digits = ''
	let is_date_found = false

	debug && console.log({ buffer })

	const name_lc = name.toLowerCase()
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

		debug && console.log(`${buffer}[${index}] = "${c}" = ${
			is_separator
				? 'separator'
				: is_digit
					? 'digit'
					: 'other'
		}`)

		if (is_date_found) {
			if (c)
				suffix += c
		}
		else if (digits) {
			if (is_separator) {
				// ignore but store to use later as a confirmation
				digit_separators += c
				if (digit_blocks.slice(-1) !== '-')
					digit_blocks += '-'
			}
			else if (is_digit) {
				digits += c
				digit_blocks += c
				digit_separators += 'x'

				const dpr = _parse_digit_blocks(digit_blocks)
				let are_existing_digits_correct_so_far = dpr.summary !== 'no_match'
				console.log('is digit', {
					digits,
					digit_blocks,
					dpr,
					are_existing_digits_correct_so_far,
				})
				if (!are_existing_digits_correct_so_far) {
					// that's not a date
					// OR we got extra digits (TODO)
					if (digits.length > 17) {
						console.error('TODO handle extra digits?!')
					}
					prefix += buffer.slice(digits_start_index, index + 1)
					digits = ''
					digit_separators = ''
					digit_blocks = ''
					digits_start_index = -1
				}
			}
			else {
				// we just stopped getting digits.
				const dpr = _parse_digit_blocks(digit_blocks)
				let are_existing_digits_correct = dpr.summary === 'ok' || dpr.summary === 'perfect'
				console.log('is no longer digit:', {
					digits,
					digit_blocks,
					dpr,
					are_existing_digits_correct,
				})

				if (!are_existing_digits_correct) {
					prefix += buffer.slice(digits_start_index, index + 1)
					digits_start_index = -1
					digits = ''
					digit_separators = ''
					digit_blocks = ''
				}
				else {
					// TODO make a loop here to re-test at each "cleanup"

					// if the last char seen was a separator, put it back
					const previous_char = buffer.slice(index - 1, index)
					if (SEPARATORS.includes(previous_char)) {
						suffix = previous_char
						digit_separators = digit_separators.slice(0, digit_separators.length - 1)
						digit_blocks = digit_blocks.slice(0, digit_blocks.length - 1)
					}

					const dpr = _parse_digit_blocks(digit_blocks)
					switch (dpr.summary) {
						case "too_much":
							console.error('TODO hadle too many blocks?!')
							break

						case "ok":
						case "perfect":
							is_date_found = true
							result.digits = digits
							result.timestamp_ms = dpr.timestamp_ms
							result.is_date_ambiguous = dpr.is_ambiguous

							// handle the non-digit which caused this
							if (c)
								suffix += c

							debug && console.log('FOUND DATE = ', {
								prefix,
								digits,
								digit_separators,
								digit_blocks,
								timestamp_ms: dpr.timestamp_ms,
								is_date_ambiguous: result.is_date_ambiguous,
								suffix,
							})
							break

						case "need_more":
						case "no_match":
						default:
							throw new Error('Should never happen?!')
					}
				}
			}
		}
		else {
			if (is_digit) {
				/// XXX useful?
				const are_we_in_a_non_matching_digit_sequence = prefix && DIGITS.includes(prefix.slice(-1))
				debug && console.log({ are_we_in_a_non_matching_digit_sequence })
				if (are_we_in_a_non_matching_digit_sequence) {
					prefix += c
				}
				else {
					// start of a digits sequence
					digits_start_index = index
					digits += c
					digit_blocks += c
					digit_separators += 'x'
				}
			}
			else {
				if (c)
					prefix += c
			}
		}

		index++
		if (index > buffer.length) // we intentionally allow a trailing 'undefined"
			should_exit = true
		no_infinite_loop_counter--
		if (no_infinite_loop_counter <= 0)
			should_exit = true

		debug && console.log({
			index,
			prefix,
			digits,
			...(digits && { digits_start_index, digit_blocks, digit_separators }),
			suffix,
			should_exit
		})
	} while (!should_exit)

	// left-trim the suffix
	while(suffix && SEPARATORS.includes(suffix[0])) {
		suffix = suffix.slice(1)
	}

	let meaningful_part = prefix + suffix

	// right-trim the meaningful (in case no suffix)
	while(meaningful_part && SEPARATORS.includes(meaningful_part.slice(-1))) {
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
