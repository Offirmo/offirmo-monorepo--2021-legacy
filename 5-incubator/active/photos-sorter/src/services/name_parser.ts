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
import logger from './logger'


export type DatePattern = 'D-M-Y' | 'Y-M-D' | 'unknown'



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
	summary: 'no_match' | 'need_more' | 'ok' | 'perfect' | 'too_much' | 'error'
	reason: null | string
	timestamp_ms: undefined | TimestampUTCMs
	is_ambiguous: boolean
}
export function _parse_digit_blocks(digit_blocks: string, separator: 'none' | 'sep' | 'other'): DigitsParseResult {
	let blocks: string[] = digit_blocks
		.split('-')
		.filter(b => !!b)
	const digits = blocks.join('')

	logger.trace('>>> _parse_digit_blocks() starting…', {
		digit_blocks,
		separator,
		blocks,
		'blocks.length': blocks.length,
		digits,
	})

	const result: DigitsParseResult = {
		summary: 'error',
		reason: 'none',
		timestamp_ms: undefined,
		is_ambiguous: false,
	}

	if (digits.length < 8) {
		result.summary = 'need_more'
		result.reason = 'too few digits'
		return result
	}

	if ( separator === 'none') {
		// TODO improve
		result.summary = 'need_more'
		result.reason = 'not on sep'
		return result
	}

	if (blocks[0].length > 4 && blocks[0].length !== 8) {
		// TODO one day handle this
		result.summary = 'no_match'
		result.reason = '1st block mismatch - length'
		return result
	}

	let error = false

	// improve the splitting if needed
	let blocks_previous = blocks
	try {
		let date_block_count = 3
		blocks = blocks.flatMap((b: string, i: number): string | string[] =>  {
			//console.log({i, b})
			if (i === 0) {
				if (b.length > 4) {
					date_block_count = 1
					if (is_DDMMYYYY(b) && is_YYYYMMDD(b))
						result.is_ambiguous = true

					if (is_YYYYMMDD(b)) {
						return [
							b.slice(0,4),
							b.slice(4,6),
							b.slice(6,8),
						]
					}

					if (is_DDMMYYYY(b)) {
						return [
							b.slice(0,2),
							b.slice(2,4),
							b.slice(4,8),
						]
					}

					result.summary = 'no_match'
					result.reason = '1st block mismatch - content'
					throw new Error('!')
				}
			}
			else if (i >= date_block_count) {
				const acc: string[] = []
				let s = b
				while (s.length > 3) {
					acc.push(s.slice(0, 2))
					s = s.slice(2)
				}
				acc.push(s)
				return acc
			}

			return b
		})

		if (blocks.join('') !== digits) {
			logger.error('BAD IMPROV SPLIT', {
				blocks_before: blocks_previous,
				blocks_after: blocks,
				digits_before: digits,
				digits_after: blocks.join(''),
			})
			result.reason = 'internal error while improving the splitting'
			return result
		}
	}
	catch (e) {
		return result
	}

	logger.silly('after improved splitting:', {
		before: blocks_previous,
		after: blocks,
	})
	blocks_previous = blocks

	// improve padding
	blocks = blocks.map(b => (b.length < 2) ? b.padStart(2, '0') : b)
	logger.silly('after improved padding:', {
		before: blocks_previous,
		after: blocks,
	})

	let date_pattern: DatePattern = blocks[0].length === 4
		? 'Y-M-D'
		: blocks[2].length === 4
			? 'D-M-Y'
			: (() => {
				if (!is_month_fragment(blocks[1]))
					return 'unknown'

				if (  is_day_fragment(blocks[0])
					&& is_day_fragment(blocks[2])
					&& _get_y2k_year_from_fragment(blocks[0]) !== null
					&& _get_y2k_year_from_fragment(blocks[2]) !== null
				)
					result.is_ambiguous = true
				if (is_day_fragment(blocks[0]) && _get_y2k_year_from_fragment(blocks[2]) !== null)
					return 'D-M-Y'
				if (_get_y2k_year_from_fragment(blocks[0]) !== null && is_day_fragment(blocks[2]))
					return 'Y-M-D'

				return 'unknown'
			})()
	if (date_pattern === 'unknown') {
		result.summary = 'no_match'
		result.reason = 'unknown date pattern'
		return result
	}


	let date_creation_args: number[] = []

	switch (date_pattern) {
		case 'Y-M-D': {
			if (blocks.length >= 1 && (!is_year(blocks[0]) && !_get_y2k_year_from_fragment(blocks[0])))
				error = true
			if (blocks.length >= 2 && !is_month_fragment(blocks[1]))
				error = true
			if (blocks.length >= 3 && is_day_fragment(blocks[2]) === null)
				error = true

			if (error) {
				result.summary = 'no_match'
				result.reason = 'Y-M-D mismatch'
				return result
			}

			if (blocks.length < 3) {
				result.summary = 'need_more'
				result.reason = 'Y-M-D needs more blocks'
				return result
			}

			if (is_year(blocks[0]))
				date_creation_args.push(Number(blocks[0]))
			else
				date_creation_args.push(_get_y2k_year_from_fragment(blocks[2])!)
			date_creation_args.push(Number(blocks[1]) - 1)
			date_creation_args.push(Number(blocks[2]))
			break
		}

		case 'D-M-Y': {
			if (blocks.length >= 1 && !is_day_fragment(blocks[0]))
				error = true
			if (blocks.length >= 2 && !is_month_fragment(blocks[1]))
				error = true
			if (blocks.length >= 3 && (!is_year(blocks[2]) && !_get_y2k_year_from_fragment(blocks[2])))
				error = true

			if (error) {
				result.summary = 'no_match'
				result.reason = 'D-M-Y mismatch'
				return result
			}

			if (blocks.length < 3) {
				result.summary = 'need_more'
				result.reason = 'D-M-Y needs more blocks'
				return result
			}


			if (is_year(blocks[2]))
				date_creation_args.push(Number(blocks[2]))
			else
				date_creation_args.push(_get_y2k_year_from_fragment(blocks[2])!)
			date_creation_args.push(Number(blocks[1]) - 1)
			date_creation_args.push(Number(blocks[0]))
			break
		}
		default:
			throw new Error('Impossible!')
	}

	logger.silly('…still parsing digit blocks…', {
		blocks,
		date_pattern,
		date_creation_args
	})
	if (blocks.length > 3) {
		if (!is_hour_fragment(blocks[3])) {
			error = true
			result.reason = 'hour block'
		} else
			date_creation_args.push(Number(blocks[3]))
	}

	if (blocks.length > 4) {
		if (!is_minute_fragment(blocks[4])) {
			error = true
			result.reason = 'minute block'
		} else
			date_creation_args.push(Number(blocks[4]))
	}

	if (blocks.length > 5) {
		if (!is_second_fragment(blocks[5])) {
			error = true
			result.reason = 'second block'
		} else
			date_creation_args.push(Number(blocks[5]))
	}

	if (blocks.length > 6) {
		if (!is_millisecond_fragment(blocks[6])) {
			error = true
			result.reason = 'millis block'
		} else
			date_creation_args.push(Number(blocks[6]))
	}

	if (date_creation_args.findIndex(v => isNaN(v)) >= 0) {
		error = true
		result.reason = 'isNaN'
	}

	if (error) {
		result.summary = 'no_match'
		logger.error('Error parsing digit blocks…', {
			blocks,
			reason: result.reason,
			date_creation_args,
		})
		return result
	}

	if (blocks.length > 7) {
		result.summary = 'too_much'
		return result
	}

	if (blocks.length === 7) {
		result.summary = 'perfect'
		logger.silly('parse digit blocks done: ' + result.summary, {date_creation_args})
		result.timestamp_ms = Date.UTC(...(date_creation_args as [ number, number ]))
		return result
	}

	if (blocks.length === 3
		|| blocks.length === 5
		|| blocks.length === 6) {
		result.summary = 'ok'
		logger.silly('parse digit blocks done: ' + result.summary, {date_creation_args})
		result.timestamp_ms = Date.UTC(...(date_creation_args as [ number, number ]))
		return result
	}

	result.summary = 'need_more'
	result.reason = 'end'
	return result
}


