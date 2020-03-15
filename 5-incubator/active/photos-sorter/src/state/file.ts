import path from 'path'
import fs from 'fs'

import memoize_once from 'memoize-one'
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
import { parse as parse_basename, ParseResult, normalize_extension } from '../services/name_parser'
import { get_human_readable_timestamp_auto } from '../services/date_generator'


type TimestampsHash = { [k: string]: TimestampUTCMs }

export interface OriginalData {
	// from path
	basename: Basename
	closest_parent_with_date_hint?: Basename

	// from fs
	birthtimeMs?: number

	// from exif
	exif_orientation?: number
}

export interface PersistedNotes {
	deleted: boolean // TODO remember files which were deleted
	original: OriginalData
}

export interface State {
	id: RelativePath

	current_exif_data: undefined | null | Tags // can be null if no EXIF for this format
	current_fs_stats: undefined | fs.Stats // can't be null, always a file
	current_hash: undefined | string // can't be null, always a file

	notes: PersistedNotes

	memoized: {
		get_parsed_path: (state: Readonly<State>) => path.ParsedPath
		get_parsed_original_basename: (state: Readonly<State>) => ParseResult
		get_normalized_extension: (state: Readonly<State>) => string
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

/*
export function get_file_notes_from_exif(exif_data: Readonly<State['current_exif_data']>): null | Readonly<SorterNotes> {
	if (exif_data === null)
		return null

	if (!exif_data)
		throw new Error('get_file_notes() missing EXIF!')

	const custom_entry = (exif_data as any)[EXIF_ENTRY]
	if (!custom_entry)
		return null

	return JSON.parse(custom_entry)
}
*/

function get_most_reliable_birthtimeMs_from_fs_stats(fs_stats: Readonly<State['current_fs_stats']>): TimestampUTCMs {
	assert(fs_stats, 'fs stats ok ✔')

	// fs stats are unreliable for some reasons.
	const { birthtimeMs, atimeMs, mtimeMs, ctimeMs } = fs_stats!
	return Math.min(
			...[birthtimeMs, atimeMs, mtimeMs, ctimeMs].filter(d => !!d)
		)
}

////////////

export function get_current_parent_folder_id(state: Readonly<State>): RelativePath {
	return state.memoized.get_parsed_path(state).dir || '.'
}

export function get_current_basename(state: Readonly<State>): Basename {
	return state.memoized.get_parsed_path(state).base
}
/*
function get_original_basename(state: Readonly<State>): Basename {
	assert(state.notes.original.basename)
	return state.notes.original.basename
}
*/
export function is_media_file(state: Readonly<State>): boolean {
	const parsed_path = state.memoized.get_parsed_path(state)

	if (parsed_path.base.startsWith('.')) return false
	let normalized_extension = state.memoized.get_normalized_extension(state)
	 return PARAMS.media_files_extensions.includes(normalized_extension)
}

export function is_exif_powered_media_file(state: Readonly<State>): boolean {
	let normalized_extension = state.memoized.get_normalized_extension(state)

	return EXIF_POWERED_FILE_EXTENSIONS.includes(normalized_extension)
}

export function has_all_infos_for_extracting_the_creation_date(state: Readonly<State>): boolean {
	return (
			   state.current_exif_data !== undefined
			&& state.current_fs_stats !== undefined
			&& state.current_hash !== undefined
		)
}

function _get_creation_date_from_fs_stats(state: Readonly<State>): TimestampUTCMs {
	return state.notes.original.birthtimeMs || get_most_reliable_birthtimeMs_from_fs_stats(state.current_fs_stats)
}
function _get_creation_date_from_basename(state: Readonly<State>): TimestampUTCMs | null {
	return state.memoized.get_parsed_original_basename(state).timestamp_ms || null
}
function _get_creation_date_from_parent_name(state: Readonly<State>): TimestampUTCMs | null {
	const { closest_parent_with_date_hint } = state.notes.original
	if (!closest_parent_with_date_hint) return null

	const parsed = parse_basename(closest_parent_with_date_hint)

	return parsed.timestamp_ms || null
}
const DEBUG_ID = null //'- inbox/20011101 - le hamster/Le studieux hamster 2.jpg'
function _get_creation_date_from_exif(state: Readonly<State>): TimestampUTCMs | null {
	const { id, current_exif_data } = state
	if (!is_exif_powered_media_file(state)) {
		// exif reader manage to put some stuff, but it's not interesting
		return null
	}

	assert(current_exif_data !== undefined, `${id}: exif data read`)

	if (id === DEBUG_ID) {
		console.log('\n\n------------\n\n')
	}

	try {
		const now = get_UTC_timestamp_ms()
		let min_date_ms = now
		const candidate_dates_ms: TimestampsHash = EXIF_DATE_FIELDS.reduce((acc: TimestampsHash, field: string) => {
			const date_object: undefined | ExifDateTime  = (current_exif_data as any)[field]
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
				? date_object.millis
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
	assert(has_all_infos_for_extracting_the_creation_date(state), 'has_all_infos_for_extracting_the_creation_date() === true')
	const from_basename = _get_creation_date_from_basename(state)
	// even if we have a date from name,
	// the exi/fs one may be more precise,
	// so let's continue

	const from_exif = _get_creation_date_from_exif(state)
	try {
		if (from_exif) {
			if (from_basename) {
				const auto_from_basename = get_human_readable_timestamp_auto(from_basename)
				const auto_from_exif = get_human_readable_timestamp_auto(from_exif)

				if (auto_from_exif.startsWith(auto_from_basename))
					return from_exif // perfect match, EXIF more precise

				// no match, date from the basename always takes precedence,

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
			assert(Math.abs(from_fs - from_basename) < DAY_IN_MILLIS, 'basename/fs compatibility')
			const auto_from_basename = get_human_readable_timestamp_auto(from_basename)
			const auto_from_fs = get_human_readable_timestamp_auto(from_fs)
			if (auto_from_fs.startsWith(auto_from_basename))
				return from_fs // more precise
			else
				return from_basename
		}
		// fs is really unreliable so we attempt to take hints from the parent folder if available
		const from_parent = _get_creation_date_from_parent_name(state)
		if (from_parent) {
			const auto_from_basename = get_human_readable_timestamp_auto(from_parent)
			const auto_from_fs = get_human_readable_timestamp_auto(from_fs)
			if (auto_from_fs.startsWith(auto_from_basename.slice(0, 7)))
				return from_fs // more precise
			else if (auto_from_fs.startsWith(auto_from_basename.slice(0, 4))) {
				// parent hint is less authoritative, we make a trade off here bc fs seems to match
				return from_fs
			} else {
				// TODO ask for confirmation
				throw new Error('Too big discrepancy between fs and parent hint = too dangerous!')
				//return from_parent
			}
		}

		return from_fs
	}
	catch (err) {
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
	const bcd_ms = get_best_creation_date_ms(state)
	const parsed_original_basename = state.memoized.get_parsed_original_basename(state)
	const meaningful_part = parsed_original_basename.meaningful_part
	let extension = parsed_original_basename.extension_lc
	extension = PARAMS.extensions_to_normalize[extension] || extension

	let ideal = 'M' + get_human_readable_timestamp_auto(bcd_ms)
	if (meaningful_part)
		ideal += '_' + meaningful_part
	ideal += extension

	return ideal
}

export function get_original_data(state: Readonly<State>): Readonly<OriginalData> {
	return state.notes.original
}

/*
export function get_ideal_path(state: Readonly<State>): RelativePath {
	if (!state.is_media_file) {
		return
	}

	return ideal
}*/

///////////////////// REDUCERS /////////////////////

export function create(id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] create(…)`, { id })

	const memoized_parse_path = memoize_once(path.parse)
	const memoized_parse_basename = memoize_once(parse_basename)
	const memoized_normalize_extension = memoize_once(normalize_extension)

	function get_parsed_path(state: Readonly<State>) { return memoized_parse_path(state.id) }
	function get_parsed_original_basename(state: Readonly<State>) {
		const original_basename = state.notes.original.basename
		return memoized_parse_basename(original_basename)
	}
	function get_normalized_extension(state: Readonly<State>) {
		const parsed_path = get_parsed_path(state)
		return memoized_normalize_extension(parsed_path.ext)
	}

	const parsed_path = memoized_parse_path(id)

	const state: State = {
		id,

		current_exif_data: undefined,
		current_fs_stats: undefined,
		current_hash: undefined,

		notes: {
			deleted: false,
			original: {
				basename: parsed_path.base,
				closest_parent_with_date_hint: (() => {
					let hint_parent: OriginalData['closest_parent_with_date_hint'] = undefined
					let dir = parsed_path.dir
					while (dir && !hint_parent) {
						const parsed = path.parse(dir)
						const parsed_basename = parse_basename(parsed.base)
						if (parsed_basename.timestamp_ms) {
							hint_parent = parsed.base
						}
						dir = parsed.dir
					}
					return hint_parent
				})(),
			},
		},

		memoized: {
			get_parsed_path,
			get_parsed_original_basename,
			get_normalized_extension,
		},
	}

	if (!is_exif_powered_media_file(state))
		state.current_exif_data = null

	return state
}

export function on_fs_stats_read(state: Readonly<State>, fs_stats: Readonly<fs.Stats>): Readonly<State> {
	logger.trace(`[${LIB}] on_fs_stats_read(…)`, { })
	assert (fs_stats)

	/* TODO file log
	const { birthtimeMs, atimeMs, mtimeMs, ctimeMs } = fs_stats
	if (birthtimeMs > atimeMs)
		logger.warn('atime vs birthtime', {path: state.id, birthtimeMs, atimeMs})
	if (birthtimeMs > mtimeMs)
		logger.warn('mtime vs birthtime', {path: state.id, birthtimeMs, mtimeMs})
	if (birthtimeMs > ctimeMs)
		logger.warn('ctime vs birthtime', {path: state.id, birthtimeMs, ctimeMs})
	*/

	state = {
		...state,
		current_fs_stats: fs_stats,
		notes: {
			...state.notes,
			original: {
				...(fs_stats && {
					birthtimeMs: get_most_reliable_birthtimeMs_from_fs_stats(fs_stats),
				}),
				...state.notes.original,
			}
		}
	}

	return state
}

export function on_exif_read(state: Readonly<State>, exif_data: Readonly<Tags>): Readonly<State> {
	logger.trace(`[${LIB}] on_exif_read(…)`, { })
	assert(exif_data)
	if (exif_data && exif_data.errors && exif_data.errors.length) {
		logger.error(`Error reading exif data for "${state.id}"!`, { errors: exif_data.errors })
		// XXX TODO mark file as "in error" to not be renamed / processed
		state = {
			...state,
			current_exif_data: null,
		}
	}

	state = {
		...state,
		current_exif_data: exif_data,
		notes: {
			...state.notes,
			original: {
				exif_orientation: exif_data?.Orientation,
				...state.notes.original,
			}
		}
	}

	return state
}

export function on_hash_computed(state: Readonly<State>, hash: string): Readonly<State> {
	logger.trace(`[${LIB}] on_hash_computed(…)`, { })
	assert(hash)

	state = {
		...state,
		current_hash: hash,
	}

	return state
}

export function on_notes_unpersisted(state: Readonly<State>, existing_notes: null | Readonly<PersistedNotes>): Readonly<State> {
	logger.trace(`[${LIB}] on_notes_unpersisted(…)`, { id: state.id })
	if (!existing_notes)
		return state

	state = {
		...state,
		notes: {
			...state.notes,
			...existing_notes,
			original: {
				...state.notes.original,
				...existing_notes.original,
			}
		}
	}

	return state
}

export function on_moved(state: Readonly<State>, new_id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] on_moved(…)`, { new_id })

	return {
		...state,
		id: new_id,
	}
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Readonly<State>) {
	const { id } = state
	const is_eligible = is_media_file(state)
	const parsed_path = state.memoized.get_parsed_path(state)
	const { dir, base } = parsed_path

	let str = `🏞  "${[dir, (is_eligible ? stylize_string.green : stylize_string.gray.dim)(base)].join(path.sep)}"`
	const best_creation_date_ms = get_best_creation_date_ms(state)
	if (best_creation_date_ms) {
		str += '  📅 ' + get_human_readable_UTC_timestamp_seconds(new Date(best_creation_date_ms))
	}
	else if (is_eligible) {
		str += '  📅 TODO'
	}

	if (is_eligible && id !== get_ideal_basename(state)) {
		str += ` -> "${get_ideal_basename(state)}")`
	}

	/* TODO
	if (id !== original_id) {
		str += `(formerly "${original_id}")`
	}*/

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
