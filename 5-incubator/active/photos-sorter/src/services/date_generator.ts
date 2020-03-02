import assert from 'tiny-invariant'

import { TimestampUTCMs } from '@offirmo-private/timestamps'

/////////////////////

type PhotoSorterTimestampDays = string
type PhotoSorterTimestampMinutes = string
type PhotoSorterTimestampSeconds = string
type PhotoSorterTimestampMillis = string

/////////////////////
// spec:
// - human readable timestamps
// - valid in files
// - as short as possible

// ex. 2018-11-21
function get_human_readable_timestamp_days(date: Readonly<Date>): PhotoSorterTimestampDays {
	const YYYY = date.getUTCFullYear()
	const MM = String(date.getUTCMonth() + 1).padStart(2, '0')
	const DD = String(date.getUTCDate()).padStart(2, '0')

	return `${YYYY}-${MM}-${DD}`
}

// ex. 2018-11-21_06h00
function get_human_readable_timestamp_minutes(date: Readonly<Date>): PhotoSorterTimestampMinutes {
	const hh = String(date.getUTCHours()).padStart(2, '0')
	const mm = String(date.getUTCMinutes()).padStart(2, '0')

	return get_human_readable_timestamp_days(date) + `_${hh}h${mm}`
}

// ex. 2018-11-21_04h23m15
function get_human_readable_timestamp_seconds(date: Readonly<Date>): PhotoSorterTimestampSeconds {
	const ss = String(date.getUTCSeconds()).padStart(2, '0')

	return get_human_readable_timestamp_minutes(date) + `m${ss}`
}

// ex.      2018-11-21_06h00m45s632
function get_human_readable_timestamp_millis(date: Readonly<Date>): PhotoSorterTimestampMillis {
	const mmm = String(date.getUTCMilliseconds()).padStart(3, '0')

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
function get_human_readable_timestamp_auto(timestamp: TimestampUTCMs, ref_digits?: string): PhotoSorterTimestampMillis {
	const date = new Date(timestamp)

	const YYYY = date.getUTCFullYear()
	const MM = String(date.getUTCMonth() + 1).padStart(2, '0')
	const DD = String(date.getUTCDate()).padStart(2, '0')
	const hh = String(date.getUTCHours()).padStart(2, '0')
	const mm = String(date.getUTCMinutes()).padStart(2, '0')
	const ss = String(date.getUTCSeconds()).padStart(2, '0')
	const mmm = String(date.getUTCMilliseconds()).padStart(3, '0')

	const digits = [ YYYY, MM, DD, hh, mm, ss, mmm ].join('')
	if (ref_digits) {
		assert(digits.startsWith(ref_digits), 'get_human_readable_timestamp_auto() digits')
	}

	return _get_human_readable_timestamp_auto(date, digits)
}

/////////////////////

export {
	PhotoSorterTimestampDays,
	PhotoSorterTimestampMinutes,
	PhotoSorterTimestampSeconds,
	PhotoSorterTimestampMillis,

	get_human_readable_timestamp_days,
	get_human_readable_timestamp_seconds,
	get_human_readable_timestamp_minutes,
	get_human_readable_timestamp_millis,

	get_human_readable_timestamp_auto,
}

/////////////////////
