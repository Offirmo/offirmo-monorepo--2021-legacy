/////////////////////

// - human readable timestamps
// - valid in URLs ?
// - valid in files ?

import {
	TimestampUTCMs,
	HumanReadableTimestampUTCMinutes,
	HumanReadableTimestampUTCMs,
} from './types'

function get_UTC_timestamp_ms(): TimestampUTCMs {
	return (+ Date.now())
}

/////////////////////

function get_human_readable_UTC_timestamp_minutes(now = new Date()): HumanReadableTimestampUTCMinutes {
	const YYYY = now.getUTCFullYear()
	const MM = ('0' + (now.getUTCMonth() + 1)).slice(-2)
	const DD = ('0' + now.getUTCDate()).slice(-2)
	const hh = ('0' + now.getUTCHours()).slice(-2)
	const mm = ('0' + now.getUTCMinutes()).slice(-2)

	return `${YYYY}${MM}${DD}_${hh}h${mm}`
}

function get_human_readable_UTC_timestamp_ms_v1(now = new Date()): HumanReadableTimestampUTCMs {
	const YYYY = now.getUTCFullYear()
	const MM = ('0' + (now.getUTCMonth() + 1)).slice(-2)
	const DD = ('0' + now.getUTCDate()).slice(-2)
	const hh = ('0' + now.getUTCHours()).slice(-2)
	const mm = ('0' + now.getUTCMinutes()).slice(-2)
	const ss = ('0' + now.getUTCSeconds()).slice(-2)
	const mmm = ('00' + now.getUTCMilliseconds()).slice(-3)

	// TODO remove the ':' ?
	return `${YYYY}${MM}${DD}_${hh}h${mm}:${ss}.${mmm}`
}

function get_human_readable_UTC_timestamp_ms(now = new Date()): HumanReadableTimestampUTCMs {
	return 'ts1_' + get_human_readable_UTC_timestamp_ms_v1(now)
}

/////////////////////

export {
	TimestampUTCMs,
	HumanReadableTimestampUTCMinutes,
	HumanReadableTimestampUTCMs,

	get_human_readable_UTC_timestamp_ms_v1,

	get_UTC_timestamp_ms,

	get_human_readable_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_minutes,
}

/////////////////////
