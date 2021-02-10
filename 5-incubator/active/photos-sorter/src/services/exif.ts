import assert from 'tiny-invariant'
import { Tags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'

import { TimeZone } from '../types'
import { get_default_timezone } from '../params'
import { LegacyDate, is_same_date_with_potential_tz_difference } from './better-date'
import logger from './logger'
import { TimestampUTCMs } from '@offirmo-private/timestamps'


type ExifDateTimeHash = { [k: string]: ExifDateTime }


/** ☆☆☆☆ ✔ Example: 1 */
//TimeZoneOffset?: number;
/** ★★★★ ✔ Example: 2218-09-22T02:32:14.000 */
//CreateDate?: ExifDateTime;
/** ★★★★ ✔ Example: 2218-09-22T02:32:14.000 */
//DateTimeOriginal?: ExifDateTime;
/** ☆☆☆☆ ✔ Example: 2020-07-08 */
//GPSDateStamp?: ExifDate;
/** ☆☆☆☆   Example: 2006-12-19 */
//DateCreated?: ExifDate;
/** ☆☆☆☆ ✔ Example: 2019-07-20T19:21:25.000-07:00 */
//DateTimeCreated?: ExifDateTime;
/** ☆☆☆☆ ✔ Example: 2019-05-25 */
//DigitalCreationDate?: ExifDate;
/** ☆☆☆☆ ✔ Example: 13:39:28 */
//DigitalCreationTime?: ExifTime;
/** ☆☆☆☆   Example: 2013-03-12T16:31:26.000 */
//DateTimeGenerated?: ExifDateTime;
/** ☆☆☆☆ ✔ Example: 2017-02-12T10:28:20.000 */
//MediaCreateDate?: ExifDateTime;
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
	//'GPSDateTime' No! seems to be UTC = makes it tricky to use correctly. NTH support this later if deemed useful
	'TrackCreateDate', // seen on movies, usually == CreateDate
	'CreationDate' as keyof Tags, // not documented in exiftool but seen in exif data and being more reliable than other fields (iphone IMG_0170.MOV)
]
const FS_DATE_FIELDS: Array<keyof Tags> = [
	'FileModifyDate',
	'FileAccessDate',
	'FileInodeChangeDate',
]

function _get_earliest_defined_date_from_selected_fields_of_exif_data(fields: Array<keyof Tags>, exif_data: Immutable<Tags>, { DEBUG, filename_for_debug}: { DEBUG: boolean, filename_for_debug: string }): ExifDateTime | undefined {
	DEBUG && console.log(`_get_earliest_defined_date_from_selected_fields_of_exif_data() starting on "${filename_for_debug}"…`)

	const now_legacy = new LegacyDate()
	DEBUG && console.log(`- FYI`, { fields, exif_tz: exif_data.tz, now_legacy })

	DEBUG && console.log('- filtering defined candidates…')
	const candidate_exifdates: ExifDateTimeHash = fields.reduce((acc: ExifDateTimeHash, field, index) => {
		let raw_exiftool_date: undefined | any = exif_data[field]
		DEBUG && console.log(`  - #${index}: "${field}" raw = ${raw_exiftool_date}`)
		if (!raw_exiftool_date) return acc

		// https://github.com/photostructure/exiftool-vendored.js/issues/73
		// "If date fields aren't parsable, the raw string from exiftool will be provided."
		if (typeof raw_exiftool_date === 'string') {
			// TODO log (add a onWarning param)
			logger.warn(`un-parsable exif date`, { raw_exiftool_date, filename_for_debug })
			return acc
		}

		let exiftool_date: ExifDateTime = raw_exiftool_date
		DEBUG && DEBUG && console.log(`  - #${index}: seems we have an ExifDateTime (pending further validation):`, {
			exiftool_date,
			...(!!exiftool_date.toDate && {
				toDate: exiftool_date.toDate(),
			}),
		})

		if (exiftool_date.tzoffsetMinutes === undefined) {
			DEBUG && console.warn(`  - #${index}: missing tz…`)
			// TODO find a real example of a tz fixable with this method
			// we'd rather not botcher things without it.
			/*
			const auto_tz = exif_data.tz
				? exif_data.tz
				: undefined //get_default_timezone(get_timestamp_ms_from_exifdate(exiftool_date))
			if (auto_tz) {
				DEBUG && console.log(`  - #${index}: reparsing with better tz…`, { auto_tz })
				assert(raw_exiftool_date.rawValue, 'exif date has raw value')
				const reparsed_exiftool_date = ExifDateTime.fromEXIF(raw_exiftool_date.rawValue, auto_tz)
				assert(reparsed_exiftool_date, 'reparsed date success')
				exiftool_date = reparsed_exiftool_date
			}*/
		}

		// further validate the date
		try {
			const date = exiftool_date.toDate()
			assert(date && date.getFullYear, 'exif date from exif field is ok')
			assert(+date, 'exif date from field is ok (ts)')
			assert(+date < +now_legacy, 'exif date value is ok compared to now') // seen when recent photo and wrong default timezone => photo in the future
		}
		catch (err) {
			logger.fatal('error reading EXIF date', { field, klass: exiftool_date.constructor.name, date_object: exiftool_date, err })
			err.message = 'error reading EXIF date: ' + err.message
			throw err
		}

		acc[field] = exiftool_date
		return acc
	}, {} as ExifDateTimeHash)

	if (Object.keys(candidate_exifdates).length === 0) {
		return undefined
	}

	DEBUG && console.log('- selecting the best candidate…')
	//let min_date_legacy = now_legacy // for now
	const min_date_exif: ExifDateTime = Object.keys(candidate_exifdates).reduce((min_date_exif: ExifDateTime, field) => {
		const candidate_date_exif = candidate_exifdates[field]

		if (!min_date_exif) {
			return candidate_date_exif
		}

		// select this one or keep the previous?
		const candidate_date_tms = get_timestamp_ms_from_exifdate(candidate_date_exif)
		const min_date_tms = get_timestamp_ms_from_exifdate(min_date_exif)
		if (candidate_date_tms === min_date_tms) {
			return min_date_exif
		}

		const is_current_date_earlier = candidate_date_tms < min_date_tms
		// in EXIF, some date fields are rounded to the second
		// while alternative fields are more precise
		// since 0 < xxx ms, we use a special detection to preserve the milis
		const min_has_millis = !!(min_date_tms % 1000)
		const current_has_millis = !!(candidate_date_tms % 1000)
		const is_current_date_same_but_more_precise =
			Math.floor(candidate_date_tms/1000.) === Math.floor(min_date_tms/1000.)
			&& !min_has_millis
			&& current_has_millis
		const is_current_date_earlier_but_less_precise =
			Math.floor(candidate_date_tms/1000.) === Math.floor(min_date_tms/1000.)
			&& min_has_millis
			&& !current_has_millis
		DEBUG && console.log(`  - comparing to acc:`, {
			candidate_tms: candidate_date_tms,
			min_date_tms,
			is_current_date_earlier,
			is_current_date_same_but_more_precise,
			is_current_date_earlier_but_less_precise,
		})
		if (is_current_date_same_but_more_precise || (is_current_date_earlier && !is_current_date_earlier_but_less_precise)) {
			DEBUG && console.log(`  - switching`)
			return candidate_date_exif
		}

		DEBUG && console.log({ date_tms: candidate_date_tms, min_date_tms })

		return min_date_exif
	}, null as any as ExifDateTime)

	assert(min_date_exif, 'min_date_exif should exist since fields found')

	DEBUG && console.log(`- final result`, {
		exif_date: min_date_exif,
		tms: get_timestamp_ms_from_exifdate(min_date_exif),
	})

	assert(get_timestamp_ms_from_exifdate(min_date_exif) !== +now_legacy, 'coherent dates')

	return min_date_exif
}


