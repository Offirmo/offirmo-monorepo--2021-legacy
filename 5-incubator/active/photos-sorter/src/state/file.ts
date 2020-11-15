import path from 'path'
import fs from 'fs'

import memoize_once from 'memoize-one'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
import { Tags as EXIFTags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'

import { EXIF_POWERED_FILE_EXTENSIONS } from '../consts'
import {Basename, RelativePath, SimpleYYYYMMDD, ISODateString, TimeZone} from '../types'
import {get_params, Params} from '../params'
import logger from '../services/logger'
import { get_creation_date_from_exif, get_time_zone_from_exif } from '../services/exif'
import { parse as parse_basename, ParseResult, normalize_extension } from '../services/name_parser'
import { get_human_readable_timestamp_auto, get_compact_date } from '../services/date_generator'
import { get_default_timezone } from '../services/params'


export interface OriginalData {
	// from path
	basename: Basename
	closest_parent_with_date_hint?: Basename

	// from fs
	birthtime?: ISODateString

	// from exif
	exif_orientation?: number
}

export interface PersistedNotes {
	deleted: boolean // TODO remember files which were deleted
	original: OriginalData
}

export interface State {
	id: RelativePath // TODO should it be hash?

	current_exif_data: undefined | null | EXIFTags // can be null if no EXIF for this format
	current_fs_stats: undefined | fs.Stats // can't be null, always a file
	current_hash: undefined | string // can't be null, always a file

	notes: PersistedNotes

	memoized: {
		get_parsed_path: (state: Immutable<State>) => path.ParsedPath
		get_parsed_original_basename: (state: Immutable<State>) => ParseResult
		get_normalized_extension: (state: Immutable<State>) => string
	}
}

////////////////////////////////////

const LIB = '🖼'

///////////////////// ACCESSORS /////////////////////

/*
export function get_file_notes_from_exif(exif_data: Immutable<State['current_exif_data']>): null | Immutable<SorterNotes> {
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

function get_most_reliable_birthtime_from_fs_stats(fs_stats: Immutable<State['current_fs_stats']>): Date {
	assert(fs_stats, 'fs stats ok ✔')

	// fs stats are unreliable for some reasons.
	const { birthtimeMs, atimeMs, mtimeMs, ctimeMs } = fs_stats!
	const lowest_ms = Math.min(
			...[birthtimeMs, atimeMs, mtimeMs, ctimeMs].filter(d => !!d)
		)

	return new Date(lowest_ms)
}

////////////

export function get_current_parent_folder_id(state: Immutable<State>): RelativePath {
	return state.memoized.get_parsed_path(state).dir || '.'
}

export function get_current_basename(state: Immutable<State>): Basename {
	return state.memoized.get_parsed_path(state).base
}

export function is_media_file(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): boolean {
	const parsed_path = state.memoized.get_parsed_path(state)

	if (parsed_path.base.startsWith('.')) return false
	let normalized_extension = state.memoized.get_normalized_extension(state)
	 return PARAMS.media_files_extensions.includes(normalized_extension)
}

export function is_exif_powered_media_file(state: Immutable<State>): boolean {
	let normalized_extension = state.memoized.get_normalized_extension(state)

	return EXIF_POWERED_FILE_EXTENSIONS.includes(normalized_extension)
}

export function has_all_infos_for_extracting_the_creation_date(state: Immutable<State>): boolean {
	return (
			   state.current_exif_data !== undefined
			&& state.current_fs_stats !== undefined
			&& state.current_hash !== undefined
		)
}

function _get_creation_date_from_fs_stats(state: Immutable<State>): Date {
	return state.notes.original.birthtime
		? new Date(state.notes.original.birthtime)
		: get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)
}
function _get_creation_date_from_basename(state: Immutable<State>): Date | null {
	return state.memoized.get_parsed_original_basename(state).date || null
}
function _get_creation_date_from_parent_name(state: Immutable<State>): Date | null {
	const { closest_parent_with_date_hint } = state.notes.original
	if (!closest_parent_with_date_hint) return null

	const parsed = parse_basename(closest_parent_with_date_hint)

	return parsed.date || null
}
function _get_creation_date_from_exif(state: Immutable<State>): Date | null {
	const { id, current_exif_data } = state
	if (!is_exif_powered_media_file(state)) {
		// exif reader manage to put some stuff, but it's not interesting
		return null
	}

	assert(current_exif_data, `${id}: exif data read`)

	try {
		return get_creation_date_from_exif(current_exif_data)
	}
	catch (err) {
		logger.fatal(`error extracting date from exif for "${id}"!`, { err })
		throw err
	}
}
const DAY_IN_MILLIS = 24 * 60 * 60 * 1000
export function get_best_creation_date(state: Immutable<State>): Date {
	if (!has_all_infos_for_extracting_the_creation_date(state)) {
		logger.error('has_all_infos_for_extracting_the_creation_date() !== true', state)
		assert(false, 'has_all_infos_for_extracting_the_creation_date() === true')
	}
	//console.log('get_best_creation_date()', state.id)
	const from_basename = _get_creation_date_from_basename(state)
	//console.log({ from_basename })
	// even if we have a date from name,
	// the exi/fs one may be more precise,
	// so let's continue

	const from_exif = _get_creation_date_from_exif(state)
	try {
		if (from_exif) {
			if (from_basename) {
				const auto_from_basename = get_human_readable_timestamp_auto(from_basename, 'Etc/GMT')
				const auto_from_exif = get_human_readable_timestamp_auto(from_exif, 'Etc/GMT')

				if (auto_from_exif.startsWith(auto_from_basename))
					return from_exif // perfect match, EXIF more precise

				// no match, date from the basename always takes precedence,

				if (Math.abs(Number(from_exif) - Number(from_basename)) >= DAY_IN_MILLIS) {
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
			if (Math.abs(Number(from_fs) - Number(from_basename)) >= DAY_IN_MILLIS) {
				// basename always take priority, but this is suspicious
				// TODO log inside file
			}
			const auto_from_basename = get_human_readable_timestamp_auto(from_basename, 'Etc/GMT')
			const auto_from_fs = get_human_readable_timestamp_auto(from_fs, 'Etc/GMT')
			if (auto_from_fs.startsWith(auto_from_basename))
				return from_fs // more precise
			else
				return from_basename
		}
		// fs is really unreliable so we attempt to take hints from the parent folder if available
		const from_parent = _get_creation_date_from_parent_name(state)
		if (from_parent) {
			const auto_from_basename = get_human_readable_timestamp_auto(from_parent, 'Etc/GMT')
			const auto_from_fs = get_human_readable_timestamp_auto(from_fs, 'Etc/GMT')
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
			...(!!from_basename && {
				from_basename,
				auto_from_basename_gmt: get_human_readable_timestamp_auto(from_basename, 'Etc/GMT'),
			}),
			...(!!from_exif && {
				from_exif,
				auto_from_exif_gmt: get_human_readable_timestamp_auto(from_exif, 'Etc/GMT'),
			}),
			...(!!from_fs && {
				from_fs,
				auto_from_fs_gmt: get_human_readable_timestamp_auto(from_fs, 'Etc/GMT'),
			}),
			err,
		})
		throw err
	}
}

export function get_best_creation_date_compact(state: Immutable<State>): SimpleYYYYMMDD {
	return get_compact_date(get_best_creation_date(state), get_best_creation_timezone(state))
}

export function get_best_creation_year(state: Immutable<State>): number {
	return Math.trunc(get_best_creation_date_compact(state) / 10000)
}

function _get_timezone_from_exif(state: Immutable<State>): TimeZone | null {
	const { id, current_exif_data } = state
	if (!is_exif_powered_media_file(state)) {
		// exif reader manage to put some stuff, but it's not interesting
		return null
	}

	assert(current_exif_data, `${id}: exif data read`)

	return get_time_zone_from_exif(current_exif_data) || null
}
export function get_best_creation_timezone(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): TimeZone {
	assert(has_all_infos_for_extracting_the_creation_date(state), 'has_all_infos_for_extracting_the_creation_date() === true')

	return _get_timezone_from_exif(state) || get_default_timezone(get_best_creation_date(state), PARAMS)
}

export function get_ideal_basename(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): Basename {
	const bcd_ms = get_best_creation_date(state)
	const parsed_original_basename = state.memoized.get_parsed_original_basename(state)
	const meaningful_part = parsed_original_basename.meaningful_part
	let extension = parsed_original_basename.extension_lc
	extension = PARAMS.extensions_to_normalize[extension] || extension

	let ideal = 'MM' + get_human_readable_timestamp_auto(bcd_ms, get_best_creation_timezone(state))
	if (meaningful_part)
		ideal += '_' + meaningful_part
	ideal += extension

	return ideal
}

///////////////////// REDUCERS /////////////////////

export function create(id: RelativePath): Immutable<State> {
	logger.trace(`[${LIB}] create(…)`, { id })

	// not a premature optim here,
	// the goal is to avoid repeated logs
	const memoized_parse_path = memoize_once(path.parse)
	const memoized_parse_basename = memoize_once(parse_basename)
	const memoized_normalize_extension = memoize_once(normalize_extension)

	function get_parsed_path(state: Immutable<State>) { return memoized_parse_path(state.id) }
	function get_parsed_original_basename(state: Immutable<State>) {
		const original_basename = state.notes.original.basename
		return memoized_parse_basename(original_basename)
	}
	function get_normalized_extension(state: Immutable<State>) {
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
						if (parsed_basename.date) {
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

export function on_fs_stats_read(state: Immutable<State>, fs_stats: Immutable<fs.Stats>): Immutable<State> {
	logger.trace(`[${LIB}] on_fs_stats_read(…)`, { })
	assert (fs_stats)

	/* TODO add to a log
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
					birthtimeMs: get_most_reliable_birthtime_from_fs_stats(fs_stats),
				}),
				...state.notes.original,
			}
		}
	}

	return state
}

export function on_exif_read(state: Immutable<State>, exif_data: Immutable<EXIFTags>): Immutable<State> {
	logger.trace(`[${LIB}] on_exif_read(…)`, { })
	assert(exif_data, 'on_exif_read() ok')
	if (exif_data && exif_data.errors && exif_data.errors.length) {
		logger.error(`Error reading exif data for "${state.id}"!`, { errors: exif_data.errors })
		// XXX TODO mark file as "in error" to not be renamed / processed
		state = {
			...state,
			current_exif_data: null,
		}
	}

	// TODO optim cherry pick useful fields only

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

export function on_hash_computed(state: Immutable<State>, hash: string): Immutable<State> {
	logger.trace(`[${LIB}] on_hash_computed(…)`, { })
	assert(hash, 'on_hash_computed() ok')

	state = {
		...state,
		current_hash: hash,
	}

	return state
}

export function on_notes_unpersisted(state: Immutable<State>, existing_notes: null | Immutable<PersistedNotes>): Immutable<State> {
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

export function on_moved(state: Immutable<State>, new_id: RelativePath): Immutable<State> {
	logger.trace(`[${LIB}] on_moved(…)`, { new_id })

	return {
		...state,
		id: new_id,
	}
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { id } = state
	const is_eligible = is_media_file(state)
	const parsed_path = state.memoized.get_parsed_path(state)
	const { dir, base } = parsed_path

	let str = `🏞  "${[ '.', ...(dir ? [dir] : []), (is_eligible ? stylize_string.green : stylize_string.gray.dim)(base)].join(path.sep)}"`

	if (is_eligible) {
		const best_creation_date = get_best_creation_date(state)
		if (best_creation_date) {
			str += '  📅 ' + get_human_readable_timestamp_auto(best_creation_date, get_best_creation_timezone(state))
		} else {
			str += '  📅 TODO'
		}
	}

	if (is_eligible && id !== get_ideal_basename(state)) {
		str += ` -> "${get_ideal_basename(state)}"`
	}

	if (base !== state.notes.original.basename) {
		str += `(formerly "${state.notes.original.closest_parent_with_date_hint}/${state.notes.original.basename}")`
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
