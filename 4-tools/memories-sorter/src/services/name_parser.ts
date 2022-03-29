import path from 'path'
import assert from 'tiny-invariant'
import { NORMALIZERS } from '@offirmo-private/normalize-string'
import { Immutable } from '@offirmo-private/ts-types'
import micro_memoize from 'micro-memoize'

import { RELATIVE_PATH_NORMALIZATION_VERSION } from '../consts'
import { get_params } from '../params'
import {
	SEPARATORS,
	deep_trim,
	is_year,
	is_month_fragment,
	is_day_fragment,
	is_hour_fragment,
	is_minute_fragment,
	is_second_fragment,
	is_millisecond_fragment,
	is_DDMMYYYY,
	is_YYYYMMDD,
	NON_MEANINGFUL_ENDINGS_RE,
	NON_MEANINGFUL_FULL,
} from './matchers'
import {
	BetterDate,
	create_better_date,
	get_debug_representation,
} from './better-date'
import logger from './logger'
import { Basename, RelativePath } from '../types'

////////////////////////////////////

type DatePattern = 'D-M-Y' | 'Y-M-D' | 'unknown'

const PARAMS = get_params()
const DEBUG = false
const DIGITS = '0123456789'
const SCREENSHOT_ALIASES_LC = [
	'screenshot',
	'screen shot',
	'snapshot',
	'screen',
	NORMALIZERS.normalize_unicode('capture d\'écran'),
	NORMALIZERS.normalize_unicode('capture d’écran'),
	NORMALIZERS.normalize_unicode('capture plein écran'),
	'capture',
]

////////////////////////////////////

// PREMATURE, I didn't benchmark it
// however it's really used everywhere, repeatedly, on repeated data
export const pathㆍparse_memoized = micro_memoize(path.parse, {
	maxSize: Number.MAX_SAFE_INTEGER,
})

////////////////////////////////////

export const normalize_extension = micro_memoize(function get_normalized_extension(extension: string): string {
	if (extension === '') return '' // special case of no extension at all

	assert(extension[0] === '.', `get_normalized_extension('${extension}') param should starts with dot`)

	let normalized_extension = extension
	normalized_extension = NORMALIZERS.normalize_unicode(normalized_extension) // useful? never hurts…
	normalized_extension = normalized_extension.toLowerCase()
	normalized_extension = PARAMS.extensions_to_normalize‿lc[normalized_extension] || normalized_extension

	return normalized_extension
}, {
	maxSize: 100, // very unlikely we'll get that far
})

// return '.xyz' or '' if no extension
export function get_file_basename_extension(basename: Basename): string {
	const split_by_dot = basename.split('.')

	return split_by_dot.length <= 1
		? ''
		: ('.' + split_by_dot.slice(-1)[0])
}
export function get_file_basename_extension‿normalized(basename: Basename): string {
	return normalize_extension(get_file_basename_extension(basename))
}

export function _get_y2k_year_from_fragment(s: string, separator = 70): number | null {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return null

	const y = (n >= separator ? 1900 : 2000) + n

	if (y >= PARAMS.date_lower_boundⳇₓyear && y <= PARAMS.date_upper_boundⳇₓyear)
		return y

	return null
}

export function get_digit_pattern(s: string): string {
	return s.split('')
		.map(c => {
			if (DIGITS.includes(c)) {
				return 'x'
			}
			return c
		})
		.join('')
}

////////////////////////////////////

export interface DigitsParseResult {
	summary: 'no_match' | 'need_more' | 'ok' | 'perfect' | 'too_much' | 'error'
	reason: null | string
	date: undefined | BetterDate
	is_ambiguous: boolean
}

function _get_DigitsParseResult_debug_representation(dpresult: Immutable<DigitsParseResult>): Object {
	const { date, ...rest } = dpresult
	return {
		...rest,
		date: get_debug_representation(date),
	}
}

