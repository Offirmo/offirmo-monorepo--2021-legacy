import path from 'path'
import fs from 'fs'

import stylize_string from 'chalk'
import assert from 'tiny-invariant'
import { Tags, ExifDateTime } from 'exiftool-vendored'
import { TimestampUTCMs, get_UTC_timestamp_ms, get_human_readable_UTC_timestamp_seconds } from '@offirmo-private/timestamps'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { EXIF_POWERED_FILE_EXTENSIONS } from '../consts'
import { Basename, RelativePath } from '../types'
import { get_params } from '../params'
import { get_compact_date_from_UTC_ts } from '../services/utils'
import logger from '../services/logger'
import { starts_with_human_timestamp_ms } from '../services/matchers'
import { parse as parse_name, ParseResult, extract_compact_date } from '../services/name_parser'
import { get_human_readable_timestamp_auto } from '../services/date_generator'

type TimestampsHash = { [k: string]: TimestampUTCMs }

export interface State {
	id: RelativePath
	is_eligible: boolean

	exif_data: undefined | null | Tags
	fs_stats: undefined | null | fs.Stats
	parsed_original_basename: ParseResult

	original_id: RelativePath

	cached: {
		parsed_path: path.ParsedPath,
		best_creation_date_ms?: TimestampUTCMs
		hash?: never // TODO for dedupe
	}
}

////////////////////////////////////

const LIB = '🖼'

const PARAMS = get_params()

const EXIF_DATE_FIELDS: string[] = [
	'CreateDate',
	'DateTimeOriginal',
	//'GPSDateStamp',
	//'DateCreated',
	//'DateTimeCreated',
	//'DigitalCreationDate',
	//'DigitalCreationTime',
	'DateTimeGenerated',
	'MediaCreateDate',
]

///////////////////// ACCESSORS /////////////////////

export function is_eligible_media_file(id: RelativePath, parsed: path.ParsedPath = path.parse(id)): boolean {
	//logger.trace(`is_eligible_media_file...`, { id })

	if (parsed.base.startsWith('.')) return false
	if (!PARAMS.media_files_extensions.includes(parsed.ext.toLowerCase())) return false

	return true
}

export function get_parent_folder_id(state: Readonly<State>): RelativePath {
	return state.cached.parsed_path.dir || '.'
}

export function get_basename(state: Readonly<State>): Basename {
	return state.cached.parsed_path.base
}

// TODO compare function for dedupe
/*export function is_equal(state_l: Readonly<State>, state_r: Readonly<State>): boolean {
	// TODO compare exif size and data
	throw new Error('NIMP!')
}*/

export function has_all_infos_for_extracting_the_creation_date(state: Readonly<State>): boolean {
	return !!state.cached.best_creation_date_ms
		|| (state.exif_data !== undefined && state.fs_stats !== undefined)
}

