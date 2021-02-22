import assert from 'tiny-invariant'
import { Tags, ExifDateTime } from 'exiftool-vendored'
import { Immutable, HashOf } from '@offirmo-private/ts-types'

import { TimeZone } from '../types'
import {
	LegacyDate,
	is_same_date_with_potential_tz_difference,
	get_human_readable_timestamp_auto,
	create_better_date_from_ExifDateTime,
	create_better_date_from_utc_tms,
	is_within_24h,
	get_embedded_timezone,
} from './better-date'
import logger from './logger'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

////////////////////////////////////

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

// undocumented in exiftool but seen in exif data and being more reliable than other fields (ex. iphone IMG_0170.MOV)
const EXIF_DATE_FIELD__CREATION_DATE = 'CreationDate' as keyof Tags

// documented but seen it very wrong in a few imgs  ex. IMG_20170124_125515_bad_exif.jpg
const EXIF_DATE_FIELD__CREATE_DATE = 'CreateDate' as keyof Tags

const EXIF_DATE_FIELDS: Array<keyof Tags> = [
	EXIF_DATE_FIELD__CREATION_DATE,

	// https://github.com/photostructure/exiftool-vendored.js#dates
	'SubSecCreateDate',
	'SubSecDateTimeOriginal',
	EXIF_DATE_FIELD__CREATE_DATE,
	//'ModifyDate',
	'DateTimeOriginal',
	//'GPSDateStamp',
	//'DateCreated',
	//'DateTimeCreated',
	//'DigitalCreationDate',
	//'DigitalCreationTime',
	'DateTimeGenerated',
	'MediaCreateDate',
	//'GPSDateTime', // seems to not be as precise TODO use it if no other valid field
	'TrackCreateDate', // seen on movies, usually == CreateDate but sometimes yields a better date
]

// we won't rely on those but we use them for cross-checks
const FS_DATE_FIELDS: Array<keyof Tags> = [
	'FileModifyDate',
	'FileAccessDate',
	'FileInodeChangeDate',
]

