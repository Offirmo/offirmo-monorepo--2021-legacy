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
import moment, { Moment } from 'moment'
import 'moment-timezone'
///////
import { DateTime as LuxonDateTime } from 'luxon'
///////

import { SimpleYYYYMMDD, TimeZone } from '../types'
import { get_params, Params } from '../params'
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

	// TODO
	_lx: LuxonDateTime
	//tz: TimeZone
	/*_ld: LegacyDate
	_m: Moment*/
}

////////////////////////////////////


// should NOT be used in place of get_default_timezone()!
export function _xxx_get_system_timezone(): TimeZone {
	// https://stackoverflow.com/a/44096051/587407
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function get_default_timezone(date_utc_ms: TimestampUTCMs, PARAMS: Immutable<Params> = get_params()): TimeZone {
	//console.log('get_default_timezone()', { date_utc_ms, PARAMS })

	let res: TimeZone = _xxx_get_system_timezone()
	const change_after = PARAMS.default_timezones.find(tz_change => {
		//console.log('candidate', { tz_change })
		if (date_utc_ms >= tz_change.date_utc_ms) {
			res = tz_change.new_default
			//console.log({ res })
			return false // not sure we found the last
		}

		return true
	})

	if (!change_after && res !== _xxx_get_system_timezone()) {
		logger.warn(`Current default timezone from params "${res}" does not match current system timezone "${_xxx_get_system_timezone()}". Is that intended?`)
	}

	//console.log('final', { res })
	return res
}

////////////////////////////////////
// Selectors

export function get_timestamp_utc_ms(date: Immutable<BetterDate>): TimestampUTCMs {
	return date._lx.toMillis()
	/*console.warn('get_timestamp_utc_ms() ! check the tz')
	return Number(date._ld)*/
}

/*
function _get_final_tz(tz: TimeZone | 'tz:embedded', date: Immutable<BetterDate>): TimeZone {
	return ((): TimeZone => {
		if (tz === 'tz:embedded') {
			return date._lx.zone.name
			//return date.tz
		}

		return tz
	})()
}*/

/*
// moment
const DATE_FORMAT_YEARS = 'YYYY'
const DATE_FORMAT_MONTHS = 'MM'
const DATE_FORMAT_DAYS = 'DD'
const DATE_FORMAT_TO_DAYS_COMPACT = [ DATE_FORMAT_YEARS, DATE_FORMAT_MONTHS, DATE_FORMAT_DAYS].join('')
const DATE_FORMAT_TO_DAYS_NATURAL = [ DATE_FORMAT_YEARS, DATE_FORMAT_MONTHS, DATE_FORMAT_DAYS].join('-')
const DATE_FORMAT_TO_MINUTES_NATURAL = DATE_FORMAT_TO_DAYS_NATURAL + '_HH[h]mm'
const DATE_FORMAT_TO_SECONDS_NATURAL = DATE_FORMAT_TO_MINUTES_NATURAL + '[m]ss'
const DATE_FORMAT_TO_MILLIS_NATURAL = DATE_FORMAT_TO_SECONDS_NATURAL + '[s]SSS'
const DATE_FORMAT_TO_MILLIS_DIGITS = DATE_FORMAT_TO_DAYS_COMPACT + 'HHmmssSSS'
*/
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
	/*tz = _get_final_tz(tz, date)
	return Number(date._m.tz(tz).format(DATE_FORMAT_TO_DAYS_COMPACT))*/
}

