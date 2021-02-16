import assert from 'tiny-invariant'
import { Tags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'

import { TimeZone } from '../types'
import { get_default_timezone } from '../params'
import {
	LegacyDate,
	is_same_date_with_potential_tz_difference,
	get_human_readable_timestamp_auto,
	create_better_date_from_ExifDateTime,
} from './better-date'
import logger from './logger'
import { TimestampUTCMs } from '@offirmo-private/timestamps'


// TODO HashOf helper type
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

const EXIF_DATE_FIELD__CREATION_DATE = 'CreationDate' as keyof Tags // not documented in exiftool but seen in exif data and being more reliable than other fields (ex. iphone IMG_0170.MOV)

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
	EXIF_DATE_FIELD__CREATION_DATE,
]
const FS_DATE_FIELDS: Array<keyof Tags> = [
	'FileModifyDate',
	'FileAccessDate',
	'FileInodeChangeDate',
]


function _get_valid_exifdate_field(field: keyof Tags, exif_data: Immutable<Tags>, { DEBUG }: { DEBUG: boolean }): undefined | ExifDateTime {
	const { SourceFile } = exif_data
	let raw_exiftool_date: undefined | any = exif_data[field]
	DEBUG && console.log(`_get_valid_exifdate_field("${field}"): raw = ${raw_exiftool_date}`)
	if (!raw_exiftool_date) return undefined

	const now_legacy = new LegacyDate()
	DEBUG && console.log(`_get_valid_exifdate_field("${field}"): FYI`, { exif_tz: exif_data.tz, now_legacy })

	// https://github.com/photostructure/exiftool-vendored.js/issues/73
	// "If date fields aren't parsable, the raw string from exiftool will be provided."
	if (typeof raw_exiftool_date === 'string') {
		// TODO log (add a onWarning param)
		logger.warn(`un-parsable exif date`, { SourceFile, field, raw_exiftool_date })
		return undefined
	}

	let exiftool_date: ExifDateTime = raw_exiftool_date
	DEBUG && console.log(`_get_valid_exifdate_field("${field}"): seems we have an ExifDateTime (pending further validation):`, {
		exiftool_date,
		...(!!exiftool_date.toDate && {
			toDate: exiftool_date.toDate(),
		}),
	})

	if (exiftool_date.tzoffsetMinutes === undefined) {
		DEBUG && console.warn(`_get_valid_exifdate_field("${field}"): missing tz…`, { SourceFile, field })
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
		assert(date && date.getFullYear, `_get_valid_exifdate_field("${field}") has correct shape (1)`)
		assert(+date, `_get_valid_exifdate_field("${field}") has correct shape (2)`)
		assert(+date < +now_legacy, `_get_valid_exifdate_field("${field}") value is ok compared to now`) // seen when recent photo and wrong default timezone => photo in the future
	}
	catch (err) {
		logger.fatal('error reading EXIF date', { SourceFile, field, klass: exiftool_date.constructor.name, date_object: exiftool_date, err })
		err.message = 'error reading EXIF date: ' + err.message
		throw err
	}

	return exiftool_date
}

