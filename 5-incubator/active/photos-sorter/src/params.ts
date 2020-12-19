import path from 'path'

import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

import { EXIF_POWERED_FILE_EXTENSIONS } from './consts'
import { SimpleYYYYMMDD, AbsolutePath, TimeZone } from './types'
import logger from './services/logger'

const TZONE_FR: TimeZone = 'Europe/Paris'
const TZONE_AU: TimeZone = 'Australia/Sydney'

export interface DefaultTzChange {
	date_utc_ms: number,
	new_default: string
}

export interface Params {
	root: AbsolutePath
	dry_run: boolean
	YYYY_lower_bound: number
	YYYY_upper_bound: number
	date_lower_bound: SimpleYYYYMMDD
	date_upper_bound: SimpleYYYYMMDD
	extensions_to_normalize: { [k: string]: string } // todo runtime check LCase
	media_files_extensions: string[] // todo runtime check normalized
	extensions_to_delete: string[] // todo runtime check normalized
	worthless_files: string[]
	default_timezones: DefaultTzChange[]
	is_perfect_state: boolean // For me (author) debug purpose.
}

export function get_current_year(): number {
	return (new Date()).getFullYear()
}

// should NOT be used in place of get_default_timezone()!
export function _xxx_get_system_timezone(): TimeZone {
	// https://stackoverflow.com/a/44096051/587407
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}


// the earliest known photo was taken in 1826
// https://en.wikipedia.org/wiki/View_from_the_Window_at_Le_Gras
const YYYY_LOWER_BOUND = 1826
assert(YYYY_LOWER_BOUND >= 1826, 'earliest known')

const YYYY_UPPER_BOUND = get_current_year() + 1 // +1 to handle taking pictures during new year eve
assert(YYYY_UPPER_BOUND >= YYYY_LOWER_BOUND, 'higher > lower')

const DATE_LOWER_BOUND: SimpleYYYYMMDD = (YYYY_LOWER_BOUND * 10000) + 101
const DATE_UPPER_BOUND: SimpleYYYYMMDD = (YYYY_UPPER_BOUND * 10000) + 102 // photos taken "next" year can only happen during new year eve


export function get_params(): Params {
	return {
		YYYY_lower_bound: YYYY_LOWER_BOUND,
		YYYY_upper_bound: YYYY_UPPER_BOUND,
		date_lower_bound: DATE_LOWER_BOUND,
		date_upper_bound: DATE_UPPER_BOUND,

		root: path.normalize(`/Users/${process.env.USER}/Documents/- photos sorter/- sorted`),
		//root: path.normalize(`/Users/${process.env.USER}/Documents/- photos sorter/- sorted/- inbox/some posh event with no date in inbox`),

		...(false // XXX true = local execution on Offirmo's machine
			? {
					dry_run: true,
					//dry_run: false,
					is_perfect_state: true,
				}
			: {
					// nominal case for prod and unit tests
					dry_run: false,
					is_perfect_state: false,
				}
		),

		extensions_to_normalize: {
			'.jpeg': '.jpg',
			'.tiff': '.tif',
		},

		media_files_extensions: [
			...EXIF_POWERED_FILE_EXTENSIONS,
			'.avi', // old videos
			'.gif',
			'.mp4',
			'.pdf',
			'.png',
			'.psp', // photoshop I believe, screens from Warcraft III are in this format
			'.tga', // WoW
		].map(s => s.toLowerCase()),

		extensions_to_delete: [
			'.AAE',
		].map(s => s.toLowerCase()),

		worthless_files: [
			'.DS_Store',
			'.picasa.ini',
			'pspbrwse.jbf', // paint shop pro
		].map(s => s.toLowerCase()),

		default_timezones: [
			// if no time zone, infer it according to this timetable
			// Expected to be in order
			{
				date_utc_ms: Number(Date.UTC(YYYY_LOWER_BOUND, 0)),
				new_default: TZONE_FR,
			},
			{
				date_utc_ms: Number(Date.UTC(2009, 7, 10)),
				new_default: 'Asia/Bangkok',
			},
			{
				date_utc_ms: Number(Date.UTC(2010, 6, 8)),
				new_default: TZONE_FR,
			},
			{
				date_utc_ms: Number(Date.UTC(2017, 6, 14)),
				new_default: TZONE_AU,
			},
		].sort((a, b) => a.date_utc_ms - b.date_utc_ms),
	}
}

export function get_default_timezone(date_utc_ms: TimestampUTCMs, PARAMS: Immutable<Params> = get_params()): TimeZone {
	//console.log('get_default_timezone()', { date_utc_ms, PARAMS })

	let res: TimeZone = _xxx_get_system_timezone()
	const change_after = PARAMS.default_timezones.find(tz_change => {
		//console.log('candidate', { tz_change })
		if (date_utc_ms >= tz_change.date_utc_ms) {
			res = tz_change.new_default
			//console.log({ res })
			return false // not sure we found the last
		}

		return true
	})

	if (!change_after && res !== _xxx_get_system_timezone()) {
		logger.warn(`Current default timezone from params "${res}" does not match current system timezone "${_xxx_get_system_timezone()}". Is that intended?`)
	}

	//console.log('final', { res })
	return res
}
