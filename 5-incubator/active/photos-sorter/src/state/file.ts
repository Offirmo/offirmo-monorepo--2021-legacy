import path from 'path'

import memoize_once from 'memoize-one'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
import { Tags as EXIFTags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { EXIF_POWERED_FILE_EXTENSIONS, NOTES_BASENAME } from '../consts'
import { Basename, RelativePath, SimpleYYYYMMDD, TimeZone } from '../types'
import { get_params, Params } from '../params'
import logger from '../services/logger'
import { FsStatsSubset, get_most_reliable_birthtime_from_fs_stats } from '../services/fs'
import {
	get_creation_date_from_exif,
	get_creation_timezone_from_exif,
} from '../services/exif'
import {
	parse as parse_basename,
	ParseResult,
	get_normalized_extension as _get_normalized_extension,
	get_copy_index,
	get_without_copy_index,
	is_normalized_media_basename,
	is_normalized_event_folder,
} from '../services/name_parser'
import {
	BetterDate,
	get_human_readable_timestamp_auto,
	get_compact_date,
	create_better_date_from_utc_tms,
	create_better_date_from_ExifDateTime, get_timestamp_utc_ms_from, create_better_date_from_simple,
} from '../services/better-date'
import { FileHash } from '../services/hash'

// Data that we'll destroy/modify but is worth keeping
export interface OriginalData {
	// from path
	basename: Basename
	parent_path: RelativePath // useful to manually re-sort in multi-level folder cases
	date_range_hint_from_reliable_neighbours?: [ SimpleYYYYMMDD, SimpleYYYYMMDD ], // TODO only if not confident + parent was originally an event = start date of parent

	// from fs
	// we should always store it in case it changes for some reason
	birthtime_ms: TimestampUTCMs

	// from exif
	exif_orientation?: number
}

// notes contain infos that can't be preserved inside the file itself
// but that neel to be preserved across invocations
export interface PersistedNotes {
	currently_known_as: Basename | null // not strictly useful, intended at humans reading the notes manually
	deleted: undefined | boolean // TODO
	starred: undefined | boolean // TODO
	manual_date: undefined // TODO
	original: OriginalData
}

// Id = path relative to root
export type FileId = RelativePath

export interface State {
	id: FileId

	current_exif_data: undefined | null | EXIFTags // can be null if no EXIF for this format
	current_fs_stats: undefined | FsStatsSubset // can't be null, is always a file
	current_hash: undefined | FileHash // can't be null, always a file
	current_date_range_hint_from_reliable_neighbours: undefined | null | [ SimpleYYYYMMDD, SimpleYYYYMMDD ] // can be null if no reliable neighbours

	notes_restored: boolean
	notes: PersistedNotes

	memoized: {
		get_parsed_path: (state: Immutable<State>) => path.ParsedPath
		get_parsed_original_basename: (state: Immutable<State>) => ParseResult
		get_normalized_extension: (state: Immutable<State>) => string
	}
}

////////////////////////////////////

const LIB = '🖼 ' // iTerm has the wrong width 2020/12/15

///////////////////// ACCESSORS /////////////////////

export function get_path(state: Immutable<State>): RelativePath {
	return state.id
}

export function get_parsed_path(state: Immutable<State>): Immutable<path.ParsedPath> {
	return state.memoized.get_parsed_path(state)
}

export function get_current_parent_folder_id(state: Immutable<State>): RelativePath {
	return get_parsed_path(state).dir || '.'
}

export function get_current_basename(state: Immutable<State>): Basename {
	return get_parsed_path(state).base
}

export function get_oldest_basename(state: Immutable<State>): Basename {
	return state.notes.original.basename || get_current_basename(state)
}

export function is_media_file(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): boolean {
	const parsed_path = get_parsed_path(state)

	if (parsed_path.base.startsWith('.')) return false
	let normalized_extension = state.memoized.get_normalized_extension(state)
	 return PARAMS.media_files_extensions.includes(normalized_extension)
}

export function is_notes(state: Immutable<State>): boolean {
	return get_current_basename(state) === NOTES_BASENAME
}
export function is_exif_powered_media_file(state: Immutable<State>): boolean {
	let normalized_extension = state.memoized.get_normalized_extension(state)

	return EXIF_POWERED_FILE_EXTENSIONS.includes(normalized_extension)
}

export function has_all_infos_for_extracting_the_creation_date(state: Immutable<State>): boolean {
	// TODO optim if name = canonical

	return ( state.notes_restored
			&& (is_exif_powered_media_file(state) ? state.current_exif_data !== undefined : true)
			&& state.current_fs_stats !== undefined
			&& state.current_hash !== undefined
			//&& state.current_date_range_hint_from_reliable_neighbours !== undefined XXX don't merge
		)
}

// primary, in order
function _get_creation_date_manual(state: Immutable<State>): BetterDate | undefined {
	if (state.notes.manual_date === undefined)
		return undefined

	throw new Error('NIMP manual date!')
}
function _get_creation_date_from_exif(state: Immutable<State>): ExifDateTime | undefined {
	const { id, current_exif_data } = state
	if (!is_exif_powered_media_file(state)) {
		// exif reader manage to put some stuff, but it's not interesting
		return undefined
	}

	assert(current_exif_data, `${id}: exif data read`)

	try {
		return get_creation_date_from_exif(get_current_basename(state), current_exif_data)
	}
	catch (err) {
		logger.fatal(`error extracting date from exif for "${id}"!`, { err })
		throw err
	}
}
function _get_creation_tz_from_exif(state: Immutable<State>): TimeZone | undefined {
	const { id, current_exif_data } = state
	if (!is_exif_powered_media_file(state)) {
		// exif reader manage to put some stuff, but it's not interesting
		return undefined
	}

	assert(current_exif_data, `${id}: exif data read`)

	try {
		return get_creation_timezone_from_exif(current_exif_data)
	}
	catch (err) {
		logger.fatal(`error extracting tz from exif for "${id}"!`, { err })
		throw err
	}
}
function _get_creation_date_from_original_basename(state: Immutable<State>): BetterDate | null {
	if (is_normalized_media_basename(get_oldest_basename(state)))
		return null // definitely not the original basename

	return state.memoized.get_parsed_original_basename(state).date || null
}
function _get_creation_date_from_original_fs_stats(state: Immutable<State>): TimestampUTCMs {
	assert(state.current_fs_stats, 'fs stats collected')
	return state.notes.original.birthtime_ms /* ?? get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)*/
}
// secondary
function _get_creation_date_from_original_parent_folder(state: Immutable<State>): BetterDate | null {
	let dir = state.notes.original.parent_path
	while (dir) {
		const parsed = path.parse(dir)
		const parsed_basename = parse_basename(parsed.base)
		if (parsed_basename.date) {
			return parsed_basename.date
		}
		dir = parsed.dir
	}

	return null
}
function _get_creation_date_range_of_original_reliable_neighbours(state: Immutable<State>): null | [ BetterDate, BetterDate] {
	const symd_range = state.notes.original.date_range_hint_from_reliable_neighbours
	if (!symd_range) return null

	return symd_range.map(symd => create_better_date_from_simple(symd, 'tz:auto')) as any
}
function _get_creation_date_from_any_current_parent_folder(state: Immutable<State>): BetterDate | null {
	let dir = get_current_parent_folder_id(state)
	while (dir) {
		const parsed = path.parse(dir)
		const parsed_basename = parse_basename(parsed.base)
		if (parsed_basename.date) {
			return parsed_basename.date
		}
		dir = parsed.dir
	}

	return null
}
function _get_creation_date_range_of_current_reliable_neighbours(state: Immutable<State>): null | [ BetterDate, BetterDate] {
	const symd_range = state.current_date_range_hint_from_reliable_neighbours
	if (!symd_range) return null

	return symd_range.map(symd => create_better_date_from_simple(symd, 'tz:auto')) as any
}
// all together
const DAY_IN_MILLIS = 24 * 60 * 60 * 1000
export type DateConfidence = 'primary' | 'secondary' | 'junk'
interface BestDate {
	candidate: BetterDate
	source:
		// primary
		| 'manual'
		| 'exif'
		| 'original_basename'| 'original_basename+fs'
		| 'original_fs+original_hints'
		// secondary
		| 'original_fs+current_hints'
		| 'current_hints'
		// junk
		| 'original_fs'
	confidence: DateConfidence // TODO redundant with source?
	is_fs_matching: undefined | boolean // TODO useful?
}
export function get_best_creation_date_meta(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): BestDate {
	logger.trace('get_best_creation_date_meta()', { id: state.id })

	if (!has_all_infos_for_extracting_the_creation_date(state)) {
		logger.error('has_all_infos_for_extracting_the_creation_date() !== true', state)
		assert(false, 'has_all_infos_for_extracting_the_creation_date() === true')
	}

	const date__from_original_fs = create_better_date_from_utc_tms(_get_creation_date_from_original_fs_stats(state), 'tz:auto')

	const result: BestDate = {
		candidate: date__from_original_fs,
		source: 'original_fs',
		confidence: 'junk',
		is_fs_matching: undefined, // so far
	}

	/////// PRIMARY SOURCES ///////

	// the strongest indicator = explicit user's will
	const date__manual = _get_creation_date_manual(state)
	if (date__manual) {
		throw new Error('NIMP!')
	}

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const date__from_original_basename: BetterDate | null = _get_creation_date_from_original_basename(state)

	// strongest source after "manual"
	const _from_exif: ExifDateTime | undefined = _get_creation_date_from_exif(state)
	const _from_exif__tz = _get_creation_tz_from_exif(state)
	const date__from_exif: BetterDate | undefined = _from_exif
		? create_better_date_from_ExifDateTime(_from_exif, _from_exif__tz)
		: undefined
	if (date__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = date__from_exif
		result.source = 'exif'
		result.confidence = 'primary'
		result.is_fs_matching = Math.abs(get_timestamp_utc_ms_from(date__from_original_fs) - get_timestamp_utc_ms_from(result.candidate)) < DAY_IN_MILLIS

		if (date__from_original_basename) {
			const auto_from_basename = get_human_readable_timestamp_auto(date__from_original_basename, 'tz:embedded')
			const auto_from_exif = get_human_readable_timestamp_auto(date__from_exif, 'tz:embedded')

			if (auto_from_exif.startsWith(auto_from_basename)) {
				// perfect match + EXIF more precise
			}
			else if (Math.abs(get_timestamp_utc_ms_from(date__from_original_basename) - get_timestamp_utc_ms_from(result.candidate)) < DAY_IN_MILLIS) {
				// good enough, keep EXIF
			}
			else {
				// this is suspicious, report it
				logger.warn(`get_best_creation_date_meta() EXIF/basename discrepancy`, {
					basename: get_oldest_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(date__from_exif) - get_timestamp_utc_ms_from(date__from_original_basename)),
					id: state.id,
					//date__from_original_basename,
					auto_from_basename,
					//date__from_exif,
					auto_from_exif,
				})
			}
		}

		return result
	}

	// second most authoritative source
	if (date__from_original_basename) {
		result.candidate = date__from_original_basename
		result.source = 'original_basename'
		result.confidence = 'primary'
		result.is_fs_matching = Math.abs(get_timestamp_utc_ms_from(date__from_original_fs) - get_timestamp_utc_ms_from(result.candidate)) < DAY_IN_MILLIS

		const auto_from_basename = get_human_readable_timestamp_auto(date__from_original_basename, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(date__from_original_fs, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_basename)) {
			// perfect match, switch to FS more precise
			result.source = 'original_basename+fs'
			result.candidate = date__from_original_fs
		}
		else if (result.is_fs_matching) {
			// good enough, switch to FS more precise
			result.source = 'original_basename+fs'
			result.candidate = date__from_original_fs
		}
		else {
			// FS is notoriously unreliable, don't care
		}

		return result
	}

	// finally, FS is ok if confirmed by some primary hints
	const date__from_original_parent_folder = _get_creation_date_from_original_parent_folder(state)
	const date_range__hinted_from_original_primary_neighbours = _get_creation_date_range_of_original_reliable_neighbours(state)
	const is_fs_confirmed_by_other_hints: boolean = (() => {
		const tms__from_original_fs = get_timestamp_utc_ms_from(date__from_original_fs)

		if (date__from_original_parent_folder) {
			const tms___from_original_parent_folder = get_timestamp_utc_ms_from(date__from_original_parent_folder)

			if (tms__from_original_fs >= tms___from_original_parent_folder
				&& tms__from_original_fs < (tms___from_original_parent_folder + PARAMS.max_event_duration_in_days * DAY_IN_MILLIS)) {
				return true
			}
		}

		if (date_range__hinted_from_original_primary_neighbours) {
			throw new Error('NIMP!')
		}

		return false
	})()
	if (is_fs_confirmed_by_other_hints) {
		result.candidate = date__from_original_fs
		result.source = 'original_fs+original_hints'
		result.confidence = 'primary'
		result.is_fs_matching = true
		return result
	}

	/////// SECONDARY SOURCES ///////

	const date__from_any_parent_folder = _get_creation_date_from_any_current_parent_folder(state)
	if (date__from_any_parent_folder) {
		// weak source
		result.candidate = date__from_any_parent_folder
		result.source = 'current_hints'
		result.confidence = 'secondary'
		result.is_fs_matching = Math.abs(get_timestamp_utc_ms_from(date__from_original_fs) - get_timestamp_utc_ms_from(result.candidate)) < DAY_IN_MILLIS

		const tms__from_original_fs = get_timestamp_utc_ms_from(date__from_original_fs)
		const tms__from_any_parent_folder = get_timestamp_utc_ms_from(date__from_any_parent_folder)

		if (tms__from_original_fs >= tms__from_any_parent_folder
			&& tms__from_original_fs < (tms__from_any_parent_folder + PARAMS.max_event_duration_in_days * DAY_IN_MILLIS)) {
			result.candidate = date__from_original_fs
			result.source = 'original_fs+current_hints'
		}

		return result
	}

	const date_range__from_current_neighbours = _get_creation_date_range_of_current_reliable_neighbours(state)
	if (date_range__from_current_neighbours) {
		// cross-check with fs
		throw new Error('NIMP')
	}

	/////// JUNK SOURCE ///////

	// still the starting default
	assert(result.candidate === date__from_original_fs)
	assert(result.confidence === 'junk')

	return result
}

