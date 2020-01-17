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
function get_human_readable_timestamp_days(now: Readonly<Date> = new Date()): PhotoSorterTimestampDays {
	const YYYY = now.getUTCFullYear()
	const MM = String(now.getUTCMonth() + 1).padStart(2, '0')
	const DD = String(now.getUTCDate()).padStart(2, '0')

	return `${YYYY}-${MM}-${DD}`
}

// ex. 2018-11-21_06h00
function get_human_readable_timestamp_minutes(now: Readonly<Date> = new Date()): PhotoSorterTimestampMinutes {
	const hh = String(now.getUTCHours()).padStart(2, '0')
	const mm = String(now.getUTCMinutes()).padStart(2, '0')

	return get_human_readable_timestamp_days(now) + `_${hh}h${mm}`
}

// ex. 2018-11-21_04h23m15
function get_human_readable_timestamp_seconds(now: Readonly<Date> = new Date()): PhotoSorterTimestampSeconds {
	const ss = String(now.getUTCSeconds()).padStart(2, '0')

	return get_human_readable_timestamp_minutes(now) + `m${ss}`
}

// ex.      2018-11-21_06h00m45s632
function get_human_readable_timestamp_millis(now: Readonly<Date> = new Date()): PhotoSorterTimestampMillis {
	const mmm = String(now.getUTCMilliseconds()).padStart(3, '0')

	return get_human_readable_timestamp_seconds(now) + `s${mmm}`
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
}

/////////////////////