////////////////////////////////////

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

	if (field === 'GPSDateTime' && exiftool_date.tzoffsetMinutes === 0) {
		// "GPSDateTime" seems to always be in UTC. If we inferred a TZ, try to enrich it
		const tz = exif_data.tz
		if (tz) {
			DEBUG && console.log(`  - ${field}: reparsing with better tz…`, { tz })
			assert(raw_exiftool_date.rawValue, 'exif date has raw value')
			const reparsed_exiftool_date = ExifDateTime.fromEXIF(raw_exiftool_date.rawValue, tz)
			assert(reparsed_exiftool_date, 'reparsed date success')
			exiftool_date = reparsed_exiftool_date
		}
	}

	if (exiftool_date.tzoffsetMinutes === undefined) {
		DEBUG && console.warn(`_get_valid_exifdate_field("${field}"): missing tz…`, { SourceFile, field })
		// TODO find a real example of a tz fixable with this method
		// we'd rather not botcher things without it.
		/*
		const auto_tz = exif_data.tz
			? exif_data.tz
			: undefined //get_default_timezone(get_timestamp_ms_from_ExifDateTime(exiftool_date))
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

function _intelligently_get_earliest_defined_date_from_selected_fields_of_exif_data(fields: Array<keyof Tags>, exif_data: Immutable<Tags>, { DEBUG }: { DEBUG: boolean }): ExifDateTime | undefined {
	const { SourceFile } = exif_data
	DEBUG && console.log(`_get_earliest_defined_date_from_selected_fields_of_exif_data() starting…`, { SourceFile })

	const now_legacy = new LegacyDate()
	DEBUG && console.log(`- FYI`, { fields, exif_tz: exif_data.tz, now_legacy })

	DEBUG && console.log('- filtering defined candidates…')
	// TODO we could also give priority to dates having a tz, however never seen a real case of mixing tz / non tz
	// TODO we could also give priority to dates matching the fs
	const candidate_exifdates: HashOf<ExifDateTime> = fields.reduce((acc: HashOf<ExifDateTime>, field, index) => {
		DEBUG && console.log(`  - #${index}: reading "${field}"…`)

		let exiftool_date: ExifDateTime | undefined = _get_valid_exifdate_field(field, exif_data, { DEBUG })
		if (exiftool_date)
			acc[field] = exiftool_date

		return acc
	}, {} as HashOf<ExifDateTime>)

	if (Object.keys(candidate_exifdates).length === 0) {
		return undefined
	}

	DEBUG && console.log('- selecting the best candidate…')
	let min_date_origin_field: string | null = null
	let confirmation_count = 0
	const min_dateⳇexif: ExifDateTime = Object.keys(candidate_exifdates).reduce((min_dateⳇexif: ExifDateTime, field) => {
		const candidate_dateⳇexif = candidate_exifdates[field]
		const candidate_field = field // for logging

		if (!min_dateⳇexif) {
			min_date_origin_field = field
			return candidate_dateⳇexif
		}

		// select this one or keep the previous?
		const candidate_dateⳇtms = get_timestamp_ms_from_ExifDateTime(candidate_dateⳇexif)
		const min_dateⳇtms = get_timestamp_ms_from_ExifDateTime(min_dateⳇexif)
		if (candidate_dateⳇtms === min_dateⳇtms) {
			// no change TODO switch the field if better
			confirmation_count++
			return min_dateⳇexif
		}

		const is_current_date_earlier = candidate_dateⳇtms < min_dateⳇtms
		// in EXIF, some date fields are rounded to the second
		// while alternative fields are more precise
		// since 0 < xyz ms, we use a special detection to preserve the millis
		const min_has_millis = !!(min_dateⳇtms % 1000)
		const candidate_has_millis = !!(candidate_dateⳇtms % 1000)
		const is_candidate_date_same_but_more_precise =
			Math.floor(candidate_dateⳇtms/1000.) === Math.floor(min_dateⳇtms/1000.)
			&& !min_has_millis
			&& candidate_has_millis
		const is_candidate_same_but_less_precise =
			Math.floor(candidate_dateⳇtms/1000.) === Math.floor(min_dateⳇtms/1000.)
			&& min_has_millis
			&& !candidate_has_millis
		const are_within_24h = is_within_24h(candidate_dateⳇtms, min_dateⳇtms)
		DEBUG && console.log(`  - comparing to acc:`, {
			candidate_date_tms: candidate_dateⳇtms,
			min_date_tms: min_dateⳇtms,
			is_current_date_earlier,
			is_candidate_date_same_but_more_precise,
			is_candidate_same_but_less_precise,
		})
		if (!are_within_24h && !FS_DATE_FIELDS.includes(field as keyof Tags)) {
			logger.warn('Internal EXIF discrepancy', {
				SourceFile,
				candidate_field,
				min_date_origin_field,
				candidate_date_tms: candidate_dateⳇtms,
				min_date_tms: min_dateⳇtms,
				candidate_auto: get_human_readable_timestamp_auto(create_better_date_from_utc_tms(candidate_dateⳇtms, 'tz:auto'), 'tz:embedded'),
				min_auto: get_human_readable_timestamp_auto(create_better_date_from_utc_tms(min_dateⳇtms, 'tz:auto'), 'tz:embedded'),
			})
			if ([candidate_field, min_date_origin_field].includes(EXIF_DATE_FIELD__CREATE_DATE)) {
				// experimentally seen EXIF_DATE_FIELD__CREATE_DATE to be unreliable
				// we drop it under certain conditions
				logger.warn(`discarding unreliable EXIF field "${EXIF_DATE_FIELD__CREATE_DATE}" on confirmed suspicion`, {
					SourceFile,
					candidate_field,
					min_date_origin_field,
					candidate_date_tms: candidate_dateⳇtms,
					min_date_tms: min_dateⳇtms,
					candidate_auto: get_human_readable_timestamp_auto(create_better_date_from_utc_tms(candidate_dateⳇtms, 'tz:auto'), 'tz:embedded'),
					min_auto: get_human_readable_timestamp_auto(create_better_date_from_utc_tms(min_dateⳇtms, 'tz:auto'), 'tz:embedded'),
				})
				if (field === EXIF_DATE_FIELD__CREATE_DATE) {
					return min_dateⳇexif
				}
				else {
					confirmation_count = 0
					min_date_origin_field = field
					return candidate_dateⳇexif
				}
			}
		}
		if (is_candidate_date_same_but_more_precise || (is_current_date_earlier && !is_candidate_same_but_less_precise)) {
			DEBUG && console.log(`  - switching`)
			const previous_confirmation_count = confirmation_count
			confirmation_count = are_within_24h
				? confirmation_count + 1
				: 0
			if (previous_confirmation_count && !confirmation_count) {
				logger.warn('Internal EXIF abandoning a cross-confirmed date. is it correct?', {
					SourceFile,
					candidate_field,
					min_date_origin_field,
					previous_confirmation_count,
					candidate_date_tms: candidate_dateⳇtms,
					min_date_tms: min_dateⳇtms,
					candidate_auto: get_human_readable_timestamp_auto(create_better_date_from_utc_tms(candidate_dateⳇtms, 'tz:auto'), 'tz:embedded'),
					min_auto: get_human_readable_timestamp_auto(create_better_date_from_utc_tms(min_dateⳇtms, 'tz:auto'), 'tz:embedded'),
				})
			}
			min_date_origin_field = field
			return candidate_dateⳇexif
		}

		confirmation_count = are_within_24h
			? confirmation_count + 1
			: 0
		return min_dateⳇexif
	}, null as any as ExifDateTime)

	assert(min_dateⳇexif, 'min_dateⳇexif should exist since fields found')

	DEBUG && console.log(`- final result`, {
		min_dateⳇexif,
		tms: get_timestamp_ms_from_ExifDateTime(min_dateⳇexif),
		auto: get_human_readable_timestamp_auto(create_better_date_from_ExifDateTime(min_dateⳇexif), 'tz:embedded'),
	})

	assert(get_timestamp_ms_from_ExifDateTime(min_dateⳇexif) !== +now_legacy, 'coherent dates') // TODO improve test by taking the date on exec start

	return min_dateⳇexif
}

export function get_creation_date_from_exif__nocache(exif_data: Immutable<Tags>): ExifDateTime | undefined {
	const { SourceFile } = exif_data
	const DEBUG = false
	DEBUG && console.log(`get_creation_date_from_exif() starting…`, { SourceFile })

	// if only exif data was reliable… 😭😭😭
	// unfortunately we encountered several cases of the exif data being botched
	// ex. WhatsApp seems to strip or to remove the timezone
	// ex. iPhones seems to have different dates with erroneous ones
	// ex. strange cameras mixing good dates with bad ones? (suspicion)
	// In this method we try to intelligently figure out the real date.

	//console.log(exif_data)

	// unreliable in itself, but useful as a cross-validation
	const earliest_date_from_fs𖾚exif: ExifDateTime | undefined = _intelligently_get_earliest_defined_date_from_selected_fields_of_exif_data(
		FS_DATE_FIELDS,
		exif_data,
		{
			DEBUG,
		},
	)

	// this undocumented key has been seen as the most reliable in some iPhone photos,
	// however we'll cross-validate it before using it
	const date_from_CreationDate𖾚exif: ExifDateTime | undefined = _get_valid_exifdate_field(
		EXIF_DATE_FIELD__CREATION_DATE,
		exif_data,
		{
			DEBUG,
		},
	)

	// normal algorithm
	let candidate_date𖾚exif: ExifDateTime | undefined = _intelligently_get_earliest_defined_date_from_selected_fields_of_exif_data(
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
		//logger.warn('EXIF compatible file has no usable EXIF date', { SourceFile })
		return undefined
	}

	// we have candidates, let's cross-check them
	if (date_from_CreationDate𖾚exif) {
		if (!is_same_date_with_potential_tz_difference(
			get_timestamp_ms_from_ExifDateTime(candidate_date𖾚exif),
			get_timestamp_ms_from_ExifDateTime(date_from_CreationDate𖾚exif),
		)) {
			logger.warn('EXIF compatible file has EXIF dates discrepancy!', {
				SourceFile,
				candidate: _to_debug(candidate_date𖾚exif),
				from_creation_date: _to_debug(date_from_CreationDate𖾚exif),
				candidate_tms: get_timestamp_ms_from_ExifDateTime(candidate_date𖾚exif),
				from_creation_date_tms: get_timestamp_ms_from_ExifDateTime(date_from_CreationDate𖾚exif),
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
			&& is_same_date_with_potential_tz_difference(get_timestamp_ms_from_ExifDateTime(earliest_date_from_fs𖾚exif), get_timestamp_ms_from_ExifDateTime(candidate_date𖾚exif))) {
			// perfect, the FS date is perfectly matching + has a tz
			candidate_date𖾚exif = earliest_date_from_fs𖾚exif
			const bd = create_better_date_from_ExifDateTime(candidate_date𖾚exif)
			logger.info(`✔️️ recovered missing TZ thanks to fs date.`, {
				SourceFile,
				//tms1: get_timestamp_ms_from_ExifDateTime(earliest_date_from_fs𖾚exif),
				//tms2: get_timestamp_ms_from_ExifDateTime(candidate_date𖾚exif),
				tz: get_embedded_timezone(bd),
				local: get_human_readable_timestamp_auto(bd, 'tz:embedded'),
			})
		}
		else {
			DEBUG && console.warn('candidate exif date has no tz…', { SourceFile })
		}
	}

	return candidate_date𖾚exif
}
// TODO review this caching if we end up modifying the files (lossless rotation)
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

export function get_timestamp_ms_from_ExifDateTime(date_exif: Immutable<ExifDateTime>): TimestampUTCMs {
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