export function get_best_creation_date(state: Immutable<State>): BetterDate {
	const meta = get_best_creation_date_meta(state)
	return meta.candidate
}

export function get_best_creation_date_compact(state: Immutable<State>): SimpleYYYYMMDD {
	return get_compact_date(get_best_creation_date(state), 'tz:embedded')
}

export function get_best_creation_year(state: Immutable<State>): number {
	return Math.trunc(get_best_creation_date_compact(state) / 10000)
}

export function is_confident_in_date(state: Immutable<State>): boolean {
	const meta = get_best_creation_date_meta(state)
	const { confidence } = meta

	if (confidence !== 'primary') {
		logger.warn(`get_confidence_in_date() low confidence`, {
			id: state.id,
			...meta,
		})
		return false
	}

	return true
}

export function get_ideal_basename(state: Immutable<State>, {
	PARAMS = get_params(),
	requested_confidence = true,
	copy_marker = 'none',
}: {
	PARAMS?: Immutable<Params>
	requested_confidence?: boolean
	copy_marker?: 'none' | 'preserve' | 'temp' | number
} = {}): Basename {
	const parsed_original_basename = state.memoized.get_parsed_original_basename(state)
	const meaningful_part = parsed_original_basename.meaningful_part
	let extension = parsed_original_basename.extension_lc
	extension = PARAMS.extensions_to_normalize[extension] || extension

	logger.trace(`get_ideal_basename()`, {
		is_media_file: is_media_file(state),
		parsed_original_basename,
	})

	let result = meaningful_part // so far

	if (is_media_file(state)) {
		const bcd_meta = get_best_creation_date_meta(state)

		if (!bcd_meta.confidence && requested_confidence) {
			// not confident enough in getting the date, can't add the date
		}
		else {
			const bcd = bcd_meta.candidate
			const prefix = 'MM' + get_human_readable_timestamp_auto(bcd, 'tz:embedded')
			result = [ prefix, result].filter(s => !!s).join('_') // take into account chance of name being empty
		}
	}

	switch (copy_marker) {
		case 'none':
			break
		case 'preserve':
			if (parsed_original_basename.copy_index)
				result += ` (${parsed_original_basename.copy_index})`
			break
		case 'temp':
			result += ` (temp)`
			break
		default:
			if (copy_marker)
				result += ` (${copy_marker})`
			break
	}

	assert(result.length > 0, `get_ideal_basename() extensionless basename should not be empty`)
	result += extension

	return NORMALIZERS.trim(NORMALIZERS.normalize_unicode(result))
}

