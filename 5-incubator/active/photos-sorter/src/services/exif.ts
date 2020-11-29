import assert from 'tiny-invariant'
import { Tags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'

import { TimeZone } from '../types'
import {
	LegacyDate,
} from './better-date'
import logger from './logger'


type ExifDateTimeHash = { [k: string]: ExifDateTime }


const EXIF_DATE_FIELDS: Array<keyof Tags> = [
	// https://github.com/photostructure/exiftool-vendored.js#dates
	'SubSecCreateDate',
	'SubSecDateTimeOriginal',
	'CreateDate',
	//'ModifyDate',
	'DateTimeOriginal',
	//'GPSDateStamp',
	//'DateCreated',
	//'DateTimeCreated',
	//'DigitalCreationDate',
	//'DigitalCreationTime',
	'DateTimeGenerated',
	'MediaCreateDate',
	//'GPSDateTime' No! seems to be UTC = makes it tricky to use correctly. TODO support this later if deemed useful
]

// TODO should default_zone be dynamic? Most likely yes
export function get_creation_date_from_exif(filename_for_debug: string, exif_data: Immutable<Tags>, default_zone?: string): ExifDateTime | undefined {
	const now_legacy = new LegacyDate()
	let min_date_legacy = now_legacy // for now
	let min_date_exif: ExifDateTime | undefined = undefined

	const candidate_exifdates: ExifDateTimeHash = EXIF_DATE_FIELDS.reduce((acc: ExifDateTimeHash, field) => {
		let raw_exiftool_date: undefined | any = exif_data[field]
		if (!raw_exiftool_date) return acc

		// https://github.com/photostructure/exiftool-vendored.js/issues/73
		// "If date fields aren't parsable, the raw string from exiftool will be provided."
		if (typeof raw_exiftool_date === 'string') {
			// TODO log (add a onWarning param)
			logger.warn(`un-parsable exif date`, { raw_exiftool_date, filename_for_debug })
			return acc
		}

		let exiftool_date: ExifDateTime = raw_exiftool_date
		if (!exif_data.tz && default_zone) {
			//console.log('reparse with better tz')
			assert(raw_exiftool_date.rawValue, 'get_creation_date_from_exif date has raw value')
			const reparsed_exiftool_date = ExifDateTime.fromEXIF(raw_exiftool_date.rawValue, default_zone)
			assert(reparsed_exiftool_date, 'reparsed date success')
			exiftool_date = reparsed_exiftool_date
		}
		assert(exiftool_date, 'exif date success')

		/*console.log({
			exiftool_date,
			rawValue: exiftool_date?.rawValue,
			...(!!exiftool_date.toDate && {
				toDate: exiftool_date.toDate(),
			}),
			default_zone,
			exif_tz: exif_data.tz,
		})*/

		try {
			const date = exiftool_date.toDate()
			//console.log('candidate date from exif:', date)
			assert(date && date.getFullYear, 'exif date from exif field is ok')
			assert(+date, 'exif date from field is ok (ts)')
			assert(+date < +now_legacy, 'exif date from field is ok (now)') // seen when recent photo and wrong default timezone => photo in the future
			//console.log('⏳ found date field', field, exiftool_date)
		}
		catch (err) {
			logger.fatal('error reading EXIF date', { field, klass: exiftool_date.constructor.name, date_object: exiftool_date, err })
			err.message = 'error reading EXIF date: ' + err.message
			throw err
		}

		acc[field] = exiftool_date

		let date_legacy = exiftool_date.toDate()

		/*
		// adjust timezone info
		// the lib is doing some timezone computations we disagree with
		// https://github.com/photostructure/exiftool-vendored.js#dates
		const tz_offset_min = exiftool_date.tzoffsetMinutes || -(new Date()).getTimezoneOffset()
		// we are interested in the TZ date, so cancel the GMT-isation
		tms = tms + tz_offset_min * 60 * 1000
		if (id === DEBUG_ID) {
			console.log({
				exiftool_date,
				date: exiftool_date.toDate(),
				tms0: +exiftool_date.toDate(),
				tz_offset_min,
				tms,
			})
			//throw new Error('STOP!')
		}*/

		const date_tms = +date_legacy
		const min_date_tms = +min_date_legacy
		const is_current_date_earlier = date_tms < min_date_tms
		// in EXIF, some date fields are rounded to the second
		// while alternative fields are more precise
		// since 0 < xxx ms, we use a special detection to preserve the milis
		const min_has_milis = !!(min_date_tms % 1000)
		const current_has_millis = !!(date_tms % 1000)
		const is_current_date_same_but_more_precise =
			Math.floor(date_tms/1000.) === Math.floor(min_date_tms/1000.)
			&& !min_has_milis
			&& current_has_millis
		const is_current_date_earlier_but_less_precise =
			Math.floor(date_tms/1000.) === Math.floor(min_date_tms/1000.)
			&& min_has_milis
			&& !current_has_millis
		/*console.log({
			field,
			cd: date_tms,
			md: +min_date_legacy,
			is_current_date_earlier,
			is_current_date_same_but_more_precise,
			is_current_date_earlier_but_less_precise,
		})*/
		if (is_current_date_same_but_more_precise || (is_current_date_earlier && !is_current_date_earlier_but_less_precise)) {
			min_date_legacy = date_legacy
			min_date_exif = exiftool_date
		}

		//console.log({ date, min_date })
		return acc
	}, {} as ExifDateTimeHash)

	if (Object.keys(candidate_exifdates).length === 0) {
		// seen happening on edited jpg
		// TODO add to file log
		// TODO log
		logger.warn('EXIF compatible file has no usable EXIF date', { filename_for_debug })
		return undefined
	}
	assert(min_date_exif, 'min_date_exif should exist since fields found')

	//console.log({ min_date_ms: get_human_readable_UTC_timestamp_seconds(new Date(min_date_ms)) })

	//assert(min_date_ms !== now, 'coherent dates')

	return min_date_exif
}

export function get_creation_timezone_from_exif(exif_data: Immutable<Tags>): TimeZone | undefined {
	const res = exif_data.tz
	assert(typeof res === 'string' || typeof res === 'undefined', 'exif_data.tz type check')
	return res
}
