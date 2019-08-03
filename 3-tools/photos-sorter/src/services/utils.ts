import assert from 'tiny-invariant'

import { TimestampUTCMs, get_human_readable_UTC_timestamp_days } from "@offirmo-private/timestamps"

import { SimpleYYYYMMDD } from '../types'

export function get_compact_date_from_UTC_ts(ts: TimestampUTCMs): SimpleYYYYMMDD {
	assert(ts, 'get_compact_date_from_UTC_ts: good param ✔')
	const d = Number(get_human_readable_UTC_timestamp_days(new Date(ts)))
	console.log({ ts, d })
	assert(d >= 19500101, 'compact date lower bound ✔')
	assert(d <= 21001231, 'compact date higher bound ✔')
	return d
}
