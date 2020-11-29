/* Abstraction over a Date API more powerful than JS Date
 * Candidates:
 * - moment-tz
 * - Luxon
 * - Spacetime
 * - TC39 Temporal https://tc39.es/proposal-temporal/docs/cookbook.html
 */

import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { ExifDateTime } from 'exiftool-vendored'

///////
//import moment, { Moment } from 'moment'
//import 'moment-timezone'
///////
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

export interface BetterDate {
	_debug: any

	// Note: we defaulted on Luxon bc
	// 1. it's very good and suitable
	// 2. ExifDateTime also uses it internally = easy to convert from
	_lx: LuxonDateTime
}

////////////////////////////////////
// Selectors

export function get_timestamp_utc_ms(date: Immutable<BetterDate>): TimestampUTCMs {
	return date._lx.toMillis()
	/*console.warn('get_timestamp_utc_ms() ! check the tz')
	return Number(date._ld)*/
}

// luxon
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
export function get_human_readable_timestamp_auto(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampMillis {
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

// used in unit tests only
export function get_exif_datetime(date: Immutable<BetterDate>): ExifDateTime {
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

////////////////////////////////////

/*
export function create_better_date_from_legacy(legacy_date: Immutable<Date>): BetterDate {

}
*/

// needed to create from file times
export function create_better_date_from_utc_tms(tms: TimestampUTCMs, tz: 'tz:auto'): BetterDate {
	assert(!!tms, 'create_better_date_from_utc_tms correct input: ' + tms)
	assert(Number.isSafeInteger(tms), `create_better_date_from_utc_tms correct input: isSafeInteger(${tms})`)

	const _tz = get_default_timezone(tms)

	const _ld = new Date(tms)

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

	//assert(exif_date.hasZone, 'exif date has zone?') // XXX
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
				exif_date,
			}
		}
	}
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
	return create_better_date_obj({
		year,
		month,
		day,
		hour,
		minute,
		second,
		milli,
		tz,
	})
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

		/*
	const legacy_date = new LegacyDate()

	year ??= legacy_date.getFullYear()
	const month_0based = month ? month - 1 : legacy_date.getMonth()

	return create_better_date_compat(year, month_0based, day, hour, minute, second, milli, tz)*/
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

export function add_days_to_simple_date(date: SimpleYYYYMMDD, inc_days: number): SimpleYYYYMMDD {
	let days = date % 100 + inc_days
	let months = Math.trunc(date / 100) % 100
	let years = Math.trunc(date / 10000)
	let _ld = new Date(years, months - 1, days)

	return _ld.getDate() + (_ld.getMonth() + 1) * 100 + _ld.getFullYear() * 10000
}
