
import { TimeZone } from '../types'
import logger from './logger'
import { Params, get_params } from '../params'


export function get_current_timezone(): TimeZone {
	// TODO proper credit s/o
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function get_default_timezone(date: Readonly<Date>, params: Readonly<Params> = get_params()): TimeZone {
	const date_utc_ms = Number(date)
	//console.log('get_default_timezone()', { date_utc_ms, params })

	let res: TimeZone = get_current_timezone()
	const change_after = params.default_timezones.find(tz_change => {
		//console.log('candidate', { tz_change })
		if (date_utc_ms >= tz_change.date_utc_ms) {
			res = tz_change.new_default
			//console.log({ res })
			return false // not sure we found the last
		}

		return true
	})

	if (!change_after && res !== get_current_timezone()) {
		logger.warn(`Current default timezone from params "${res}" does not match current system timezone "${get_current_timezone()}". Is that intended?`)
	}

	//console.log('final', { res })
	return res
}
