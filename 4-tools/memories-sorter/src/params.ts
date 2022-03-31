import path from 'path'

import assert from 'tiny-invariant'
import memoize_once from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

import { EXIF_POWERED_FILE_EXTENSIONS_LC } from './consts'
import { SimpleYYYYMMDD, AbsolutePath, TimeZone } from './types'
import logger from './services/logger'

/////////////////////////////////////////////////

const TZONE_FR: TimeZone = 'Europe/Paris'
const TZONE_AU: TimeZone = 'Australia/Sydney'

export interface DefaultTzChange {
	date_utc_ms: number,
	new_default: string
}

export interface Params {
	root: AbsolutePath
	dry_run: boolean
	date_lower_boundⳇₓyear: number
	date_upper_boundⳇₓyear: number
	date_lower_boundⳇsymd: SimpleYYYYMMDD
	date_upper_boundⳇsymd: SimpleYYYYMMDD
	max_event_durationⳇₓday: number
	extensions_to_normalize‿lc: { [k: string]: string }
	extensions_of_media_files‿lc: string[]
	extensions_to_delete‿lc: string[]
	worthless_file_basenames‿lc: string[]
	default_timezones: DefaultTzChange[]
	expect_perfect_state: boolean // For me (author) debug purpose.
}

export const CURRENT_YEAR: number = (new Date()).getFullYear()

// UNSAFE bc should not be used in place of get_default_timezone()!
export const _UNSAFE_CURRENT_SYSTEM_TIMEZONE: TimeZone =
	// https://stackoverflow.com/a/44096051/587407
	Intl.DateTimeFormat().resolvedOptions().timeZone

// the earliest known photo was taken in 1826
// https://en.wikipedia.org/wiki/View_from_the_Window_at_Le_Gras
const date_lower_boundⳇₓyear = 1826
assert(date_lower_boundⳇₓyear >= 1826, 'earliest known')

const date_upper_boundⳇₓyear = CURRENT_YEAR + 1 // TODO review +1 to handle taking pictures during new year eve
assert(date_upper_boundⳇₓyear >= date_lower_boundⳇₓyear, 'higher >= lower 1')

const date_lower_boundⳇsymd: SimpleYYYYMMDD = (date_lower_boundⳇₓyear * 10000) + 101
const date_upper_boundⳇsymd: SimpleYYYYMMDD = (date_upper_boundⳇₓyear * 10000) + 101 // photos taken "next" year can only happen during new year eve
assert(date_upper_boundⳇsymd >= date_lower_boundⳇsymd, 'higher >= lower 2')

const max_event_durationⳇₓday = 28