function _get_creation_date_from_basename({ parsed_original_basename }: Readonly<State>): TimestampUTCMs | null {
	return parsed_original_basename.timestamp_ms || null
}
function _get_creation_date_from_fs_stats({ fs_stats }: Readonly<State>): TimestampUTCMs {
	assert(fs_stats !== undefined, 'fs stats read ✔')
	assert(fs_stats, 'fs stats ok ✔')

	// fs stats are unreliable for some reasons.
	const { birthtimeMs, atimeMs, mtimeMs, ctimeMs } = fs_stats!
	return Math.round(
		Math.min(
			...[birthtimeMs, atimeMs, mtimeMs, ctimeMs].filter(d => !!d)
		)
	)
}
const DEBUG_ID = '- inbox/20011101 - le hamster/Le studieux hamster 2.jpg'
function _get_creation_date_from_exif({ id, exif_data, cached }: Readonly<State>): TimestampUTCMs | null {
	assert(exif_data !== undefined, `${id}: exif data read`)

	if (!EXIF_POWERED_FILE_EXTENSIONS.includes(cached.parsed_path.ext.toLowerCase())) {
		// exif reader manage to put some stuff, but it's not interesting
		return null
	}

	if (id === DEBUG_ID) {
		console.log('\n\n------------\n\n')
	}

	try {
		const now = get_UTC_timestamp_ms()
		let min_date_ms = now
		const candidate_dates_ms: TimestampsHash = EXIF_DATE_FIELDS.reduce((acc: TimestampsHash, field: string) => {
			const date_object: undefined | ExifDateTime  = (exif_data as any)[field]
			if (!date_object) return acc
			if ((date_object as any) === '0000:00:00 00:00:00') return acc // https://github.com/photostructure/exiftool-vendored.js/issues/73

			try {
				const tms = +date_object.toDate()
			}
			catch (err) {
				logger.fatal('error reading EXIF date', { field, klass: date_object.constructor.name, date_object, err })
				throw err
			}

			let tms = date_object.millis
				? Math.round(date_object.millis)
				: +date_object.toDate()

			if (!tms) {
				logger.error('exif tms null!', {field, tod: date_object.toDate(), milli: +date_object.toDate(), date_object})
				assert(tms, 'exif tms not null')
			}

			assert(tms, 'exif dates should have milli')

			// adjust timezone info
			// the lib is doing some timezone computations we disagree with
			// https://github.com/photostructure/exiftool-vendored.js#dates
			const tz_offset_min = date_object.tzoffsetMinutes || -(new Date()).getTimezoneOffset()
			// we are interested in the TZ date, so cancel the GMT-isation
			tms = tms + tz_offset_min * 60 * 1000

			if (id === DEBUG_ID) {
				console.log({
					date_object,
					date: date_object.toDate(),
					tms0: +date_object.toDate(),
					tz_offset_min,
					tms,
				})
				//throw new Error('STOP!')
			}

			acc[field] = tms
			min_date_ms = Math.min(min_date_ms, tms)
			return acc
		}, {} as TimestampsHash)

		if (Object.keys(candidate_dates_ms).length === 0) {
			// seen happening on edited jpg
			logger.warn('EXIF compatible file has no usable EXIF date', {
				id,
			})
			return null
		}

		//console.log({ min_date_ms: get_human_readable_UTC_timestamp_seconds(new Date(min_date_ms)) })

		assert(min_date_ms !== now, 'coherent dates')

		return min_date_ms
	}
	catch (err) {
		logger.fatal(`error extracting date from exif for "${id}"!`, { err })
		throw err
	}
}
const DAY_IN_MILLIS = 24 * 60 * 60 * 1000
export function get_best_creation_date_ms(state: Readonly<State>): TimestampUTCMs {
	if (state.cached.best_creation_date_ms)
		return state.cached.best_creation_date_ms

	const from_basename = _get_creation_date_from_basename(state)
	// even if we have a date from name,
	// the exi/fs one may be more precise,
	// so let's continue

	try {
		const from_exif = _get_creation_date_from_exif(state)
		if (from_exif) {
			if (from_basename) {
				const auto_from_basename = get_human_readable_timestamp_auto(from_basename)
				const auto_from_exif = get_human_readable_timestamp_auto(from_exif)

				if (auto_from_exif.startsWith(auto_from_basename))
					return from_exif // perfect match, EXIF more precise

				// date from the basename always takes precedence,

				if (Math.abs(from_exif - from_basename) >= DAY_IN_MILLIS) {
					// however this is suspicious
					logger.warn('exif/basename dates discrepancy', {
						id: state.id,
						from_basename,
						auto_from_basename,
						from_exif,
						auto_from_exif,
					})
				}

				return from_basename
			}

			return from_exif
		}

		const from_fs = _get_creation_date_from_fs_stats(state)
		if (from_basename) {
			const auto_from_basename = get_human_readable_timestamp_auto(from_basename)
			const auto_from_fs = get_human_readable_timestamp_auto(from_fs)
			assert(Math.abs(from_fs - from_basename) < DAY_IN_MILLIS, 'basename/fs compatibility')
			if (auto_from_fs.startsWith(auto_from_basename))
				return from_fs // more precise
			else
				return from_basename
		}

		return from_fs
	}
	catch (err) {
		const from_exif = _get_creation_date_from_exif(state)
		const from_fs = _get_creation_date_from_fs_stats(state)
		logger.error('dates discrepancy', {
			id: state.id,
			...(from_basename && {
				from_basename,
				auto_from_basename: get_human_readable_timestamp_auto(from_basename),
			}),
			...(from_exif && {
				from_exif,
				auto_from_exif: get_human_readable_timestamp_auto(from_exif),
			}),
			...(from_fs && {
				from_fs,
				auto_from_fs: get_human_readable_timestamp_auto(from_fs),
			}),
			err,
		})
		throw err
	}
}

