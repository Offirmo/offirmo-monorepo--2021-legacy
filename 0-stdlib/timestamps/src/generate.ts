/////////////////////

// - human readable timestamps
// - valid in URLs ?
// - valid in files ?

import {
	TimestampUTCMs,
	HumanReadableTimestampUTCDays,
	HumanReadableTimestampUTCMinutes,
	HumanReadableTimestampUTCMs,
} from './types'

function get_UTC_timestamp_ms(now: Readonly<Date> = new Date()): TimestampUTCMs {
	return (+now)
}

/////////////////////

function get_human_readable_UTC_timestamp_days(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCDays {
	const YYYY = now.getUTCFullYear()
	const MM = ('0' + (now.getUTCMonth() + 1)).slice(-2)
	const DD = ('0' + now.getUTCDate()).slice(-2)

	return `${YYYY}${MM}${DD}`
}

function get_human_readable_UTC_timestamp_minutes(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMinutes {
	const hh = ('0' + now.getUTCHours()).slice(-2)
	const mm = ('0' + now.getUTCMinutes()).slice(-2)

	return get_human_readable_UTC_timestamp_days(now) + `_${hh}h${mm}`
}

function get_human_readable_UTC_timestamp_seconds(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMinutes {
	const ss = ('0' + now.getUTCSeconds()).slice(-2)

	return get_human_readable_UTC_timestamp_minutes(now) + `.${ss}`
}

function get_human_readable_UTC_timestamp_ms_v1(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMs {
	const ss = ('0' + now.getUTCSeconds()).slice(-2)
	const mmm = ('00' + now.getUTCMilliseconds()).slice(-3)

	return get_human_readable_UTC_timestamp_minutes(now) + `:${ss}.${mmm}`
}

function get_human_readable_UTC_timestamp_ms(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMs {
	return 'ts1_' + get_human_readable_UTC_timestamp_ms_v1(now)
}

/////////////////////

export {
	get_human_readable_UTC_timestamp_ms_v1,

	get_UTC_timestamp_ms,

	get_human_readable_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_seconds,
	get_human_readable_UTC_timestamp_minutes,
	get_human_readable_UTC_timestamp_days,
}

/////////////////////