// TODO should default_zone be dynamic? Most likely yes
const _exif_warning: { [k: string]: boolean } = {}
export function get_creation_date_from_exif(filename_for_debug: string, exif_data: Immutable<Tags>): ExifDateTime | undefined {
	const DEBUG = false
	DEBUG && console.log(`get_creation_date_from_exif() starting on "${filename_for_debug}"…`)

	let min_date_exif: ExifDateTime | undefined = _get_earliest_defined_date_from_selected_fields_of_exif_data(
		EXIF_DATE_FIELDS,
		exif_data,
		{
			DEBUG,
			filename_for_debug,
		},
	)

	if (!min_date_exif) {
		// seen happening on
		// - edited jpg
		// - imaged received through WhatsApp then saved = exif dates are stripped
		// TODO add to file log
		if (!_exif_warning[filename_for_debug]) {
			logger.warn('EXIF compatible file has no usable EXIF date', { filename_for_debug })
			_exif_warning[filename_for_debug] = true
		}
		return undefined
	}

	if (min_date_exif.tzoffsetMinutes === undefined) {
		DEBUG && console.warn('exif date has no tz, attempting improvement…')
		// seen in WhatsApp movies (.mov, .mp4)
		// the exif date is propagated but the timezone is stripped, leading to a wrong date
		// HOWEVER the file date happens to be correct. Attempt to fix the exif date that way...
		const min_date_from_fs_exif: ExifDateTime | undefined = _get_earliest_defined_date_from_selected_fields_of_exif_data(
			FS_DATE_FIELDS,
			exif_data,
			{
				DEBUG,
				filename_for_debug,
			},
		)
		if (min_date_from_fs_exif && min_date_from_fs_exif.tzoffsetMinutes !== undefined) {
			if (is_same_date_with_potential_tz_difference(get_timestamp_ms_from_exifdate(min_date_from_fs_exif), get_timestamp_ms_from_exifdate(min_date_exif))) {
				// perfect, the FS date is perfectly matching + has a tz
				logger.info(`✔️✔️✔️ recovered missing TZ thanks to fs date.`, {
					filename_for_debug,
					//tms1: get_timestamp_ms_from_exifdate(min_date_from_fs_exif),
					//tms2: get_timestamp_ms_from_exifdate(min_date_exif),
				})
				min_date_exif = min_date_from_fs_exif
			}
		}
	}


	return min_date_exif
}

export function get_creation_timezone_from_exif(exif_data: Immutable<Tags>): TimeZone | undefined {
	const res = exif_data.tz
	assert(typeof res === 'string' || typeof res === 'undefined', 'exif_data.tz type check')
	return res
}

// there are several orientation fields, provision for the future
export function get_orientation_from_exif(exif_data: Immutable<Tags>): number | undefined {
	return exif_data.Orientation
}

export function get_timestamp_ms_from_exifdate(date_exif: Immutable<ExifDateTime>): TimestampUTCMs {
	const date_legacy = date_exif.toDate()
	return +date_legacy
}
