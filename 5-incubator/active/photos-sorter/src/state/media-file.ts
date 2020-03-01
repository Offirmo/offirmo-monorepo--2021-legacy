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

type TimestampsHash = { [k: string]: TimestampUTCMs }

export interface State {
	id: RelativePath
	is_eligible: boolean

	exif_data: undefined | null | Tags
	fs_stats: undefined | null | fs.Stats
	parsed_original_basename: undefined | ParseResult

	original_id: RelativePath

	cached: {
		parsed: path.ParsedPath,
		best_creation_date_ms?: TimestampUTCMs
	}
}

////////////////////////////////////

const LIB = '🖼'

const PARAMS = get_params()

const Exif_DATE_FIELDS: string[] = [
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

// TODO compare function
/*export function is_equal(state_l: Readonly<State>, state_r: Readonly<State>): boolean {
	// TODO compare exif size and data
	throw new Error('NIMP!')
}*/

export function has_all_infos(state: Readonly<State>): boolean {
	return !!state.cached.best_creation_date_ms
		|| (state.exif_data !== undefined && state.fs_stats !== undefined)

	//return state.exif_data !== undefined && state.fs_stats !== undefined
}

export function get_parent_folder_id(state: Readonly<State>): RelativePath {
	return state.cached.parsed.dir
}

export function get_basename(state: Readonly<State>): Basename {
	return state.cached.parsed.base
}

function _get_creation_date_from_name(id: string): TimestampUTCMs | null {
	// TODO match regexp!
	return null
}
function _get_creation_date_from_fs_stats({ fs_stats }: Readonly<State>): TimestampUTCMs {
	assert(fs_stats !== undefined, 'fs stats read ✔')
	assert(fs_stats, 'fs stats ok ✔')

	return fs_stats!.birthtimeMs
}
function _get_creation_date_from_exif({ id, exif_data, cached }: Readonly<State>): TimestampUTCMs | null {
	assert(exif_data !== undefined, `${id}: exif data read ✔`)

	if (!EXIF_POWERED_FILE_EXTENSIONS.includes(cached.parsed.ext.toLowerCase())) {
		// exif reader manage to put some stuff, but it's not interesting
		return null
	}

	try {
		const now = get_UTC_timestamp_ms()
		let min_date_ms = now
		const candidate_dates_ms: TimestampsHash = Exif_DATE_FIELDS.reduce((acc: TimestampsHash, field: string) => {
			const date_object: undefined | ExifDateTime  = (exif_data as any)[field]
			if (!date_object) return acc

			const tms = date_object.millis || +date_object.toDate()
			if (!tms) {
				console.log({field, tod: date_object.toDate(), milli: +date_object.toDate(), date_object})
				assert(tms, 'exif tms not null')
			}

			assert(tms, 'exif dates should have milli')
			acc[field] = tms
			min_date_ms = Math.min(min_date_ms, tms)
			return acc
		}, {} as TimestampsHash)

		assert(Object.keys(candidate_dates_ms).length, `${id} has at least 1 usable Exif date!`)

		//console.log({ min_date_ms: get_human_readable_UTC_timestamp_seconds(new Date(min_date_ms)) })
		assert(min_date_ms !== now, 'coherent dates')

		return min_date_ms
	}
	catch (err) {
		logger.fatal(`error extracting date from exif for "${id}"!`, { err })
		throw err
	}
}
export function get_best_creation_date_ms(state: Readonly<State>): TimestampUTCMs {
	if (state.cached.best_creation_date_ms)
		return state.cached.best_creation_date_ms

	const from_name = _get_creation_date_from_name(state.id)
	if (from_name) return from_name

	const from_exif = _get_creation_date_from_exif(state)
	if (from_exif) return from_exif

	return _get_creation_date_from_fs_stats(state)
}

export function get_best_compact_date(state: Readonly<State>) {
	return get_compact_date_from_UTC_ts(get_best_creation_date_ms(state))
}

export function get_year(state: Readonly<State>) {
	return Math.trunc(get_best_compact_date(state) / 10000)
}

export function get_ideal_basename(state: Readonly<State>): Basename {
	let { name, ext } = state.cached.parsed

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

	const parsed = path.parse(id)
	const state = {
		id,
		is_eligible: is_eligible_media_file(id, parsed),

		cached: {
			parsed,
		},

		exif_data: undefined,
		fs_stats: undefined,
		parsed_original_basename: parse_name(parsed.base),

		original_id: id,
	}

	// TODO extract date from name?
	//const date_from_name = _get_creation_date_from_name(id)

	return state
}

export function on_fs_stats_read(state: Readonly<State>, fs_stats: State['fs_stats']): Readonly<State> {
	logger.trace(`[${LIB}] on_fs_stats_read(…)`, { })

	return {
		...state,
		fs_stats,
	}
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

	state.cached.best_creation_date_ms = get_best_creation_date_ms(state)

	return state
}

export function on_moved(state: Readonly<State>, new_id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] on_moved(…)`, { new_id })

	return {
		...state,
		id: new_id,
		cached: {
			...state.cached,
			parsed: path.parse(new_id),
		},
	}
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Readonly<State>) {
	const { is_eligible, id, original_id, cached: { parsed: { base, dir }}} = state

	let str = `🏞  "${[dir, (is_eligible ? stylize_string.green : stylize_string.gray.dim)(base)].join(path.sep)}"`
	if (state.cached.best_creation_date_ms) {
		str += '  📅 ' + get_human_readable_UTC_timestamp_seconds(new Date(state.cached.best_creation_date_ms))
	}
	else {
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
