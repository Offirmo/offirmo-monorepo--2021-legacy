import assert from 'tiny-invariant'

import {SimpleYYYYMMDD} from "../types";

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

// ex. 2018-11-21
export function get_human_readable_timestamp_days(date: Readonly<Date>): PhotoSorterTimestampDays {
	const YYYY = date.getFullYear()
	const MM = String(date.getMonth() + 1).padStart(2, '0')
	const DD = String(date.getDate()).padStart(2, '0')

	return `${YYYY}-${MM}-${DD}`
}

// ex. 2018-11-21_06h00
export function get_human_readable_timestamp_minutes(date: Readonly<Date>): PhotoSorterTimestampMinutes {
	const hh = String(date.getHours()).padStart(2, '0')
	const mm = String(date.getMinutes()).padStart(2, '0')

	return get_human_readable_timestamp_days(date) + `_${hh}h${mm}`
}

// ex. 2018-11-21_04h23m15
export function get_human_readable_timestamp_seconds(date: Readonly<Date>): PhotoSorterTimestampSeconds {
	const ss = String(date.getSeconds()).padStart(2, '0')

	return get_human_readable_timestamp_minutes(date) + `m${ss}`
}

// ex.      2018-11-21_06h00m45s632
export function get_human_readable_timestamp_millis(date: Readonly<Date>): PhotoSorterTimestampMillis {
	const mmm = String(date.getMilliseconds()).padStart(3, '0')

	return get_human_readable_timestamp_seconds(date) + `s${mmm}`
}

function _get_human_readable_timestamp_auto(date: Readonly<Date>, digits: string): PhotoSorterTimestampMillis {
	assert(digits.length <= 17, 'digits length')
	digits = digits.padEnd(17, '0')

	if (digits.endsWith('000000000'))
		return get_human_readable_timestamp_days(date)

	if (digits.endsWith('00000'))
		return get_human_readable_timestamp_minutes(date)

	if (digits.endsWith('000'))
		return get_human_readable_timestamp_seconds(date)

	return get_human_readable_timestamp_millis(date)
}
export function get_human_readable_timestamp_auto(date: Readonly<Date>, ref_digits?: string): PhotoSorterTimestampMillis {
	assert(date && date.getFullYear, 'get_human_readable_timestamp_auto() bad date')
	//const date = new Date(timestamp)

	const YYYY = date.getFullYear()
	const MM = String(date.getMonth() + 1).padStart(2, '0')
	const DD = String(date.getDate()).padStart(2, '0')
	const hh = String(date.getHours()).padStart(2, '0')
	const mm = String(date.getMinutes()).padStart(2, '0')
	const ss = String(date.getSeconds()).padStart(2, '0')
	const mmm = String(date.getMilliseconds()).padStart(3, '0')

	const digits = [ YYYY, MM, DD, hh, mm, ss, mmm ].join('')
	if (ref_digits) {
		assert(digits.startsWith(ref_digits), 'get_human_readable_timestamp_auto() digits')
	}

	return _get_human_readable_timestamp_auto(date, digits)
}

export function get_compact_date(date: Readonly<Date>): SimpleYYYYMMDD {
	const YYYY = date.getFullYear()
	const MM = String(date.getMonth() + 1).padStart(2, '0')
	const DD = String(date.getDate()).padStart(2, '0')

	return Number(`${YYYY}${MM}${DD}`)
}

/////////////////////