// ex. 2018-11-21
export function get_human_readable_timestamp_days(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampDays {
	return date._lx.toFormat(DATE_FORMAT_TO_DAYS_NATURAL)
	/*tz = _get_final_tz(tz, date)
	return date._m.tz(tz).format(DATE_FORMAT_TO_DAYS_NATURAL)*/
}

// ex. 2018-11-21_06h00
export function get_human_readable_timestamp_minutes(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampMinutes {
	return date._lx.toFormat(DATE_FORMAT_TO_MINUTES_NATURAL)
	/*tz = _get_final_tz(tz, date)
	return date._m.tz(tz).format(DATE_FORMAT_TO_MINUTES_NATURAL)*/
}

// ex. 2018-11-21_04h23m15
export function get_human_readable_timestamp_seconds(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampSeconds {
	return date._lx.toFormat(DATE_FORMAT_TO_SECONDS_NATURAL)
	/*tz = _get_final_tz(tz, date)
	return date._m.tz(tz).format(DATE_FORMAT_TO_SECONDS_NATURAL)*/
}

// ex. 2018-11-21_06h00m45s632
export function get_human_readable_timestamp_millis(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampMillis {
	return date._lx.toFormat(DATE_FORMAT_TO_MILLIS_NATURAL)
	/*tz = _get_final_tz(tz, date)
	return date._m.tz(tz).format(DATE_FORMAT_TO_MILLIS_NATURAL)*/
}

// same as the above without trailing 0s
export function get_human_readable_timestamp_auto(date: Immutable<BetterDate>, tz: /*TimeZone |*/ 'tz:embedded'): PhotoSorterTimestampMillis {
	//console.log(date)
	assert(date && date._lx, 'get_human_readable_timestamp_auto() bad date')
	//const date = new Date(timestamp)

	/*const YYYY = date.getFullYear()
	const MM = String(date.getMonth() + 1).padStart(2, '0')
	const DD = String(date.getDate()).padStart(2, '0')
	const hh = String(date.getHours()).padStart(2, '0')
	const mm = String(date.getMinutes()).padStart(2, '0')
	const ss = String(date.getSeconds()).padStart(2, '0')
	const mmm = String(date.getMilliseconds()).padStart(3, '0')

	const digits = [ YYYY, MM, DD, hh, mm, ss, mmm ].join('')

	return _get_human_readable_timestamp_auto(date, digits)*/
	//const digits = date._m.tz(_get_final_tz(tz, date)).format(DATE_FORMAT_TO_MILLIS_DIGITS)
	const digits = date._lx.toFormat(DATE_FORMAT_TO_MILLIS_DIGITS)
	console.log({ digits })
	assert(digits.length === 17, 'get_human_readable_timestamp_auto() digits length')

	if (digits.endsWith('000000000'))
		return get_human_readable_timestamp_days(date, tz)

	if (digits.endsWith('00000'))
		return get_human_readable_timestamp_minutes(date, tz)

	if (digits.endsWith('000'))
		return get_human_readable_timestamp_seconds(date, tz)

	return get_human_readable_timestamp_millis(date, tz)
}

////////////////////////////////////

/*
export function create_better_date_from_legacy(legacy_date: Immutable<Date>): BetterDate {

}
*/

// needed to create from file times
export function create_better_date_from_utc_tms(tms: TimestampUTCMs): BetterDate {

	const tz = get_default_timezone(tms)

	const _ld = new Date(tms)

	const _lx = LuxonDateTime.fromJSDate(_ld, { zone: tz })

	// const _m = moment(_ld)
	return {
		_lx,
	}
}

// XXX to deprecate!!!
export function create_better_date_compat(
	year: number,
	month_0based: number,
	day?: number,
	hour?: number,
	minute?: number,
	second?: number,
	milli?: number,
	tz?: TimeZone
): BetterDate {

	if (!tz) {
		const legacy_date_as_utc = Date.UTC(year, month_0based, day, hour, minute, second, milli)
		tz = get_default_timezone(Number(legacy_date_as_utc)) // best we can do
		// TODO check if borderline
	}

	return create_better_date_obj({
		year,
		month: month_0based + 1,
		day,
		hour,
		minute,
		second,
		milli,
		tz,
	})

	/*
	// Date.UTC() ??
	const _ld = new Date(year, month_0based, day, hour, minute, second, milli) XXX
	const _m = moment(_ld)
	return {
		_ld,
		_m,
		tz,
	}*/
}


export function create_better_date_from_ExifDateTime(exif_date: ExifDateTime, default_zone?: TimeZone): BetterDate {
	let _lx: LuxonDateTime = exif_date.toDateTime()

	if (!exif_date.hasZone) {
		let tz: TimeZone = default_zone || get_default_timezone(_lx.toMillis())
		_lx = LuxonDateTime.fromObject({
			year: exif_date.year,
			month: exif_date.month, // TODO is it 0 based?,
			day: exif_date.day,
			hour: exif_date.hour,
			minute: exif_date.minute,
			second: exif_date.second,
			millisecond: exif_date.millis,
			zone: tz,
		})
	}

	return {
		_lx
	}
}

export function create_better_date(
	tz?: TimeZone,
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
	tz,
}: Partial<{
	year: number,
	month: number,
	day: number,
	hour: number,
	minute: number,
	second: number,
	milli: number,
	tz: TimeZone,
}> = {}): BetterDate {

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

	if (!tz) {
		tz ??= get_default_timezone(_lx.toMillis())
		_lx = LuxonDateTime.fromObject({
			year,
			month,
			day,
			hour,
			minute,
			second,
			millisecond: milli,
			zone: tz,
		})
	}

	return {
		_lx
	}

		/*
	const legacy_date = new LegacyDate()

	year ??= legacy_date.getFullYear()
	const month_0based = month ? month - 1 : legacy_date.getMonth()

	return create_better_date_compat(year, month_0based, day, hour, minute, second, milli, tz)*/
}

