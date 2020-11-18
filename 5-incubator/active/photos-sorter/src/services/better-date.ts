import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import moment, { Moment } from 'moment'
import 'moment-timezone'

import { SimpleYYYYMMDD, TimeZone } from '../types'

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
	_d: Date
	_m: Moment
	tz: TimeZone
}

////////////////////////////////////

export function get_current_year(): number {
	return (new Date()).getFullYear()
}

////////////////////////////////////
// Selectors

export function get_timestamp_utc_ms(date: Immutable<BetterDate>): TimestampUTCMs {
	return Number(date._d)
}

export function get_compact_date(date: Immutable<BetterDate>): SimpleYYYYMMDD {
	return Number(date._m.tz(date.tz).format('YYYYMMDD'))
}

// ex. 2018-11-21
const MOMENT_FORMAT_DAYS = 'YYYY-MM-DD'
export function get_human_readable_timestamp_days(date: Immutable<BetterDate>): PhotoSorterTimestampDays {
	return date._m.tz(date.tz).format(MOMENT_FORMAT_DAYS)
}

// ex. 2018-11-21_06h00
const MOMENT_FORMAT_MINUTES = MOMENT_FORMAT_DAYS + '_HH[h]mm'
export function get_human_readable_timestamp_minutes(date: Immutable<BetterDate>): PhotoSorterTimestampMinutes {
	return date._m.tz(date.tz).format(MOMENT_FORMAT_MINUTES)
}

// ex. 2018-11-21_04h23m15
const MOMENT_FORMAT_SECONDS = MOMENT_FORMAT_MINUTES + '[m]ss'
export function get_human_readable_timestamp_seconds(date: Immutable<BetterDate>): PhotoSorterTimestampSeconds {
	return date._m.tz(date.tz).format(MOMENT_FORMAT_SECONDS)
}

// ex. 2018-11-21_06h00m45s632
const MOMENT_FORMAT_MILLIS = MOMENT_FORMAT_SECONDS + '[s]SSS'
export function get_human_readable_timestamp_millis(date: Immutable<BetterDate>): PhotoSorterTimestampMillis {
	return date._m.tz(date.tz).format(MOMENT_FORMAT_MILLIS)
}

export function get_human_readable_timestamp_auto(date: Immutable<BetterDate>): PhotoSorterTimestampMillis {
	//console.log(date)
	assert(date && date._d, 'get_human_readable_timestamp_auto() bad date')
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
	const digits = date._m.tz(date.tz).format('YYYYMMDDHHmmssSSS')
	assert(digits.length === 17, 'digits length')

	if (digits.endsWith('000000000'))
		return get_human_readable_timestamp_days(date)

	if (digits.endsWith('00000'))
		return get_human_readable_timestamp_minutes(date)

	if (digits.endsWith('000'))
		return get_human_readable_timestamp_seconds(date)

	return get_human_readable_timestamp_millis(date)
}



////////////////////////////////////

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
	const _d = new Date(year, month_0based, day, hour, minute, second, milli)
	const _m = moment(_d)
	return {
		_d,
		_m,
		tz,
	}
}



export function create_better_date({
	year,
	month,
	day,
	hour,
	minute,
	second,
	milli,
	tz
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
	const legacy_date = new LegacyDate()

	year ??= legacy_date.getFullYear()
	const month_0based = month ? month - 1 : legacy_date.getMonth()

	return create_better_date_compat(year, month_0based, day, hour, minute, second, milli, tz)
}

