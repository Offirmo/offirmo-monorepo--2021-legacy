import assert from 'tiny-invariant'
import { Tags, ExifDateTime } from 'exiftool-vendored'

import { TimeZone } from '../types'
import logger from './logger'


type DateHash = { [k: string]: Date }


const EXIF_DATE_FIELDS: string[] = [
	// https://github.com/photostructure/exiftool-vendored.js#dates
	'CreateDate',
	'ModifyDate',
	'DateTimeOriginal',
	//'GPSDateStamp',
	//'DateCreated',
	//'DateTimeCreated',
	//'DigitalCreationDate',
	//'DigitalCreationTime',
	'DateTimeGenerated',
	'MediaCreateDate',
]

export function get_creation_date_from_exif(exif_data: Readonly<Tags>, default_zone?: string): Date | null {
	const now = new Date()
	let min_date = now
	const candidate_dates_ms: DateHash = EXIF_DATE_FIELDS.reduce((acc: DateHash, field: string) => {
		let exiftool_date: undefined | ExifDateTime = (exif_data as any)[field]
		if (!exiftool_date) return acc
		if ((exiftool_date as any) === '0000:00:00 00:00:00') {
			// https://github.com/photostructure/exiftool-vendored.js/issues/73
			// TODO log (add a onWrning param)
			logger.warn(`unparsable exif date: "${exiftool_date as any}"`)
			return acc
		}

		if (!exif_data.tz && default_zone) {
			//console.log('reparse')
			assert(exiftool_date.rawValue, 'get_creation_date_from_exif date has raw value')
			exiftool_date = ExifDateTime.fromEXIF(exiftool_date.rawValue, default_zone)
			assert(exiftool_date, 'reparsed date success')
		}

		try {
			const date = exiftool_date.toDate()
			assert(date, 'exif date from field is ok')
			assert(+date, 'exif date from field is ok (ts)')
			assert(+date < +now, 'exif date from field is ok (now)') // seen when recent photo and wrong default timezone = photo in the future
			//console.log('⏳ found date field', field, exiftool_date)
		}
		catch (err) {
			logger.fatal('error reading EXIF date', { field, klass: exiftool_date.constructor.name, date_object: exiftool_date, err })
			err.message = 'error reading EXIF date: ' + err.message
			throw err
		}

		let date = exiftool_date.toDate()

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

		acc[field] = date
		/*console.log({
			d: +date,
			md: +min_date,
		})*/
		min_date = (+date < +min_date) ? date : min_date
		return acc
	}, {} as DateHash)

	if (Object.keys(candidate_dates_ms).length === 0) {
		// seen happening on edited jpg
		// TODO add to file log
		// TODO log
		logger.warn('EXIF compatible file has no usable EXIF date')
		return null
	}

	//console.log({ min_date_ms: get_human_readable_UTC_timestamp_seconds(new Date(min_date_ms)) })

	//assert(min_date_ms !== now, 'coherent dates')

	return min_date

}

export function get_time_zone_from_exif(exif_data: Readonly<Tags>): TimeZone | undefined {
	const res = exif_data.tz
	assert(typeof res === 'string' || typeof res === 'undefined', 'exif_data.tz type check')
	return res
}