export const get_params = memoize_once(function get_params(): Params {
	return {
		date_lower_boundⳇₓyear: date_lower_boundⳇₓyear,
		date_upper_boundⳇₓyear: date_upper_boundⳇₓyear,
		date_lower_boundⳇsymd: date_lower_boundⳇsymd,
		date_upper_boundⳇsymd: date_upper_boundⳇsymd,
		max_event_durationⳇₓday: max_event_durationⳇₓday,

		root: path.normalize(`/Users/${process.env.USER}/Documents/Memories`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/- TEST photos sorter/- sorted`), // LOCAL TEST, DON'T COMMIT
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/- TEST photos sorter/- notes`), // LOCAL TEST, DON'T COMMIT
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/- inbox`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--1980/- 1981`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2000/- 2000`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2000/- 2001`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2000/- 2009`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2010`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2011`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2013`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2014`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2015`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2016`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2017`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2018`),
		//root: path.normalize(`/Users/${process.env.USER}/Dropbox/…documents/…memories/…me/…circa--2010/- 2019`),

		...(false // WARNING true = local execution on author's machine, WARNING don't commit "true"
			? {
					//dry_run: true,
					dry_run: false,
					//expect_perfect_state: true, // true = expect to be the 1st execution, no file should be already normalized
					expect_perfect_state: false,
				}
			: {
					// nominal case for prod and unit tests
					dry_run: false,
					expect_perfect_state: false,
				}
		),

		extensions_to_normalize‿lc: Object.fromEntries(Object.entries({
			'.jpeg': '.jpg',
			'.tiff': '.tif',
		}).map(([ from, to ]) => [ from.toLowerCase(), to.toLowerCase() ])),

		extensions_of_media_files‿lc: [
			...EXIF_POWERED_FILE_EXTENSIONS_LC,
			'.3gp', // videos taken with my old Palm
			'.avi', // old videos
			'.bmp',
			'.bmp',
			'.gif',
			'.m4a',
			'.m4v',
			'.mp3',
			'.mpg', // seen
			'.mts', //  AVCHD (Advanced Video Coding High Definition) video file shoot by typical camcorders https://docs.fileformat.com/video/mts
			'.pct', // an old apple format https://fileinfo.com/extension/pct
			'.png',
			'.psd', // photoshop https://fileinfo.com/extension/psd
			'.psp', // Paint Shop Pro (seen screens from Warcraft III in this format)
			'.tga', // WoW screens
			'.vtt', // transcripts files going together with a video
			'.wav',
			'.wmv',

			// TODO one day see if we can scavenge a creation date from advance formats?
			'.pdf', // often hold memories as well
			'.txt', // used to take notes
			'.doc', '.docx', '.ppt', '.pptx', // MSOffice = often hold memories as well
			'.odt', // LibreOffice, same
			'.rtf',
		].map(s => s.toLowerCase()),

		extensions_to_delete‿lc: [
			'.AAE',
			'.thm', // thumbnails https://fileinfo.com/extension/thm
		].map(s => s.toLowerCase()),

		worthless_file_basenames‿lc: [
			'.DS_Store',
			'.picasa.ini',
			'pspbrwse.jbf', // paint shop pro
			'Thumbs.db',
		].map(s => s.toLowerCase()),

		default_timezones: [
			// if no time zone, infer it according to this timetable
			// Expected to be in order
			// REMINDER month = 0-based
			{
				date_utc_ms: Number(Date.UTC(date_lower_boundⳇₓyear, 0)),
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
				date_utc_ms: Number(Date.UTC(2015, 4, 19, 11)),
				new_default: 'America/Sao_Paulo',
			},
			{
				date_utc_ms: Number(Date.UTC(2015, 5, 14, 21)),
				new_default: TZONE_FR,
			},
			{
				date_utc_ms: Number(Date.UTC(2017, 6, 14)),
				new_default: TZONE_AU,
			},
		].sort((a, b) => a.date_utc_ms - b.date_utc_ms),
	}
})

/////////////////////////////////////////////////

export function get_default_timezone(date_utc_ms: TimestampUTCMs, PARAMS: Immutable<Params> = get_params()): TimeZone {
	//console.log('get_default_timezone()', { date_utc_ms, PARAMS })

	let res: TimeZone = _UNSAFE_CURRENT_SYSTEM_TIMEZONE
	const change_after = PARAMS.default_timezones.find(tz_change => {
		//console.log('candidate', { tz_change })
		if (date_utc_ms >= tz_change.date_utc_ms) {
			res = tz_change.new_default
			//console.log({ res })
			return false // not sure we found the last
		}

		return true
	})

	if (!change_after && res !== _UNSAFE_CURRENT_SYSTEM_TIMEZONE) {
		logger.warn(`Current default timezone from params "${res}" does not match current system timezone "${_UNSAFE_CURRENT_SYSTEM_TIMEZONE}". Is that intended?`)
	}

	//console.log('final', { res })
	return res
}

assert(get_default_timezone(+Date.now()), 'PARAMS should be correct 01a')
assert(get_default_timezone(+Date.now()) === _UNSAFE_CURRENT_SYSTEM_TIMEZONE, 'PARAMS should be correct 01b')