export function get_best_compact_date(state: Readonly<State>) {
	return get_compact_date_from_UTC_ts(get_best_creation_date_ms(state))
}

export function get_year(state: Readonly<State>) {
	return Math.trunc(get_best_compact_date(state) / 10000)
}

export function get_ideal_basename(state: Readonly<State>): Basename {
	let { name, ext } = state.cached.parsed_path

	ext = ext.toLowerCase()

	if (!starts_with_human_timestamp_ms(name)) {
		const bcd_ms = get_best_creation_date_ms(state)
		const compact_date_from_name = extract_compact_date(name)
		if (compact_date_from_name) {
			// dont touch the name
			if (_get_creation_date_from_exif(state)) { // condition for unit tests only
				// ensure coherency
				assert(
					compact_date_from_name === get_compact_date_from_UTC_ts(_get_creation_date_from_exif(state)!),
					'name in file matches exif name',
				)
			}
		}
		else {
			// TODO handle screenshots Apple
			const date_human = get_human_readable_UTC_timestamp_seconds(new Date(bcd_ms))
			name = date_human + '-' + name // TODO clean possible existing date?
		}
	}

	let ideal = name + ext
	ideal = NORMALIZERS.normalize_unicode(ideal)
	ideal = NORMALIZERS.trim(ideal)
	ideal = NORMALIZERS.coerce_blanks_to_single_spaces(ideal)

	return ideal
}

///////////////////// REDUCERS /////////////////////

export function create(id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] create(…)`, { id })

	const parsed_path = path.parse(id)
	const state = {
		id,
		is_eligible: is_eligible_media_file(id, parsed_path),

		cached: {
			parsed_path,
		},

		exif_data: undefined,
		fs_stats: undefined,
		parsed_original_basename: parse_name(parsed_path.base),

		original_id: id,
	}

	return state
}

export function on_fs_stats_read(state: Readonly<State>, fs_stats: State['fs_stats']): Readonly<State> {
	logger.trace(`[${LIB}] on_fs_stats_read(…)`, { })

	if (fs_stats) {
		const { birthtimeMs, atimeMs, mtimeMs, ctimeMs } = fs_stats
		try {
			assert(birthtimeMs <= atimeMs, 'atime vs birthtime')
			assert(birthtimeMs <= mtimeMs, 'mtime vs birthtime')
			assert(birthtimeMs <= ctimeMs, 'ctime vs birthtime')
		}
		catch (err) {
			logger.warn('fs_stats discrepancy', {
				id: state.id,
				birthtimeMs,
				atimeMs,
				mtimeMs,
				ctimeMs,
				//err,
			})
			//throw err
		}
	}

	state = {
		...state,
		fs_stats,
	}

	if (has_all_infos_for_extracting_the_creation_date(state)) {
		state.cached.best_creation_date_ms = get_best_creation_date_ms(state)
	}

	return state
}

export function on_exif_read(state: Readonly<State>, exif_data: State['exif_data']): Readonly<State> {
	logger.trace(`[${LIB}] on_exif_read(…)`, { })

	if (exif_data && exif_data.errors && exif_data.errors.length) {
		logger.error(`Error reading exif data for "${state.id}"!`, { errors: exif_data.errors })
		exif_data = null
	}

	state = {
		...state,
		exif_data,
	}

	if (has_all_infos_for_extracting_the_creation_date(state)) {
		state.cached.best_creation_date_ms = get_best_creation_date_ms(state)
	}

	return state
}

export function on_moved(state: Readonly<State>, new_id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] on_moved(…)`, { new_id })

	return {
		...state,
		id: new_id,
		cached: {
			...state.cached,
			parsed_path: path.parse(new_id),
		},
	}
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Readonly<State>) {
	const { is_eligible, id, original_id, cached: { parsed_path: { base, dir }}} = state

	let str = `🏞  "${[dir, (is_eligible ? stylize_string.green : stylize_string.gray.dim)(base)].join(path.sep)}"`
	if (state.cached.best_creation_date_ms) {
		str += '  📅 ' + get_human_readable_UTC_timestamp_seconds(new Date(state.cached.best_creation_date_ms))
	}
	else if (is_eligible) {
		str += '  📅 TODO'
	}

	if (id !== original_id) {
		str += `(formerly "${original_id}")`
	}

	return stylize_string.gray.dim(str)
}

///////////////////// NOTES /////////////////////

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
