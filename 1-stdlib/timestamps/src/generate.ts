/////////////////////

// - human readable timestamps
// - valid in URLs ?
// - valid in files ?

import {
	TimestampUTCMs,
	HumanReadableTimestampUTCDays,
	HumanReadableTimestampUTCMinutes,
	HumanReadableTimestampUTCSeconds,
	HumanReadableTimestampUTCMs,
} from './types'

// ex. 1542780045627
function get_UTC_timestamp_ms(now: Readonly<Date> = new Date()): TimestampUTCMs {
	return (+now)
}

/////////////////////
// spec:
// - human readable
// - as short as possible

// ex. 20181121
// assumed side effect of being castable to a number
function get_human_readable_UTC_timestamp_days(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCDays {
	const YYYY = now.getUTCFullYear()
	const MM = String(now.getUTCMonth() + 1).padStart(2, '0')
	const DD = String(now.getUTCDate()).padStart(2, '0')

	return `${YYYY}${MM}${DD}`
}

// ex. 20181121_06h00
function get_human_readable_UTC_timestamp_minutes(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMinutes {
	const hh = String(now.getUTCHours()).padStart(2, '0')
	const mm = String(now.getUTCMinutes()).padStart(2, '0')

	return get_human_readable_UTC_timestamp_days(now) + `_${hh}h${mm}`
}

function get_human_readable_UTC_timestamp_seconds(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCSeconds {
	const ss = String(now.getUTCSeconds()).padStart(2, '0')

	return get_human_readable_UTC_timestamp_minutes(now) + `+${ss}`
}

function get_human_readable_UTC_timestamp_ms(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMs {
	const mmm = String(now.getUTCMilliseconds()).padStart(3, '0')

	return get_human_readable_UTC_timestamp_seconds(now) + `.${mmm}`
}

/////////////////////

// ISO 8601 Extended Format. The format is as follows: YYYY-MM-DDTHH:mm:ss.sssZ
// http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15
function get_ISO8601_extended_ms(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMs {
	return now.toISOString()
}

function get_ISO8601_simplified_minutes(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMs {
	return get_ISO8601_extended_ms(now).slice(0, 16)
}

function get_ISO8601_simplified_day(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMs {
	return get_ISO8601_extended_ms(now).slice(0, 10)
}

// fun but unclear
// https://space.stackexchange.com/questions/36628/utc-timestamp-format-for-launch-vehicles
/*function get_space_timestamp_ms(now: Readonly<Date> = new Date()): string {
	const YYYY = now.getUTCFullYear()
	const MM = now.getUTCMonth()
	const DD = ('0' + now.getUTCDate()).slice(-2)
	const hh = ('0' + now.getUTCHours()).slice(-2)
	const mm = ('0' + now.getUTCMinutes()).slice(-2)
	const ss = ('0' + now.getUTCSeconds()).slice(-2)
	const mmm = ('00' + now.getUTCMilliseconds()).slice(-3)

	return `${DD} ${hh}:${mm}:${ss}.${mmm}`
}*/

/////////////////////

export {
	get_UTC_timestamp_ms,

	get_human_readable_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_seconds,
	get_human_readable_UTC_timestamp_minutes,
	get_human_readable_UTC_timestamp_days,

	get_ISO8601_extended_ms,
	get_ISO8601_simplified_minutes,
	get_ISO8601_simplified_day,
}

/////////////////////