function _get_earliest_defined_date_from_selected_fields_of_exif_data(fields: Array<keyof Tags>, exif_data: Immutable<Tags>, { DEBUG }: { DEBUG: boolean }): ExifDateTime | undefined {
	const { SourceFile } = exif_data
	DEBUG && console.log(`_get_earliest_defined_date_from_selected_fields_of_exif_data() starting…`, { SourceFile })

	const now_legacy = new LegacyDate()
	DEBUG && console.log(`- FYI`, { fields, exif_tz: exif_data.tz, now_legacy })

	DEBUG && console.log('- filtering defined candidates…')
	// TODO we could also give priority to dates having a tz, however never seen a real case of mixing tz / non tz
	// TODO we could also give priority to dates matching the fs
	const candidate_exifdates: ExifDateTimeHash = fields.reduce((acc: ExifDateTimeHash, field, index) => {
		DEBUG && console.log(`  - #${index}: reading "${field}"…`)

		let exiftool_date: ExifDateTime | undefined = _get_valid_exifdate_field(field, exif_data, { DEBUG })
		if (exiftool_date)
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
		// since 0 < xyz ms, we use a special detection to preserve the milis
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

	assert(get_timestamp_ms_from_exifdate(min_date_exif) !== +now_legacy, 'coherent dates') // TODO improve test by taking the date on exec start

	return min_date_exif
}

export function get_creation_date_from_exif__nocache(exif_data: Immutable<Tags>): ExifDateTime | undefined {
	const { SourceFile } = exif_data
	const DEBUG = false
	DEBUG && console.log(`get_creation_date_from_exif() starting…`, { SourceFile })

	// if only exif data was reliable…
	// unfortunately we encountered several cases of the exif data being botched
	// ex. WhatsApp seems to strip or to remove the timezone
	// ex. iPhones seems to have different dates with erroneous ones
	// In this method we try to intelligently figure out the real date.
	//console.log(exif_data)

	// unreliable in itself, but useful as a cross-validation
	const earliest_date_from_fs𖾚exif: ExifDateTime | undefined = _get_earliest_defined_date_from_selected_fields_of_exif_data(
		FS_DATE_FIELDS,
		exif_data,
		{
			DEBUG,
		},
	)

	// this undocumented key has been seen as the most reliable in some iPhone photos,
	// however we'll validate that
	const date_from_CreationDate𖾚exif: ExifDateTime | undefined = _get_valid_exifdate_field(
		EXIF_DATE_FIELD__CREATION_DATE,
		exif_data,
		{
			DEBUG,
		},
	)

	// normal algorithm
	let candidate_date𖾚exif: ExifDateTime | undefined = _get_earliest_defined_date_from_selected_fields_of_exif_data(
		EXIF_DATE_FIELDS,
		exif_data,
		{
			DEBUG,
		},
	)

	if (!candidate_date𖾚exif) {
		// no date in EXIF Data.
		// seen happening on
		// - edited jpg
		// - imaged received through WhatsApp then saved = exif dates are stripped
		// TODO add to file log
		logger.warn('EXIF compatible file has no usable EXIF date', { SourceFile })
		return undefined
	}

	// we have candidates, let's cross-check them
	if (date_from_CreationDate𖾚exif) {
		if (!is_same_date_with_potential_tz_difference(
			get_timestamp_ms_from_exifdate(candidate_date𖾚exif),
			get_timestamp_ms_from_exifdate(date_from_CreationDate𖾚exif),
		)) {
			logger.warn('EXIF compatible file has EXIF dates discrepancy!', {
				SourceFile,
				candidate: _to_debug(candidate_date𖾚exif),
				from_creation_date: _to_debug(date_from_CreationDate𖾚exif),
				candidate_tms: get_timestamp_ms_from_exifdate(candidate_date𖾚exif),
				from_creation_date_tms: get_timestamp_ms_from_exifdate(date_from_CreationDate𖾚exif),
			})
			// we have seen CreationDate to be more reliable
			candidate_date𖾚exif = date_from_CreationDate𖾚exif
		}
	}

	if (candidate_date𖾚exif.tzoffsetMinutes === undefined) {
		// seen in WhatsApp movies (.mov, .mp4)
		// the exif date is propagated but the timezone is stripped, leading to a wrong date
		// HOWEVER the file date happens to be correct. Attempt to fix the exif date that way...

		if (earliest_date_from_fs𖾚exif && earliest_date_from_fs𖾚exif.tzoffsetMinutes !== undefined
			&& is_same_date_with_potential_tz_difference(get_timestamp_ms_from_exifdate(earliest_date_from_fs𖾚exif), get_timestamp_ms_from_exifdate(candidate_date𖾚exif))) {
			// perfect, the FS date is perfectly matching + has a tz
			logger.info(`✔️️ recovered missing TZ thanks to fs date.`, {
				SourceFile,
				//tms1: get_timestamp_ms_from_exifdate(earliest_date_from_fs𖾚exif),
				//tms2: get_timestamp_ms_from_exifdate(candidate_date𖾚exif),
			})
			candidate_date𖾚exif = earliest_date_from_fs𖾚exif
		}
		else {
			DEBUG && console.warn('candidate exif date has no tz…', { SourceFile })
		}
	}

	return candidate_date𖾚exif
}
// TODO review if we end up modifying the files (lossless rotation)
const _cache: { [sf: string]: ExifDateTime | undefined } = {}
export function get_creation_date_from_exif(exif_data: Immutable<Tags>): ExifDateTime | undefined {
	const { SourceFile } = exif_data
	assert(SourceFile, `get_creation_date_from_exif() exif data should have SourceFile`)

	if (!_cache[SourceFile])
		_cache[SourceFile] = get_creation_date_from_exif__nocache(exif_data)

	return _cache[SourceFile]
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

function _to_debug(date_exif: Immutable<ExifDateTime>): string {
	return get_human_readable_timestamp_auto(
		create_better_date_from_ExifDateTime(
			date_exif
		),
		'tz:embedded',
	)
}