export interface ParseResult {
	original_name: string

	extension_lc: string
	date_digits: undefined | string
	timestamp_ms: undefined | TimestampUTCMs
	is_date_ambiguous: undefined | boolean
	meaningful_part: string
}
export function parse(name: string, debug: boolean = false): ParseResult {
	logger.trace('\n\n\n\n----------------------------------------\n» parsing…', { name })
	const result: ParseResult = {
		original_name: name,
		extension_lc: '',
		date_digits: undefined,
		timestamp_ms: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '',
	}

	let state = {
		buffer: name,
		index: 0,
		prefix: '',
		suffix: '',
		digit_blocks: '', // store digits and separators in a normalized way for easier parsing later
		digits_pattern: '', // store separators "as is" to maybe match later against known patterns
		is_date_found: false,
		should_ignore_current_digits_block: false,
	}
	let state_on_digits_start: null | typeof state = null
	let state_on_last_successful_dpr: null | typeof state = null

	function on_date_found(dpr: DigitsParseResult) {
		state.is_date_found = true
		result.date_digits = state.digit_blocks.split('-').join('')
		//result.digit_blocks = state.digit_blocks
		//result.digits_pattern = state.digits_pattern
		result.timestamp_ms = dpr.timestamp_ms
		result.is_date_ambiguous = dpr.is_ambiguous

		logger.trace(`found date in filename`, {
			name,
			state,
			dpr,
			result,
		})
	}
	function on_successful_non_optimal_dpr(dpr: DigitsParseResult) {
		state_on_last_successful_dpr = {
			...state,
		}
	}

	logger.silly('initial state', { state })

	const name_lc = name.toLowerCase()
	const split_by_dot = name_lc.split('.')
	if (split_by_dot.length > 1) {
		result.extension_lc = '.' + split_by_dot.slice(-1)[0]
		debug && console.log({ extension_lc: result.extension_lc })
		state.buffer = name.slice(0, -result.extension_lc.length)
		debug && console.log({ buffer: state.buffer })
	}

	state.buffer = state.buffer.trim()
	logger.silly('after buffer cleanup', { buffer: state.buffer })

	let no_infinite_loop_counter = 255
	let should_exit = false
	do {
		const c = state.buffer[state.index]
		const is_separator = (() => {
			if (!SEPARATORS.includes(c)) {
				// requalify some special letters if inside digits
				if (state.digit_blocks && (c === 'h' || c === 'm' || c === 's') && DIGITS.includes(state.buffer[state.index + 1])) {
					return true
				}

				return false
			}

			if (state.digit_blocks) {
				// special multi-char separator in macOs screenshots
				if (state.buffer.slice(state.index, state.index + 4) === ' at ') {
					state.index += 3
					state.digits_pattern += ' at'
				}
				else if (state.buffer.slice(state.index, state.index + 3) === ' à ') {
					state.index += 2
					state.digits_pattern += ' à'
				}
			}

			return true
		})()
		const is_digit = !is_separator && DIGITS.includes(c)

		logger.silly(`${state.buffer}[${state.index}] = "${c}" = ${
			is_separator
				? 'separator'
				: is_digit
					? 'digit'
					: 'other'
		}`)

		if (state.is_date_found) {
			if (c)
				state.suffix += c
		}
		else if (state.digit_blocks) {
			if (is_separator) {
				state.digits_pattern += c
				if (state.digit_blocks.slice(-1) !== '-')
					state.digit_blocks += '-'

				// this may be the end of a correct date
				const dpr = _parse_digit_blocks(state.digit_blocks, 'other')
				if (dpr.summary === 'perfect') {
					on_date_found(dpr)
				}
				else if (dpr.summary === 'ok') {
					on_successful_non_optimal_dpr(dpr)
				}
				else if (dpr.summary === 'no_match') {
					if (state_on_last_successful_dpr) {
						state = state_on_last_successful_dpr
						on_date_found(_parse_digit_blocks(state.digit_blocks, 'other'))
					}
				}
			}
			else if (is_digit) {
				state.digit_blocks += c
				state.digits_pattern += 'x'
				// TODO handle ignore digits at the beginning (if useful)
			}
			else {
				// we just stopped getting digits.
				const dpr = _parse_digit_blocks(state.digit_blocks, 'other')
				logger.silly('is no longer digit:', {
					state,
					dpr,
				})

				if (dpr.summary === 'perfect' || dpr.summary === 'ok') {
					on_date_found(dpr)
				}
				else {
					if (state_on_last_successful_dpr) {
						state = state_on_last_successful_dpr
						on_date_found(_parse_digit_blocks(state.digit_blocks, 'other'))
					}
					else if (state_on_digits_start) {
						state = {
							...state_on_digits_start,
							should_ignore_current_digits_block: true,
						}
					}
					else {
						throw new Error('not possible??!!')
					}
				}
			}
		}
		else {
			if (is_digit && !state.should_ignore_current_digits_block) {
				// start of a digits sequence
				state_on_digits_start = {
					...state,
					index: Math.max(0, state.index-1)
				}
				state.digit_blocks += c
				state.digits_pattern += 'x'
			}
			else {
				if (c)
					state.prefix += c

				if (!is_digit) state.should_ignore_current_digits_block = false // we are not / no longer in a digit block
			}
		}

		state.index++
		if (state.index > state.buffer.length) // we intentionally allow a trailing 'undefined"
			should_exit = true
		no_infinite_loop_counter--
		if (no_infinite_loop_counter <= 0)
			should_exit = true

		logger.silly('end of loop', {
			state,
			should_exit,
		})
	} while (!should_exit)

	// left-trim the suffix
	while(state.suffix && SEPARATORS.includes(state.suffix[0])) {
		state.suffix = state.suffix.slice(1)
	}

	let meaningful_part = state.prefix + state.suffix

	// right-trim the meaningful (in case no suffix)
	while(meaningful_part && SEPARATORS.includes(meaningful_part.slice(-1))) {
		meaningful_part = meaningful_part.slice(0, meaningful_part.length - 1)
	}

	result.meaningful_part = meaningful_part
	result.timestamp_ms = result.timestamp_ms
	logger.silly('« final', {
		...result,
		human_ts: result.timestamp_ms ? get_human_readable_timestamp_auto(new Date(result.timestamp_ms), result.date_digits!) : null
	})
	return result
}
