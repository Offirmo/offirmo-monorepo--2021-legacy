import path from 'path'

import memoize_once from 'memoize-one'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
import { Tags as EXIFTags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { is_deep_equal } from '@offirmo-private/state-utils'

import { EXIF_POWERED_FILE_EXTENSIONS } from '../consts'
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
	is_already_normalized,
} from '../services/name_parser'
import {
	BetterDate,
	get_human_readable_timestamp_auto,
	get_compact_date,
	create_better_date_from_utc_tms,
	create_better_date_from_ExifDateTime, get_timestamp_utc_ms_from,
} from '../services/better-date'
import { FileHash } from '../services/hash'

// Data that we modified (or plan to)
export interface OriginalData {
	// from path
	basename: Basename
	closest_parent_with_date_hint?: Basename

	// from fs
	// we should always store it in case it changes for some reason
	birthtime_ms: TimestampUTCMs

	// from exif
	exif_orientation?: number
}

// notes contain infos that can't be preserved inside the file itself
// but that neel to be preserved across invocations
export interface PersistedNotes {
	currently_known_as: Basename | null // not really used, intended at humans reading the notes
	deleted: undefined | boolean // TODO
	starred: undefined | boolean // TODO
	original: OriginalData
}

// Id = path relative to root
export type FileId = RelativePath

export interface State {
	id: FileId

	current_exif_data: undefined | null | EXIFTags // can be null if no EXIF for this format
	current_fs_stats: undefined | FsStatsSubset // can't be null, is always a file
	current_hash: undefined | FileHash // can't be null, always a file

	notes_restored: boolean
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
	// TODO optim if name = canonical
	return ( state.notes_restored
			&& state.current_exif_data !== undefined
			&& state.current_fs_stats !== undefined
			&& state.current_hash !== undefined
		)
}