export function get_hash(state: Immutable<State>): FileHash | undefined {
	return state.current_hash
}

///////////////////// REDUCERS /////////////////////

export function create(id: FileId): Immutable<State> {
	logger.trace(`${LIB} create(…)`, { id })

	// not a premature optim here,
	// the goal is to avoid repeated logs
	const memoized_parse_path = memoize_once(path.parse)
	const memoized_parse_basename = memoize_once(parse_basename)
	const memoized_normalize_extension = memoize_once(_get_normalized_extension)

	function get_parsed_path(state: Immutable<State>) { return memoized_parse_path(state.id) }
	function get_parsed_original_basename(state: Immutable<State>) {
		const original_basename = state.notes.original.basename
		if (get_params().is_perfect_state) {
			assert(
				!is_normalized_media_basename(original_basename),
				`PERFECT STATE original basename should never be an already normalized basename "${original_basename}"!`
			)
		}

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
		current_date_range_hint_from_reliable_neighbours: undefined,

		notes_restored: false,
		notes: {
			currently_known_as: parsed_path.base,
			deleted: undefined,
			starred: undefined,
			manual_date: undefined,
			original: {
				basename: parsed_path.base,
				parent_path: parsed_path.dir,
				birthtime_ms: get_UTC_timestamp_ms(), // so far

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

export function on_fs_stats_read(state: Immutable<State>, fs_stats_subset: Immutable<FsStatsSubset>): Immutable<State> {
	logger.trace(`${LIB} on_fs_stats_read(…)`, { })
	assert(fs_stats_subset, `on_fs_stats_read()`)

	// TODO add to a log for bad fs stats

	state = {
		...state,
		current_fs_stats: fs_stats_subset,
		notes: {
			...state.notes,
			original: {
				...state.notes.original,
				birthtime_ms: get_most_reliable_birthtime_from_fs_stats(fs_stats_subset),
			}
		}
	}

	return state
}

export function on_exif_read(state: Immutable<State>, exif_data: Immutable<EXIFTags>): Immutable<State> {
	logger.trace(`${LIB} on_exif_read(…)`, { })
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
				...state.notes.original,
				exif_orientation: exif_data?.Orientation,
			}
		}
	}

	return state
}

export function on_hash_computed(state: Immutable<State>, hash: string): Immutable<State> {
	logger.trace(`${LIB} on_hash_computed(…)`, { })
	assert(hash, 'on_hash_computed() ok')

	state = {
		...state,
		current_hash: hash,
	}

	return state
}

export function on_notes_recovered(state: Immutable<State>, recovered_notes: null | Immutable<PersistedNotes>): Immutable<State> {
	logger.trace(`${LIB} on_notes_recovered(…)`, { id: state.id, recovered_notes })
	assert(state.current_hash, 'on_notes_recovered() param') // obvious but just in case…

	state = {
		...state,
		notes_restored: true,
		notes: {
			...state.notes,
			...recovered_notes,
			currently_known_as: get_parsed_path(state).base, // force keep this one
			original: {
				...state.notes.original,
				...recovered_notes?.original,
			}
		}
	}

	return state
}

export function on_moved(state: Immutable<State>, new_id: FileId): Immutable<State> {
	logger.trace(`${LIB} on_moved(…)`, { new_id })

	state =  {
		...state,
		id: new_id,
	}
	const parsed = get_parsed_path(state)

	return {
		...state,
		notes: {
			...state.notes,
			currently_known_as: parsed.base,
		}
	}
}

// all those states represent the same file anyway!
// return the "best" one to keep, merged with extra infos
// assumption is that other copies will be cleaned.
// The "best" one is thus the MORE already sorted, assuming others are re-appearance of old backups
export function merge_duplicates(...states: Immutable<State[]>): Immutable<State> {
	logger.trace(`${LIB} merge_duplicates(…)`, { ids: states.map(s => s.id) })
	assert(states.length > 1, 'merge_duplicates(…) params')

	states.forEach((duplicate_state, index) => {
		try {
			assert(duplicate_state.current_hash, 'merge_duplicates(…) should happen after hash computed')
			assert(duplicate_state.current_hash === states[0].current_hash, 'merge_duplicates(…) should have the same hash')
			assert(duplicate_state.current_fs_stats, 'merge_duplicates(…) should happen after fs stats read')
			assert(duplicate_state.notes_restored, 'merge_duplicates(…) should happen after notes are restored (if any)')
			//assert(is_deep_equal(_get_creation_date_from_exif(duplicate_state), _get_creation_date_from_exif(states[0])), 'merge_duplicates(…) should have the same EXIF')
		}
		catch (err) {
			logger.error('merge_duplicates(…) initial assertion failed', {
				err,
				state: states[index],
			})
			throw err
		}
	})

	const reasons = new Set<string>()
	let selected_state = states[0] // so far
	//let min_fs_birthtime_ms = get_most_reliable_birthtime_from_fs_stats(selected_state.current_fs_stats!) // so far
	states.forEach(candidate_state => {
		if (candidate_state === selected_state) return

		//min_fs_birthtime_ms = Math.min(min_fs_birthtime_ms, get_most_reliable_birthtime_from_fs_stats(candidate_state.current_fs_stats!))

		// equal so far, try to discriminate with a criteria
		const selected__has_normalized_basename = get_without_copy_index(get_current_basename(selected_state)) === get_ideal_basename(selected_state)
		const candidate__has_normalized_basename = get_without_copy_index(get_current_basename(candidate_state)) === get_ideal_basename(candidate_state)
		if (selected__has_normalized_basename !== candidate__has_normalized_basename) {
			reasons.add('normalized_basename')

			if (selected__has_normalized_basename)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		const selected__has_normalized_parent_folder = is_normalized_event_folder(get_current_parent_folder_id(selected_state))
		const candidate__has_normalized_parent_folder = is_normalized_event_folder(get_current_parent_folder_id(candidate_state))
		if (selected__has_normalized_parent_folder !== candidate__has_normalized_parent_folder) {
			reasons.add('normalized_parent_folder')

			if (selected__has_normalized_parent_folder)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		let selected__current_copy_index = get_copy_index(get_current_basename(selected_state))
		let candidate__current_copy_index = get_copy_index(get_current_basename(candidate_state))
		if (selected__current_copy_index !== candidate__current_copy_index) {
			reasons.add('copy_index')

			if (selected__current_copy_index === undefined)
				return // current is better

			if (candidate__current_copy_index !== undefined && selected__current_copy_index < candidate__current_copy_index)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		const selected__best_creation_date_tms = get_timestamp_utc_ms_from(get_best_creation_date(selected_state))
		const candidate__best_creation_date_tms = get_timestamp_utc_ms_from(get_best_creation_date(candidate_state))
		if (selected__best_creation_date_tms !== candidate__best_creation_date_tms) {
			reasons.add('best_creation_date')
			//console.log('different best_creation_date', selected__best_creation_date_tms, candidate__best_creation_date_tms)
			// earliest file wins

			if (selected__best_creation_date_tms <= candidate__best_creation_date_tms)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		if (get_current_basename(selected_state).length !== get_current_basename(candidate_state).length) {
			reasons.add('current_basename.length')

			// shorter name wins!
			if (get_current_basename(selected_state).length < get_current_basename(candidate_state).length)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal
		// no more criteria, 1st encountered wins
		reasons.add('order')
	})

	logger.log('de-duplicated file states:', {
		count: states.length,
		final_basename: selected_state.id,
		criterias: [...reasons]
	})

	selected_state = {
		...selected_state,
		notes: {
			// merge notes separately.
			// Even if we discard duplicates, they may still hold precious original info
			...merge_notes(...states.map(s => s.notes)),
			// update
			currently_known_as: get_current_basename(selected_state),
		},
	}

	return selected_state
}

// merge notes concerning the same file (by hash). Could be:
// - duplicated notes
// - duplicated files
// - persisted vs. reconstructed notes
// the earliest best choice will take precedence
// NOTE that this function works in an opposite way than merge_duplicates,
//      it will try to preserve the LESS sorted data = the oldest
// https://stackoverflow.com/a/56650790/587407
const _get_defined_props = (obj: any) =>
	Object.fromEntries(
		Object.entries(obj)
			.filter(([k, v]) => v !== undefined)
	)
export function merge_notes(...notes: Immutable<PersistedNotes[]>): Immutable<PersistedNotes> {
	logger.trace(`${LIB} merge_notes(…)`, { ids: notes.map(n => n.original.basename) })
	assert(notes.length > 1, 'merge_notes(…) should be given several notes to merge')

	// get hints at earliest
	const index__non_normalized_basename = notes.findIndex(n => !is_normalized_media_basename(n.original.basename))
	const index__earliest_birthtime = notes.reduce((acc, val, index) => {
		// birthtimes tend to be botched to a *later* date by the FS
		if (val.original.birthtime_ms < acc[1]) {
			acc[0] = index
			acc[1] = val.original.birthtime_ms
		}
		return acc
	}, [-1, Number.POSITIVE_INFINITY])[0]
	const index__shortest_non_normalized_basename = notes.reduce((acc, val, index) => {
		const candidate = val.original.basename
		if (candidate.length < acc[1] && !is_normalized_media_basename(candidate)) {
			acc[0] = index
			acc[1] = candidate.length
		}
		return acc
	}, [-1, Number.POSITIVE_INFINITY])[0]

	let index__best_starting_candidate = index__shortest_non_normalized_basename >= 0
		? index__shortest_non_normalized_basename
		: index__non_normalized_basename >= 0
			? index__non_normalized_basename
			:  index__earliest_birthtime >= 0 // fs time really unreliable
				? index__earliest_birthtime
				: 0
	let merged_notes = notes[index__best_starting_candidate]
	assert(merged_notes, 'merge_notes(…) selected a starting point')

	logger.silly(`merge_notes(…)`, {
		index__best_starting_candidate,
		index__shortest_non_normalized_basename,
		index__non_normalized_basename,
		index__earliest_birthtime,
	})

	// selectively merge best data
	const earliest_fs_birthtime = notes[index__earliest_birthtime].original.birthtime_ms

	merged_notes = {
		...merged_notes,
		original: {
			...merged_notes.original,
			birthtime_ms: earliest_fs_birthtime,
		}
	}

	// fill holes with whatever is defined, earliest wins
	logger.silly('nsf', merged_notes)
	notes.forEach(duplicate_notes => {
		/*if (duplicate_notes.original.basename.length < shortest_original_basename.length && !is_normalized_media_basename(duplicate_notes.original.basename))
			shortest_original_basename = duplicate_notes.original.basename*/
		merged_notes = {
			...merged_notes,
			..._get_defined_props(duplicate_notes),
			..._get_defined_props(merged_notes),
			original: {
				...merged_notes.original,
				..._get_defined_props(duplicate_notes.original),
				..._get_defined_props(merged_notes.original),
			}
		}
		logger.silly('nsf', merged_notes)
	})

	/*let shortest_original_basename: Basename = merged_notes.original.basename // for now
	if (merged_notes.original.basename !== shortest_original_basename) {
		logger.warn(`merge_notes(): ?? final original basename "${merged_notes.original.basename}" is not the shortest: "${shortest_original_basename}"`)
	}*/
	if (is_normalized_media_basename(merged_notes.original.basename)) {
		logger.warn(`merge_notes(): ?? final original basename "${merged_notes.original.basename}" is already normalized`)
	}

	return merged_notes
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { id } = state
	const is_eligible = is_media_file(state)
	const parsed_path = get_parsed_path(state)
	const { dir, base } = parsed_path

	let str = `🏞  "${[ '.', ...(dir ? [dir] : []), (is_eligible ? stylize_string.green : stylize_string.gray.dim)(base)].join(path.sep)}"`

	if (is_eligible) {
		if (!has_all_infos_for_extracting_the_creation_date(state)) {
			str += ' ⏳processing in progress…'
		}
		else {
			const ideal_basename = get_ideal_basename(state)
			if (base === ideal_basename)
				str += '✅'
			else
				str += ` 📅 -> "${ideal_basename}"`
		}
	}

	if (base !== state.notes.original.basename) {
		// historically known as
		str += ` (Note: HKA "${state.notes.original.parent_path}/${state.notes.original.basename}")`
	}

	return stylize_string.gray.dim(str)
}