export function _parse_digit_blocks(digit_blocks: string, separator: 'none' | 'sep' | 'other'): Immutable<DigitsParseResult> {
	try {

		let blocks: string[] = digit_blocks
			.split('-')
			.filter(b => !!b)
		const digits = blocks.join('')

		DEBUG && logger.trace('>>> _parse_digit_blocks() starting…', {
			digit_blocks,
			separator,
			blocks,
			'blocks.length': blocks.length,
			digits,
		})

		const result: DigitsParseResult = {
			summary: 'error',
			reason: null,
			date: undefined,
			is_ambiguous: false,
		}

		if (digits.length < 8) {
			result.summary = 'need_more'
			result.reason = 'too few digits'
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
			return result
		}

		if (separator === 'none') {
			result.summary = 'need_more'
			result.reason = 'not on sep'
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
			return result
		}

		if (blocks[0].length > 4 && blocks[0].length !== 8) {
			result.summary = 'no_match'
			result.reason = '1st block mismatch - length'
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
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
				logger.error('PDB splitting improvement failure', {
					blocks_before: blocks_previous,
					blocks_after: blocks,
					digits_before: digits,
					digits_after: blocks.join(''),
				})
				result.reason = 'internal error while improving the splitting'
				logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
				return result
			}
		}
		catch (e) {
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
			return result
		}

		DEBUG && logger.silly('PDB after improved splitting:', {
			before: blocks_previous,
			after: blocks,
		})
		blocks_previous = blocks

		// improve padding
		blocks = blocks.map(b => (b.length < 2) ? b.padStart(2, '0') : b)
		DEBUG && logger.silly('PDB after improved padding:', {
			before: blocks_previous,
			after: blocks,
		})

		let date_pattern: DatePattern = blocks[0].length === 4
			? 'Y-M-D'
			: (blocks.length >= 3 && blocks[2].length === 4)
				? 'D-M-Y'
				: (() => {
					if (blocks.length < 3)
						return 'unknown'

					if (!is_month_fragment(blocks[1]))
						return 'unknown'

					if (  is_day_fragment(blocks[0])
						&& is_day_fragment(blocks[2])
						&& _get_y2k_year_from_fragment(blocks[0]) !== null
						&& _get_y2k_year_from_fragment(blocks[2]) !== null
					) {
						result.is_ambiguous = true
					}

					if (is_day_fragment(blocks[0]) && _get_y2k_year_from_fragment(blocks[2]) !== null)
						return 'D-M-Y'
					if (_get_y2k_year_from_fragment(blocks[0]) !== null && is_day_fragment(blocks[2]))
						return 'Y-M-D'

					return 'unknown'
				})()
		if (date_pattern === 'unknown') {
			result.summary = 'no_match'
			result.reason = 'unknown date pattern'
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
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
					logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
					return result
				}

				if (blocks.length < 3) {
					result.summary = 'need_more'
					result.reason = 'Y-M-D needs more blocks'
					logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
					return result
				}

				if (is_year(blocks[0]))
					date_creation_args.push(Number(blocks[0]))
				else
					date_creation_args.push(_get_y2k_year_from_fragment(blocks[2])!)
				date_creation_args.push(Number(blocks[1]))
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
					logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
					return result
				}

				if (blocks.length < 3) {
					result.summary = 'need_more'
					result.reason = 'D-M-Y needs more blocks'
					logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
					return result
				}


				if (is_year(blocks[2]))
					date_creation_args.push(Number(blocks[2]))
				else
					date_creation_args.push(_get_y2k_year_from_fragment(blocks[2])!)
				date_creation_args.push(Number(blocks[1]))
				date_creation_args.push(Number(blocks[0]))
				break
			}
			default:
				throw new Error('Impossible!')
		}

		DEBUG && logger.silly('PDB still parsing…', {
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
			DEBUG  && logger.silly('PDB no match parsing digit blocks…', {
				blocks,
				reason: result.reason,
				date_creation_args,
			})
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
			return result
		}

		if (blocks.length > 7) {
			result.summary = 'too_much'
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
			return result
		}

		if (date_creation_args.length === 1)
			date_creation_args.push(0) // or else date constructor will take the year as a timestamp

		if (blocks.length === 7) {
			result.summary = 'perfect'
			DEBUG  && logger.silly(`parse digit blocks done, ${result.summary} match:`, { 'blocks.length': blocks.length, date_creation_args})
			result.date = create_better_date('tz:auto', ...(date_creation_args as [ number, number ]))
			//console.log(result.date!.toISOString())
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
			return result
		}

		if (blocks.length === 3
			|| blocks.length === 5
			|| blocks.length === 6) {
			result.summary = 'ok'
			DEBUG  && logger.silly(`parse digit blocks done, ${result.summary} match:`, { 'blocks.length': blocks.length, date_creation_args})
			result.date = create_better_date('tz:auto', ...(date_creation_args as [ number, number ]))
			//console.log(result.date!.toISOString())
			logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
			return result
		}

		result.summary = 'need_more'
		result.reason = 'end'
		DEBUG && logger.trace(`<<< _parse_digit_blocks(): ${result.summary}`, _get_DigitsParseResult_debug_representation(result))
		return result
	}
	catch (err) {
		logger.error(`_parse_digit_blocks() crash when parsing…`, {
			digit_blocks, separator,
		})
		throw err
	}
}

