/* Abstraction over a Date API more powerful than JS Date
 * Candidates:
 * - moment-tz
 * - Luxon
 * - Spacetime
 * - TC39 Temporal https://tc39.es/proposal-temporal/docs/cookbook.html
 */

const { deepStrictEqual: assert_deepStrictEqual } = require('assert').strict

import assert from 'tiny-invariant'
import { ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { get_json_difference } from '@offirmo-private/state-utils'

///////
// Note: we defaulted on Luxon bc
// 1. it's very good and suitable
// 2. ExifDateTime also uses it internally = easy to convert from
import { DateTime as LuxonDateTime, IANAZone } from 'luxon'
///////

import { SimpleYYYYMMDD, TimeZone } from '../types'
import { get_default_timezone } from '../params'
import logger from './logger'

////////////////////////////////////

// Note: Where Date is called as a constructor with more than one argument,
// the specified arguments represent local time.
// If UTC is desired, use new Date(Date.UTC(...)) with the same arguments.
export type LegacyDate = Date
export const LegacyDate = Date

export type PhotoSorterTimestampDays = string
export type PhotoSorterTimestampMinutes = string
export type PhotoSorterTimestampSeconds = string
export type PhotoSorterTimestampMillis = string
export type PhotoSorterTimestampAuto = string

export interface BetterDate {
	_debug: any

	_lx: LuxonDateTime // hidden underlying implementation, abstracted to allow replacement
}

////////////////////////////////////
// Selectors

export function get_timestamp_utc_ms_from(date: Immutable<BetterDate>): TimestampUTCMs {
	return date._lx.toMillis()
}

// luxon formatting
const DATE_FORMAT_YEARS = 'yyyy'
const DATE_FORMAT_MONTHS = 'LL'
const DATE_FORMAT_DAYS = 'dd'
const DATE_FORMAT_TO_DAYS_COMPACT = [ DATE_FORMAT_YEARS, DATE_FORMAT_MONTHS, DATE_FORMAT_DAYS].join('')
const DATE_FORMAT_TO_DAYS_NATURAL = [ DATE_FORMAT_YEARS, DATE_FORMAT_MONTHS, DATE_FORMAT_DAYS].join('-')
const DATE_FORMAT_TO_MINUTES_NATURAL = DATE_FORMAT_TO_DAYS_NATURAL + `_HH'h'mm`
const DATE_FORMAT_TO_SECONDS_NATURAL = DATE_FORMAT_TO_MINUTES_NATURAL + `'m'ss`
const DATE_FORMAT_TO_MILLIS_NATURAL = DATE_FORMAT_TO_SECONDS_NATURAL + `'s'SSS`
const DATE_FORMAT_TO_MILLIS_DIGITS = DATE_FORMAT_TO_DAYS_COMPACT + `HHmmssSSS`

export function get_compact_date(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): SimpleYYYYMMDD {
	return Number(date._lx.toFormat(DATE_FORMAT_TO_DAYS_COMPACT))
}

// ex. 2018-11-21
export function get_human_readable_timestamp_days(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampDays {
	return date._lx.toFormat(DATE_FORMAT_TO_DAYS_NATURAL)
}

// ex. 2018-11-21_06h00
export function get_human_readable_timestamp_minutes(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampMinutes {
	return date._lx.toFormat(DATE_FORMAT_TO_MINUTES_NATURAL)
}

// ex. 2018-11-21_04h23m15
export function get_human_readable_timestamp_seconds(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampSeconds {
	return date._lx.toFormat(DATE_FORMAT_TO_SECONDS_NATURAL)
}

// ex. 2018-11-21_06h00m45s632
export function get_human_readable_timestamp_millis(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampMillis {
	return date._lx.toFormat(DATE_FORMAT_TO_MILLIS_NATURAL)
}

// same as the above without trailing 0s
export function get_human_readable_timestamp_auto(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampAuto {
	//console.log(date)
	assert(date && date._lx, 'get_human_readable_timestamp_auto() bad date')
	//const date = new Date(timestamp)

	const digits = date._lx.toFormat(DATE_FORMAT_TO_MILLIS_DIGITS) // tz is irrelevant for this counting
	//logger.log('get_human_readable_timestamp_auto()', { digits, date })
	assert(digits.length === 17, 'get_human_readable_timestamp_auto() digits length')

	if (digits.endsWith('000000000'))
		return get_human_readable_timestamp_days(date, tz)

	if (digits.endsWith('00000'))
		return get_human_readable_timestamp_minutes(date, tz)

	if (digits.endsWith('000'))
		return get_human_readable_timestamp_seconds(date, tz)

	return get_human_readable_timestamp_millis(date, tz)
}

export function get_embedded_timezone(date: Immutable<BetterDate>): TimeZone {
	return date._lx.zone.name
}

// sunday = 0
export function get_day_of_week_index(date: Immutable<BetterDate>): number {
	return date._lx.weekday % 7
}

// used in unit tests only
export function _get_exif_datetime(date: Immutable<BetterDate>): ExifDateTime {
	return new ExifDateTime(
		date._lx.year,
		date._lx.month,
		date._lx.day,
		date._lx.hour,
		date._lx.minute,
		date._lx.second,
		date._lx.millisecond,
	)
}

/////////// Comparisons / operators

export function compare_utc(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): number {
	const tms_a = get_timestamp_utc_ms_from(date_a)
	const tms_b = get_timestamp_utc_ms_from(date_b)

	return tms_a - tms_b
}

export function is_equal_moment(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): boolean {
	return compare_utc(date_a, date_b) === 0
}

// undefined handled for convenience
export function is_deep_equal(date_a: Immutable<BetterDate> | undefined, date_b: Immutable<BetterDate> | undefined): boolean {
	const is_a_undefined = date_a === undefined
	const is_b_undefined = date_b === undefined

	if (is_a_undefined && is_b_undefined)
		return true

	if (is_a_undefined !== is_b_undefined)
		return false

	if (!is_equal_moment(date_a!, date_b!))
		return false

	return get_embedded_timezone(date_a!) === get_embedded_timezone(date_b!)
}

export function min(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): Immutable<BetterDate> {
	const cmp = compare_utc(date_a, date_b)

	return cmp <= 0 ? date_a : date_b
}

export function max(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): Immutable<BetterDate> {
	const cmp = compare_utc(date_a, date_b)

	return cmp <= 0 ? date_b : date_a
}

////////////////////////////////////

// needed to create from file times
export function create_better_date_from_utc_tms(tms: TimestampUTCMs, tz: 'tz:auto'): BetterDate {
	assert(!!tms, 'create_better_date_from_utc_tms correct input: ' + tms)
	assert(Number.isSafeInteger(tms), `create_better_date_from_utc_tms correct input: isSafeInteger(${tms})`)

	const _tz = get_default_timezone(tms)

	const _ld = new LegacyDate(tms)

	const zone = new IANAZone(_tz)
	const _lx = LuxonDateTime.fromJSDate(_ld, { zone })
	if (_lx.invalidReason || _lx.invalidExplanation) {
		logger.error('', {
			tms,
			_ld,
			zone,
			_lx,
		})
	}
	assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_from_utc_tms() invalid LuxonDateTime: ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)

	// const _m = moment(_ld)
	return {
		_lx,
		_debug: {
			'create_better_date_from_utc_tms': {
				tms,
			}
		}
	}
}

// better tz because the ExifDateTime created from exiftool
// may have the tz as a numeric shift
// while an explicit locale may be in the other TZ field, cf. unit test
// if better_tz supplied, expecting a similar shift
export function create_better_date_from_ExifDateTime(exif_date: ExifDateTime, better_tz?: TimeZone): BetterDate {
	let _lx: LuxonDateTime = exif_date.toDateTime()

	if (!exif_date.hasZone) {
		assert(!better_tz, 'create_better_date_from_ExifDateTime() tz suggested with no tz embedded = ???')
		let tz: TimeZone = get_default_timezone(_lx.toMillis())
		_lx = LuxonDateTime.fromObject({
			year: exif_date.year,
			month: exif_date.month,
			day: exif_date.day,
			hour: exif_date.hour,
			minute: exif_date.minute,
			second: exif_date.second,
			millisecond: exif_date.millis,
			zone: tz,
		})
	}
	else {
		if (better_tz) {
			// TODO assert same tz shift
			_lx = LuxonDateTime.fromObject({
				year: exif_date.year,
				month: exif_date.month,
				day: exif_date.day,
				hour: exif_date.hour,
				minute: exif_date.minute,
				second: exif_date.second,
				millisecond: exif_date.millis,
				zone: better_tz,
			})
		}
	}

	assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_from_ExifDateTime(): ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)

	return {
		_lx,
		_debug: {
			'create_better_date_from_ExifDateTime': {
				//exif_date,
			}
		}
	}
}

export function create_better_date_from_symd(simple_date: SimpleYYYYMMDD, tz: 'tz:auto'): BetterDate {
	let day = simple_date % 100
	let month = Math.trunc(simple_date / 100) % 100
	let year = Math.trunc(simple_date / 10000)

	const date = create_better_date_obj({
		year,
		month,
		day,
		tz,
	})
	date._debug = {
		'create_better_date_from_simple': {
			simple_date,
			year,
			month,
			day,
			tz,
		}
	}
	return date
}

export function create_better_date(
	tz: TimeZone | 'tz:auto',
	year?: number,
	month?: number,
	day?: number,
	hour?: number,
	minute?: number,
	second?: number,
	milli?: number,
): BetterDate {
	const date = create_better_date_obj({
		year,
		month,
		day,
		hour,
		minute,
		second,
		milli,
		tz,
	})
	date._debug = {
		'create_better_date': {
			year,
			month,
			day,
			hour,
			minute,
			second,
			milli,
			tz,
		}
	}
	return date
}

export function create_better_date_obj({
	year,
	month,
	day,
	hour,
	minute,
	second,
	milli,
	tz = 'tz:auto',
}: {
	year?: number,
	month?: number,
	day?: number,
	hour?: number,
	minute?: number,
	second?: number,
	milli?: number,
	tz: TimeZone | 'tz:auto'
}): BetterDate {

	let _lx = LuxonDateTime.fromObject({
		year,
		month,
		day,
		hour,
		minute,
		second,
		millisecond: milli,
		zone: tz,
	})

	if (tz === 'tz:auto') {
		_lx = LuxonDateTime.fromObject({
			year,
			month,
			day,
			hour,
			minute,
			second,
			millisecond: milli,
			zone: get_default_timezone(_lx.toMillis()),
		})
	}

	assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_obj(): ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)

	return {
		_lx,
		_debug: {
			'create_better_date_obj': {
				year,
				month,
				day,
				hour,
				minute,
				second,
				milli,
				tz,
			}
		}
	}
}

////////////////////////////////////

export function change_tz(previous: Immutable<BetterDate>, tz: TimeZone): BetterDate {
	return create_better_date(
		tz,
		previous._lx.year,
		previous._lx.month,
		previous._lx.day,
		previous._lx.hour,
		previous._lx.minute,
		previous._lx.second,
		previous._lx.millisecond,
	)
}

// negative supported
export function add_days(previous: Immutable<BetterDate>, days: number): Immutable<BetterDate> {
	const _lx = previous._lx.plus({ days })

	return {
		_lx,
		_debug: {
			'add_days': {
				days
			}
		}
	}
}

export function add_days_to_simple_date(date: SimpleYYYYMMDD, inc_days: number): SimpleYYYYMMDD {
	let days = date % 100 + inc_days
	let months = Math.trunc(date / 100) % 100
	let years = Math.trunc(date / 10000)
	let _ld = new LegacyDate(years, months - 1, days)

	return _ld.getDate() + (_ld.getMonth() + 1) * 100 + _ld.getFullYear() * 10000
}

export function assertㆍBetterDateㆍdeepㆍequal(s1: Immutable<BetterDate>, s2: Immutable<BetterDate>, should_log = true): void {
	const s1_alt = _clean_debug(s1)
	const s2_alt = _clean_debug(s2)

	try {
		assert_deepStrictEqual(s1_alt, s2_alt)
	}
	catch (err) {
		if (should_log)
			console.error('assertㆍBetterDateㆍdeepㆍequal() FALSE', get_json_difference(s1_alt, s2_alt))
		throw err
	}
}

export const HOUR_IN_MILLIS = 60 * 60 * 1000
export const DAY_IN_MILLIS = 24 * HOUR_IN_MILLIS
export function is_within_24h(tms1: TimestampUTCMs, tms2: TimestampUTCMs): boolean {
	return Math.abs(tms1 - tms2) < DAY_IN_MILLIS
}
export function is_same_date_with_potential_tz_difference(tms1: TimestampUTCMs, tms2: TimestampUTCMs): boolean {
	if (!is_within_24h(tms1, tms2))
		return false

	const sub_hour_1 = tms1 % HOUR_IN_MILLIS
	const sub_hour_2 = tms2 % HOUR_IN_MILLIS
	if (sub_hour_1 === sub_hour_2)
		return true

	// allow a little bit of lag (seen 5s FRWF9408.MP4 and 7s on IMAG0430.jpg)
	if (Math.abs(sub_hour_1 - sub_hour_2) <= 10 * 1000)
		return true

	/*console.warn(`is_same_date_with_potential_tz_difference() yielding close FALSE`, {
		tms1,
		tms2,
		sub_hour_1,
		sub_hour_2,
		diff: Math.abs(sub_hour_1 - sub_hour_2),
	})*/

	return false
}

export function _clean_debug(date: Immutable<BetterDate>): Immutable<BetterDate> {
	return {
		...date,
		_debug: null,
	}
}

export function get_debug_representation(date: Immutable<BetterDate>): Object {
	return `<BetterDate>(${get_human_readable_timestamp_auto(date, 'tz:embedded')})`
}
