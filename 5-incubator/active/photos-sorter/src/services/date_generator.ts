import assert from 'tiny-invariant'
import moment, { Moment } from 'moment'
import 'moment-timezone'
import { Immutable} from '@offirmo-private/ts-types'

import { SimpleYYYYMMDD, TimeZone } from '../types'

/////////////////////

export type PhotoSorterTimestampDays = string
export type PhotoSorterTimestampMinutes = string
export type PhotoSorterTimestampSeconds = string
export type PhotoSorterTimestampMillis = string

/////////////////////
// spec:
// - human readable timestamps
// - valid in files
// - as short as possible

// https://momentjs.com/docs/#/displaying/format/

// ex. 2018-11-21
const MOMENT_FORMAT_DAYS = 'YYYY-MM-DD'
export function get_human_readable_timestamp_days(date: Immutable<Date>, tz: TimeZone, date_m: Moment = moment(date as Date)): PhotoSorterTimestampDays {
	/*
	const YYYY = date.getFullYear()
	const MM = String(date.getMonth() + 1).padStart(2, '0')
	const DD = String(date.getDate()).padStart(2, '0')

	return `${YYYY}-${MM}-${DD}`*/
	return date_m.tz(tz).format(MOMENT_FORMAT_DAYS)
}

// ex. 2018-11-21_06h00
const MOMENT_FORMAT_MINUTES = MOMENT_FORMAT_DAYS + '_HH[h]mm'
export function get_human_readable_timestamp_minutes(date: Immutable<Date>, tz: TimeZone, date_m: Moment = moment(date as Date)): PhotoSorterTimestampMinutes {
	/*const hh = String(date.getHours()).padStart(2, '0')
	const mm = String(date.getMinutes()).padStart(2, '0')

	return get_human_readable_timestamp_days(date, tz, date_m) + `_${hh}h${mm}`*/
	return date_m.tz(tz).format(MOMENT_FORMAT_MINUTES)
}

// ex. 2018-11-21_04h23m15
const MOMENT_FORMAT_SECONDS = MOMENT_FORMAT_MINUTES + '[m]ss'
export function get_human_readable_timestamp_seconds(date: Immutable<Date>, tz: TimeZone, date_m: Moment = moment(date as Date)): PhotoSorterTimestampSeconds {
	/*const ss = String(date.getSeconds()).padStart(2, '0')

	return get_human_readable_timestamp_minutes(date, tz, date_m) + `m${ss}`*/
	return date_m.tz(tz).format(MOMENT_FORMAT_SECONDS)
}

// ex.      2018-11-21_06h00m45s632
const MOMENT_FORMAT_MILLIS = MOMENT_FORMAT_SECONDS + '[s]SSS'
export function get_human_readable_timestamp_millis(date: Immutable<Date>, tz: TimeZone, date_m: Moment = moment(date as Date)): PhotoSorterTimestampMillis {
	/*const mmm = String(date.getMilliseconds()).padStart(3, '0')

	return get_human_readable_timestamp_seconds(date, tz, date_m) + `s${mmm}`*/
	return date_m.tz(tz).format(MOMENT_FORMAT_MILLIS)
}
/*
function _get_human_readable_timestamp_auto(date: Immutable<Date>, tz: TimeZone, date_m: Moment = moment(date as Date)): PhotoSorterTimestampMillis {
	const digits = date_m.tz(tz).format('YYYYMMDDHHmmssSSS')
	assert(digits.length <= 17, 'digits length')
	digits = digits.padEnd(17, '0')

	if (digits.endsWith('000000000'))
		return get_human_readable_timestamp_days(date, tz, date_m)

	if (digits.endsWith('00000'))
		return get_human_readable_timestamp_minutes(date, tz, date_m)

	if (digits.endsWith('000'))
		return get_human_readable_timestamp_seconds(date, tz, date_m)

	return get_human_readable_timestamp_millis(date, tz, date_m)
}*/
export function get_human_readable_timestamp_auto(date: Immutable<Date>, tz: TimeZone, date_m: Moment = moment(date as Date)): PhotoSorterTimestampMillis {
	//console.log(date)
	assert(date && date.getFullYear, 'get_human_readable_timestamp_auto() bad date')
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
	const digits = date_m.tz(tz).format('YYYYMMDDHHmmssSSS')
	assert(digits.length === 17, 'digits length')

	if (digits.endsWith('000000000'))
		return get_human_readable_timestamp_days(date, tz, date_m)

	if (digits.endsWith('00000'))
		return get_human_readable_timestamp_minutes(date, tz, date_m)

	if (digits.endsWith('000'))
		return get_human_readable_timestamp_seconds(date, tz, date_m)

	return get_human_readable_timestamp_millis(date, tz, date_m)
}

export function get_compact_date(date: Immutable<Date>, tz: TimeZone, date_m: Moment = moment(date as Date)): SimpleYYYYMMDD {
	/*const YYYY = date.getFullYear()
	const MM = String(date.getMonth() + 1).padStart(2, '0')
	const DD = String(date.getDate()).padStart(2, '0')

	return Number(`${YYYY}${MM}${DD}`)*/
	return Number(date_m.tz(tz).format('YYYYMMDD'))
}

/////////////////////