function _get_creation_date_from_fs_stats(state: Immutable<State>): TimestampUTCMs {
	assert(state.current_fs_stats, 'fs stats collected')
	return state.notes.original.birthtime_ms ?? get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)
}
function _get_creation_date_from_basename(state: Immutable<State>): BetterDate | null {
	if (is_already_normalized(get_current_basename(state))) {
		//console.log('XXX _get_creation_date_from_basename() already normalized')
		return null
	}
	return state.memoized.get_parsed_original_basename(state).date || null
}
function _get_creation_date_from_parent_name(state: Immutable<State>): BetterDate | null {
	const { closest_parent_with_date_hint } = state.notes.original
	if (!closest_parent_with_date_hint) return null

	const parsed = parse_basename(closest_parent_with_date_hint)

	return parsed.date || null
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
const DAY_IN_MILLIS = 24 * 60 * 60 * 1000
export function get_best_creation_date(state: Immutable<State>): BetterDate {
	//logger.trace('get_best_creation_date()', { id: state.id })
	if (!has_all_infos_for_extracting_the_creation_date(state)) {
		logger.error('has_all_infos_for_extracting_the_creation_date() !== true', state)
		assert(false, 'has_all_infos_for_extracting_the_creation_date() === true')
	}

	const from_basename: BetterDate | null = _get_creation_date_from_basename(state)
	//console.log({ from_basename })

	const from_fs = create_better_date_from_utc_tms(_get_creation_date_from_fs_stats(state), 'tz:auto')

	// even if we have a date from name,
	// the exif one may be more precise,
	// so let's continue

	const _from_exif: ExifDateTime | undefined = _get_creation_date_from_exif(state)
	const _from_exif__tz = _get_creation_tz_from_exif(state)
	const from_exif: BetterDate | undefined = _from_exif
		? create_better_date_from_ExifDateTime(_from_exif, _from_exif__tz)
		: undefined
	try {
		if (from_exif) {
			if (from_basename) {
				const auto_from_basename = get_human_readable_timestamp_auto(from_basename, 'tz:embedded')
				const auto_from_exif = get_human_readable_timestamp_auto(from_exif, 'tz:embedded')

				if (auto_from_exif.startsWith(auto_from_basename))
					return from_exif // perfect match, EXIF more precise

				// no match, date from the basename always takes precedence
				// TODO if MMxxx

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

		if (from_basename) {
			if (Math.abs(Number(from_fs) - Number(from_basename)) >= DAY_IN_MILLIS) {
				// basename always take priority, but this is suspicious
				// TODO log inside file
			}
			const auto_from_basename = get_human_readable_timestamp_auto(from_basename, 'tz:embedded')
			const auto_from_fs = get_human_readable_timestamp_auto(from_fs, 'tz:embedded')
			if (auto_from_fs.startsWith(auto_from_basename))
				return from_fs // more precise
			else
				return from_basename
		}

		// fs is really unreliable so we attempt to take hints from the parent folder if available
		const from_parent = _get_creation_date_from_parent_name(state)
		if (from_parent) {
			const auto_from_basename = get_human_readable_timestamp_auto(from_parent, 'tz:embedded')
			const auto_from_fs = get_human_readable_timestamp_auto(from_fs, 'tz:embedded')
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

		// fs is really too unreliable
		// TODO assess reliability of fs
		return from_fs
	}
	catch (err) {
		logger.error('dates discrepancy', {
			id: state.id,
			...(!!from_basename && {
				from_basename,
				auto_from_basename_gmt: get_human_readable_timestamp_auto(from_basename, 'tz:embedded'),
			}),
			...(!!from_exif && {
				from_exif,
				auto_from_exif_gmt: get_human_readable_timestamp_auto(from_exif, 'tz:embedded'),
			}),
			...(!!from_fs && {
				from_fs,
				auto_from_fs_gmt: get_human_readable_timestamp_auto(from_fs, 'tz:embedded'),
			}),
			err,
		})
		throw err
	}
}

export function get_best_creation_date_compact(state: Immutable<State>): SimpleYYYYMMDD {
	return get_compact_date(get_best_creation_date(state), 'tz:embedded')
}

export function get_best_creation_year(state: Immutable<State>): number {
	return Math.trunc(get_best_creation_date_compact(state) / 10000)
}

export function get_ideal_basename(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): Basename {
	const bcd = get_best_creation_date(state)
	const parsed_original_basename = state.memoized.get_parsed_original_basename(state)
	const meaningful_part = parsed_original_basename.meaningful_part
	let extension = parsed_original_basename.extension_lc
	extension = PARAMS.extensions_to_normalize[extension] || extension

	let ideal = 'MM' + get_human_readable_timestamp_auto(bcd, 'tz:embedded')
	if (meaningful_part)
		ideal += '_' + meaningful_part
	ideal += extension

	return ideal
}

export function get_hash(state: Immutable<State>): FileHash | undefined {
	return state.current_hash
}

///////////////////// REDUCERS /////////////////////

export function create(id: FileId): Immutable<State> {
	logger.trace(`[${LIB}] create(…)`, { id })

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
				!is_already_normalized(original_basename),
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

		notes_restored: false,
		notes: {
			currently_known_as: parsed_path.base,
			deleted: undefined,
			starred: undefined,
			original: {
				basename: parsed_path.base,
				birthtime_ms: get_UTC_timestamp_ms(), // so far
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

export function on_fs_stats_read(state: Immutable<State>, fs_stats_subset: Immutable<FsStatsSubset>): Immutable<State> {
	logger.trace(`[${LIB}] on_fs_stats_read(…)`, { })
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
				...state.notes.original,
				exif_orientation: exif_data?.Orientation,
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

export function on_notes_unpersisted(state: Immutable<State>, recovered_notes: null | Immutable<PersistedNotes>): Immutable<State> {
	logger.trace(`[${LIB}] on_notes_unpersisted(…)`, { id: state.id })
	assert(state.current_hash, 'on_notes_unpersisted() param') // obvious but just in case…

	state = {
		...state,
		notes_restored: true,
		notes: {
			...state.notes,
			...recovered_notes,
			currently_known_as: state.memoized.get_parsed_path(state).base, // force keep this one
			original: {
				...state.notes.original,
				...recovered_notes?.original,
			}
		}
	}

	return state
}

export function on_moved(state: Immutable<State>, new_id: FileId): Immutable<State> {
	logger.trace(`[${LIB}] on_moved(…)`, { new_id })

	state =  {
		...state,
		id: new_id,
	}
	const parsed = state.memoized.get_parsed_path(state)

	return {
		...state,
		notes: {
			...state.notes,
			currently_known_as: parsed.base,
		}
	}
}

// all those states represent the same file
// return the "best" one to keep, merged with extra infos
// assumption is that other copies will be cleaned.
export function merge_duplicates(...states: Immutable<State[]>): Immutable<State> {
	logger.trace(`[${LIB}] merge_duplicates(…)`, { ids: states.map(s => s.id) })
	assert(states.length > 1, 'merge_duplicates(…) params')

	states.forEach(duplicate_state => {
		assert(duplicate_state.current_hash, 'merge_duplicates(…) should happen after hash computed')
		assert(duplicate_state.current_hash === states[0].current_hash, 'merge_duplicates(…) should have the same hash')
		assert(duplicate_state.current_fs_stats, 'merge_duplicates(…) should happen after fs stats read')
		assert(duplicate_state.notes_restored, 'merge_duplicates(…) should happen after notes are restored (if any)')
		//assert(is_deep_equal(_get_creation_date_from_exif(duplicate_state), _get_creation_date_from_exif(states[0])), 'merge_duplicates(…) should have the same EXIF')
	})

	const reasons = new Set<string>()
	let original_state = states[0] // so far
	let min_fs_birthtime_ms = get_most_reliable_birthtime_from_fs_stats(original_state.current_fs_stats!) // so far
	states.forEach(duplicate_state => {
		min_fs_birthtime_ms = Math.min(min_fs_birthtime_ms, get_most_reliable_birthtime_from_fs_stats(duplicate_state.current_fs_stats!))
		if (duplicate_state === original_state) return

		//let original_parsed_result = original_state.memoized.get_parsed_original_basename(original_state)
		//let duplicate_parsed_result = duplicate_state.memoized.get_parsed_original_basename(duplicate_state)
		//console.log({ original_parsed_result, duplicate_parsed_result })

		let original_current_copy_index = get_copy_index(get_current_basename(original_state))
		let duplicate_current_copy_index = get_copy_index(get_current_basename(duplicate_state))
		if (original_current_copy_index !== duplicate_current_copy_index) {
			reasons.add('copy_index')
			if (original_current_copy_index === undefined)
				return // current is better

			if (duplicate_current_copy_index !== undefined && original_current_copy_index < duplicate_current_copy_index)
				return // current is better

			original_state = duplicate_state
			return
		}

		// equality, try another criteria
		const original_best_creation_date_tms = get_timestamp_utc_ms_from(get_best_creation_date(original_state))
		const duplicate_best_creation_date_tms = get_timestamp_utc_ms_from(get_best_creation_date(duplicate_state))
		if (original_best_creation_date_tms !== duplicate_best_creation_date_tms) {
			reasons.add('best_creation_date')
			//console.log('different best_creation_date', original_best_creation_date_tms, duplicate_best_creation_date_tms)
			// earliest file wins

			if (original_best_creation_date_tms <= duplicate_best_creation_date_tms)
				return // current is better

			original_state = duplicate_state
			return
		}

		// equality, try another criteria
		// if one is already sorted, pick it
		if (get_ideal_basename(original_state) === get_current_basename(original_state)) {
			reasons.add('ideal_basename')
			return // current is better
		}
		if (get_ideal_basename(duplicate_state) === get_current_basename(duplicate_state)) {
			reasons.add('ideal_basename')
			original_state = duplicate_state
			return
		}

		// equality, try another criteria
		if (get_current_basename(original_state).length !== get_current_basename(duplicate_state).length) {
			reasons.add('current_basename.length')

			// shorter name wins!
			if (get_current_basename(original_state).length < get_current_basename(duplicate_state).length)
				return // current is better

			original_state = duplicate_state
			return
		}

		// equality, try another criteria
		// TODO review they most likely share the same notes...
		if (original_state.notes.original.closest_parent_with_date_hint !== duplicate_state.notes.original.closest_parent_with_date_hint) {
			reasons.add('original.closest_parent_with_date_hint')

			if (duplicate_state.notes.original.closest_parent_with_date_hint === undefined)
				return // current is better

			if (original_state.notes.original.closest_parent_with_date_hint !== undefined)
				return // no way to discriminate, keep current

			original_state = duplicate_state
			return
		}

		// still equal
		// no more criteria, 1st encountered wins
		reasons.add('order')
	})

	assert(original_state, 'merge_duplicates(…) selected original_state')

	logger.verbose('de-duplicated file states:', {
		count: states.length,
		final_basename: original_state.id,
		criterias: [...reasons]
	})

	original_state = {
		...original_state,
		notes: merge_notes(
			...states.map(s => s.notes),
			// re-inject the best one at the end so that it takes precedence
			original_state.notes
			// TODO check "currently known as"
		),
	}

	return original_state
}

// merge notes concerning the same file (by hash). Could be:
// - duplicated files
// - persisted vs. reconstructed notes
// If conflict, the latter will have priority
// https://stackoverflow.com/a/56650790/587407
const _get_defined_props = (obj: any) => Object.fromEntries(
	Object.entries(obj).filter(([k, v]) => v !== undefined)
)
export function merge_notes(...notes: Immutable<PersistedNotes[]>): Immutable<PersistedNotes> {
	logger.trace(`[${LIB}] merge_notes(…)`, { ids: notes.map(n => n.original.basename) })

	let note = notes[0]
	assert(note, 'merge_notes(…) selected note')

	//let shortest_basename: Basename = note.original.basename
	notes.forEach(duplicate_notes => {
		/*if (duplicate_notes.original.basename.length < shortest_basename.length)
			shortest_basename = duplicate_notes.original.basename*/
		note = {
			...note,
			..._get_defined_props(duplicate_notes),
			original: {
				...note.original,
				..._get_defined_props(duplicate_notes.original),
				//basename: shortest_basename,
			}
		}
	})

	const original_birthtimes: TimestampUTCMs[] = notes.map(n => n.original.birthtime_ms)
	note = {
		...note,
		original: {
			...note.original,
			birthtime_ms: Math.min(...original_birthtimes),
		}
	}

	return note
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { id } = state
	const is_eligible = is_media_file(state)
	const parsed_path = state.memoized.get_parsed_path(state)
	const { dir, base } = parsed_path

	let str = `🏞  "${[ '.', ...(dir ? [dir] : []), (is_eligible ? stylize_string.green : stylize_string.gray.dim)(base)].join(path.sep)}"`

	if (is_eligible) {
		if (!has_all_infos_for_extracting_the_creation_date(state)) {
			str += ' ⏳processing in progress…'
		}
		else {
			str += ` 📅 -> "${get_ideal_basename(state)}"`
		}
	}

	if (base !== state.notes.original.basename) {
		str += ` (Note: historically known as "${state.notes.original.closest_parent_with_date_hint ? state.notes.original.closest_parent_with_date_hint + '/' : ''}${state.notes.original.basename}")`
	}

	return stylize_string.gray.dim(str)
}