export interface ParseResult {
	original_name: Basename

	extension_lc: string // TODO normalize?
	date_digits: undefined | string // in order of discovery, not in order of rank!
	digits_pattern: undefined | string // useful to recognise ourselves ;)
	date: undefined | BetterDate // warning, tz will be from "auto", remember to re-interpret if you know the proper tz
	is_date_ambiguous: undefined | boolean
	meaningful_part: string

	copy_index: undefined | number
}
function _get_ParseResult_debug_representation(presult: Immutable<ParseResult>): Object {
	const { date, ...rest } = presult
	return {
		...rest,
		date: get_debug_representation(date),
	}
}

const _parse_memoized = micro_memoize(function _parse(basename: Basename, type: 'file' | 'folder', parse_up_to: 'full' | 'copy_index' = 'full'): Immutable<ParseResult> {

	logger.trace('» parsing basename…', { name: basename, up_to: parse_up_to })

	assert(!basename.includes('/'), `_parse() unexpected path separator / in basename? "${basename}"`)
	assert(!basename.includes('\\'), `_parse() unexpected path separator \\ in basename? "${basename}"`)

	const result: ParseResult = {
		original_name: basename,
		extension_lc: '',
		date_digits: undefined,
		digits_pattern: undefined,
		date: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '',
		copy_index: undefined,
	}
	// small optim for readability in unit tests
	if (basename === '.') {
		logger.trace('« parse basename final result = trivial')
		return result
	}

	basename = NORMALIZERS.normalize_unicode(basename)
	DEBUG  && logger.silly(`parsing basename "${basename}"...\n\n\n\n----------------------------------------`)

	let state = {
		buffer: basename,
		index: 0,
		prefix: '',
		suffix: '',
		digit_blocks: '', // store digits and separators in a normalized way for easier parsing later
		digits_pattern: '', // store separators "as is" to maybe match later against known patterns
		is_date_found: false,
		should_ignore_current_digits_block: false,
	}
	type State = typeof state
	let state_on_digits_start: null | typeof state = null
	let state_on_last_successful_dpr: null | typeof state = null

	function on_date_found(dpr: DigitsParseResult) {
		state.is_date_found = true
		result.date_digits = state.digit_blocks.split('-').join('')
		//result.digit_blocks = state.digit_blocks
		state.digit_blocks = '' // done with the current block
		result.digits_pattern = deep_trim(state.digits_pattern) || undefined
		result.date = dpr.date
		result.is_date_ambiguous = dpr.is_ambiguous

		DEBUG  && logger.silly(`found date in basename`, {
			name: basename,
			state,
			dpr,
			result: _get_ParseResult_debug_representation(result),
		})
	}
	function on_successful_non_optimal_dpr(dpr: DigitsParseResult) {
		state_on_last_successful_dpr = {
			...state,
		}
	}

	DEBUG  && logger.silly('initial state', { state, result: _get_ParseResult_debug_representation(result) })

	if (type === 'file') {
		const name_lc = basename.toLowerCase()
		const split_by_dot = name_lc.split('.')
		if (split_by_dot.length > 1) {
			result.extension_lc = '.' + split_by_dot.slice(-1)[0]
			//debug && console.log({ extension_lc: result.extension_lc })
			state.buffer = basename.slice(0, -result.extension_lc.length)
			//debug && console.log({ buffer: state.buffer })
		}
	}

	state.buffer = state.buffer.trim()

	// remove non-meaningful parts
	if (state.buffer.toUpperCase().startsWith('PHOTO ON'))
		state.buffer = state.buffer.slice(0, 5) + state.buffer.slice(8)
	// ends with "copies" We do it first to avoid the digits being interpreted as a date
	// Note that we've seen files with multiple copy markers 🤦‍ so need to run several times
	// (if multiple copy markers, last one encountered will win)
	let non_meaningful_part_removed = false
	state.buffer = state.buffer.trim()
	do {
		non_meaningful_part_removed = false // so far

		state.buffer = Object.keys(NON_MEANINGFUL_ENDINGS_RE).reduce((acc, key) => {
			const m = acc.toLowerCase().match(NON_MEANINGFUL_ENDINGS_RE[key])
			//console.log(m)
			if (m && m[0]) {
				result.copy_index = Number(m.groups?.copy_index ?? 0)
				acc = acc.slice(0, m.index) + acc.slice(m.index! + m[0].length)
				acc = acc.trim()
				logger.trace('non meaningful part removed', { key, rgxp: NON_MEANINGFUL_ENDINGS_RE[key], m, cleaned: acc })
				non_meaningful_part_removed = true
			}
			return acc
		}, state.buffer)
	} while (non_meaningful_part_removed)

	DEBUG && logger.silly('after buffer cleanup', { state, result: _get_ParseResult_debug_representation(result) })

	if (parse_up_to === 'copy_index') {
		result.meaningful_part = state.buffer

		logger.trace('« parse basename final result =', _get_ParseResult_debug_representation(result))
		return result
	}

	let no_infinite_loop_counter = 255
	let should_exit = false
	do {
		function _is_separator(state: State): boolean {
			const c = state.buffer[state.index]
			if (!SEPARATORS.includes(c)) {
				// re-qualify some special letters if inside digits
				if (state.digit_blocks && (c === 'T' || c === 'h' || c === 'm' || c === 's') && DIGITS.includes(state.buffer[state.index + 1])) {
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
		}

		let c: string = '❌'
		let is_separator: boolean = false
		let is_digit: boolean = false

		function _derive(state: State): void {
			c = state.buffer[state.index]
			is_separator = _is_separator(state)
			is_digit = !is_separator && DIGITS.includes(c)
		}
		_derive(state)

		DEBUG  && logger.silly(`"${state.buffer}"[i=${state.index}] = "${c}" = ${
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
				if (state.digit_blocks.slice(-1) !== '-') {
					state.digit_blocks += '-'

					// this may be the end of a correct date
					//console.log('hdb-is', c)
					const dpr = _parse_digit_blocks(state.digit_blocks, 'other')
					if (dpr.summary === 'perfect') {
						on_date_found(dpr)
					} else if (dpr.summary === 'ok') {
						on_successful_non_optimal_dpr(dpr)
					} else if (dpr.summary === 'no_match') {
						if (state_on_last_successful_dpr) {
							logger.trace(`restoring last successful dpr… (1/hdb-is)`)
							state = state_on_last_successful_dpr
							_derive(state)
							on_date_found(_parse_digit_blocks(state.digit_blocks, 'other'))
							if (!is_separator) state.suffix += c
						}
					}
				}
			}
			else if (is_digit) {
				state.digit_blocks += c
				state.digits_pattern += 'x'
			}
			else {
				// we just stopped getting digits.
				//console.log('hdb-io', c)
				const dpr = _parse_digit_blocks(state.digit_blocks, 'other')
				DEBUG  && logger.silly('is no longer digit:', {
					state,
					dpr,
				})

				if (dpr.summary === 'perfect' || dpr.summary === 'ok') {
					on_date_found(dpr)
					if (c) state.suffix += c
				}
				else {
					if (state_on_last_successful_dpr) {
						logger.trace(`restoring last successful dpr… (1/hdb-io)`)
						state = state_on_last_successful_dpr
						_derive(state)
						on_date_found(_parse_digit_blocks(state.digit_blocks, 'other'))
						if (c && !is_separator) state.suffix += c
					}
					else if (state_on_digits_start) {
						state = {
							...state_on_digits_start,
							should_ignore_current_digits_block: true,
						}
						state.prefix += state.buffer[state.index]
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
				state_on_digits_start = { ...state }
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

		DEBUG  && logger.silly('end of loop', {
			state,
			should_exit,
		})
	} while (!should_exit)

	// left-trim the suffix
	while (state.suffix && SEPARATORS.includes(state.suffix[0])) {
		state.suffix = state.suffix.slice(1)
	}

	if (result.digits_pattern === 'xxxx-xx-xxTxx:xx:xx.xxx' && state.suffix.startsWith('Z')) {
		// https://en.wikipedia.org/wiki/ISO_8601
		// https://devdocs.io/javascript/global_objects/date/toisostring
		// trailing Z = UTC = not meaningful
		state.suffix = state.suffix.slice(1)
		// Note that we DON'T change the tz. Rationale:
		// the "UTC" tz is not meaningful.
		// The real TZ should have been automatically computed from user's global hints,
		// with the date elements taken as an UTC hint
		// That's exactly what happened and is already good ✔
	}

	let meaningful_part = deep_trim(state.prefix + state.suffix)
	DEBUG && logger.silly(`Starting meaningful part last normalization: "${meaningful_part}"…`)

	// normalize the meaningful part
	if (meaningful_part.startsWith('MM') && result.digits_pattern?.startsWith('xxxx-xx-xx')) {
		// it's our format, starting MM is not meaningful
		meaningful_part = meaningful_part.slice(2)
	}
	if (SCREENSHOT_ALIASES_LC.includes(meaningful_part.toLowerCase()))
		meaningful_part = 'screenshot'
	if (NON_MEANINGFUL_FULL.includes(meaningful_part.toUpperCase()))
		meaningful_part = ''

	// TODO review? Is it really needed? (removes IMG_ which may be considered useful?)
	// if leaving this loop, should remove lines above
	/*NON_MEANINGFUL_FULL.forEach(non_meaningful_str => {
		if (meaningful_part.toUpperCase().startsWith(non_meaningful_str.toUpperCase()))
			meaningful_part = deep_trim(meaningful_part.slice(non_meaningful_str.length))
	})*/

	result.meaningful_part = meaningful_part

	logger.trace('« parse basename final result =', _get_ParseResult_debug_representation(result))

	return result
}, {
	maxSize: 10, // no need for a big value
	onCacheHit() {
		//logger.trace(`parsing basename… [memoized hit]`)
	}
})
// TODO remove this un-needed wrapper
export function parse(name: string, { parse_up_to = 'full', type }: {
	parse_up_to?: 'full' | 'copy_index',
	type: 'file' | 'folder', // important to know whether to extract an extension or not
}): Immutable<ParseResult> {
	return _parse_memoized(name, type, parse_up_to)
}


export function parse_file_basename(basename: Basename): Immutable<ParseResult> {
	return parse(basename, { parse_up_to: 'full', type: 'file' })
}

export function get_file_basename_copy_index(basename: Basename): undefined | number {
	const result = parse(basename, { parse_up_to: 'copy_index', type: 'file' })
	return result.copy_index
}

export function get_file_basename_without_copy_index(basename: Basename): string {
	const result = parse(basename, { parse_up_to: 'copy_index', type: 'file' })
	return result.meaningful_part + result.extension_lc
}

export function parse_folder_basename(basename: Basename): Immutable<ParseResult> {
	return parse(basename, { parse_up_to: 'full', type: 'folder' })
}

////////////

export function get_media_basename_normalisation_version(basename: Basename): number | undefined {
	const splitted_by_dot = basename.split('.')
	if (splitted_by_dot.length <= 1)
		return undefined

	const ext = splitted_by_dot.slice(-1)[0]
	if (ext.length <= 2)
		return undefined

	const dp = get_digit_pattern(basename)
	//console.log('is_normalized_media_basename()', { basename, dp })

	// v1
	/*if (dp.startsWith('MMxxxx-xx-xx_xxhxxmxxsxxx'))
		return 1
	if (dp.startsWith('MMxxxx-xx-xx_xxhxxmxx'))
		return 1*/
	if (dp.startsWith('MMxxxx-xx-xx_xxhxx'))
		return 1

	// v0 never published but used on my files
	/*if (dp.startsWith('xxxxxxxx_xxhxx+xx.xxx'))
		return 0
	if (dp.startsWith('xxxxxxxx_xxhxx+xx'))
		return 0*/
	if (dp.startsWith('xxxxxxxx_xxhxx'))
		return 0

	return undefined
}

export function is_normalized_media_basename(basename: Basename): boolean {
	return get_media_basename_normalisation_version(basename) === RELATIVE_PATH_NORMALIZATION_VERSION
}

export function is_processed_media_basename(basename: Basename): boolean {
	return get_media_basename_normalisation_version(basename) !== undefined
}

////////////

export function get_folder_basename_normalisation_version(basename: Basename): number | undefined {
	assert(basename.split(path.sep).length === 1, `get_folder_basename_normalisation_version() should be given a basename`)

	const dp_basename = get_digit_pattern(basename)

	if (dp_basename.startsWith('xxxxxxxx - ')
		&& is_YYYYMMDD(basename.slice(0, 8)))
		return 1

	return undefined
}

export function get_folder_relpath_normalisation_version(relpath: RelativePath): number | undefined {
	const splitted = relpath.split(path.sep)

	const basename = splitted.slice(-1)[0]

	if (splitted.length === 2
		&& is_year(splitted[0])
		&& get_folder_basename_normalisation_version(basename) === 1)
		return 1

	return undefined
}

export function is_normalized_event_folder_relpath(relpath: RelativePath): boolean {
	return get_folder_relpath_normalisation_version(relpath) === RELATIVE_PATH_NORMALIZATION_VERSION
}

export function is_folder_basename__matching_a_processed_event_format(basename: Basename): boolean {
	return get_folder_basename_normalisation_version(basename) !== undefined
}
