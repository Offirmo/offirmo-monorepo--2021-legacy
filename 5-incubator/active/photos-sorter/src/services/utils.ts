import assert from 'tiny-invariant'

import { TimestampUTCMs, get_human_readable_UTC_timestamp_days } from '@offirmo-private/timestamps'

import { SimpleYYYYMMDD } from '../types'
import { DATE_LOWER_BOUND, DATE_UPPER_BOUND } from '../consts'

export function get_compact_date_from_UTC_ts(ts: TimestampUTCMs): SimpleYYYYMMDD {
	assert(ts, 'get_compact_date_from_UTC_ts: good param!')
	const d = Number(get_human_readable_UTC_timestamp_days(new Date(ts)))
	//console.log({ ts, d })
	assert(d >= DATE_LOWER_BOUND, 'compact date lower bound!')
	assert(d <= DATE_UPPER_BOUND, 'compact date higher bound!')
	return d
}
