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
	get_orientation_from_exif,
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
	create_better_date_from_ExifDateTime,
	get_timestamp_utc_ms_from,
	create_better_date_from_simple,
	assertㆍbetter_dateㆍdeepㆍequal,
	is_same_date_with_potential_tz_difference,
	DAY_IN_MILLIS,
	get_debug_representation,
} from '../services/better-date'
import { FileHash } from '../services/hash'

// Data that we'll destroy/modify but is worth keeping
export interface OriginalData {
	// TODO should we store the date of first encounter? would that add any information?

	/////// Data that we'll likely destroy but is precious
	// either
	// - in itself
	// - to recompute the date with stability on subsequent runs
	// - to recompute the date properly in case of a bug or an improvement of our algo

	// from path
	basename: Basename // can contain the date + we "clean" it, maybe with bugs
	parent_path: RelativePath // useful to manually re-sort in multi-level folder cases

	// from fs
	// we should always store it in case it changes for some reason + we may overwrite it
	fs_birthtime_ms: TimestampUTCMs
	is_fs_birthtime_assessed_reliable: undefined | boolean // from various info incl. neighbors at the time of the discovery

	// from exif
	exif_orientation?: number
}

// notes contain infos that can't be preserved inside the file itself
// but that need to be preserved across invocations
export interface PersistedNotes {
	// backup
	original: OriginalData

	// user data
	deleted: undefined | boolean // TODO
	starred: undefined | boolean // TODO
	manual_date: undefined // TODO

	// debug
	currently_known_as: Basename | null // not strictly useful, intended at humans reading the notes manually
	renaming_source: undefined | string
}

// Id = path relative to root
export type FileId = RelativePath

export interface State {
	id: FileId

	// those fields need I/O to be completed, they start undefined
	current_exif_data: undefined | null | EXIFTags // can be null if no EXIF for this format
	current_fs_stats: undefined | FsStatsSubset // can't be null, is always a file
	current_hash: undefined | FileHash // can't be null, always a file

	are_notes_restored: boolean
	notes: PersistedNotes

	are_neighbors_hints_collected: boolean

	memoized: {
		get_parsed_path: (state: Immutable<State>) => path.ParsedPath
		get_parsed_original_basename: (state: Immutable<State>) => ParseResult
		get_parsed_current_basename: (state: Immutable<State>) => ParseResult
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

export function is_notes(state: Immutable<State>): boolean {
	return get_current_basename(state) === NOTES_BASENAME
}

export function is_media_file(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): boolean {
	const parsed_path = get_parsed_path(state)

	if (parsed_path.base.startsWith('.')) return false

	let normalized_extension = state.memoized.get_normalized_extension(state)
	return PARAMS.media_files_extensions.includes(normalized_extension)
}

export function is_exif_powered_media_file(state: Immutable<State>): boolean {
	if (!is_media_file(state)) return false

	let normalized_extension = state.memoized.get_normalized_extension(state)

	return EXIF_POWERED_FILE_EXTENSIONS.includes(normalized_extension)
}

export function has_all_infos_for_extracting_the_creation_date(state: Immutable<State>, { should_log = true as boolean, require_neighbors_hints = true as boolean}): boolean {
	// TODO optim if name = canonical

	const { are_notes_restored, are_neighbors_hints_collected } = state
	const is_exif_available_if_needed = is_exif_powered_media_file(state) ? state.current_exif_data !== undefined : true
	const are_fs_stats_read = state.current_fs_stats !== undefined
	const is_current_hash_computed = state.current_hash !== undefined

	const has_all_infos =
		   are_notes_restored
		&& is_exif_available_if_needed
		&& are_fs_stats_read
		&& is_current_hash_computed
		&& (are_neighbors_hints_collected || !require_neighbors_hints)

	if (!has_all_infos && should_log) {
		// TODO remove, valid check most of the time
		logger.warn(`has_all_infos_for_extracting_the_creation_date() !met`, {
			are_notes_restored,
			is_exif_available_if_needed,
			are_fs_stats_read,
			is_current_hash_computed,
			are_neighbors_hints_collected,
			require_neighbors_hints,
		})
	}

	return has_all_infos
}

export function is_first_file_encounter(state: Immutable<State>): boolean | undefined {
	if (!state.are_notes_restored)
		return undefined // don't know yet

	// compare all original properties
	const { original } = state.notes
	if (original.basename !== get_current_basename(state)) return false
	if (original.parent_path !== get_current_parent_folder_id(state)) return false
	assert(state.current_fs_stats, `is_first_file_encounter() should have fs stats`)
	if (original.fs_birthtime_ms !== _get_creation_date_from_current_fs_stats(state)) return false
	assert(state.current_exif_data !== undefined, `is_first_file_encounter() should have EXIF data`)
	if (is_exif_powered_media_file(state)
		&& original.exif_orientation !== (state.current_exif_data
		? get_orientation_from_exif(state.current_exif_data)
		: undefined))
		return false

	return true
}

// primary, in order
function _get_creation_date_manual(state: Immutable<State>): BetterDate | undefined {
	if (state.notes.manual_date === undefined)
		return undefined

	throw new Error('NIMP manual date!')
}
function _get_creation_date_from_exif__internal(state: Immutable<State>): ExifDateTime | undefined {
	const { id, current_exif_data } = state
	if (!is_exif_powered_media_file(state)) {
		// exif reader manage to put some stuff, but it's not interesting
		return undefined
	}

	assert(current_exif_data !== undefined, `_get_creation_date_from_exif__internal(): ${id} exif data read`)
	if (current_exif_data === null) return undefined

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

	assert(current_exif_data !== undefined, `_get_creation_date_from_exif__internal(): ${id} exif data read`)
	if (current_exif_data === null) return undefined

	try {
		return get_creation_timezone_from_exif(current_exif_data)
	}
	catch (err) {
		logger.fatal(`error extracting tz from exif for "${id}"!`, { err })
		throw err
	}
}
function _get_creation_date_from_exif(state: Immutable<State>): BetterDate | undefined {
	if (!is_exif_powered_media_file(state)) {
		// exif reader manage to put some stuff, but it's not interesting
		return undefined
	}

	const { id, current_exif_data } = state
	assert(current_exif_data !== undefined, `_get_creation_date_from_exif__internal(): ${id} exif data read`)

	const _from_exif__internal: ExifDateTime | undefined = _get_creation_date_from_exif__internal(state)
	if (!_from_exif__internal) return undefined

	const _from_exif__tz = _get_creation_tz_from_exif(state)
	return create_better_date_from_ExifDateTime(_from_exif__internal, _from_exif__tz)

}
function _get_creation_date_from_original_fs_stats(state: Immutable<State>): TimestampUTCMs {
	assert(state.current_fs_stats, 'fs stats collected')
	return state.notes.original.fs_birthtime_ms /* ?? get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)*/
}
function _get_creation_date_from_current_fs_stats(state: Immutable<State>): TimestampUTCMs {
	assert(state.current_fs_stats, 'fs stats collected')
	return get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)
}
function _get_creation_date_from_whatever_non_normalized_basename(state: Immutable<State>): BetterDate | null {
	if (!is_normalized_media_basename(get_oldest_basename(state)))
		if (state.memoized.get_parsed_original_basename(state).date)
			return state.memoized.get_parsed_original_basename(state).date!

	if (!is_normalized_media_basename(get_current_basename(state)))
		if (state.memoized.get_parsed_current_basename(state).date)
			return state.memoized.get_parsed_current_basename(state).date!

	return null
}
function _get_creation_date_from_whatever_normalized_basename(state: Immutable<State>): BetterDate | null {
	if (is_normalized_media_basename(get_oldest_basename(state)))
		return state.memoized.get_parsed_original_basename(state).date!

	if (is_normalized_media_basename(get_current_basename(state)))
		return state.memoized.get_parsed_current_basename(state).date!

	return null
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
function _is_matching(d1: Immutable<BetterDate>, d2: Immutable<BetterDate>, debug_id?: string): boolean {
	const tms1 = get_timestamp_utc_ms_from(d1)
	const tms2 = get_timestamp_utc_ms_from(d2)

	const auto1 = get_human_readable_timestamp_auto(d1, 'tz:embedded')
	const auto2 = get_human_readable_timestamp_auto(d2, 'tz:embedded')

	const is_tms_matching = is_same_date_with_potential_tz_difference(tms1, tms2)

	const [ longest, shortest ] = auto1.length >= auto2.length
		? [ auto1,        auto2 ]
		: [ auto2, auto1 ]
	const is_auto_matching = longest.startsWith(shortest)

	if (!is_tms_matching && !is_auto_matching) {
		if (debug_id) {
			logger.warn(`XXX _is_matching() yielded FALSE`, {
				id: debug_id,
				auto_from_exif: auto1,
				auto_from_fs__current: auto2,
				tms_from_exif: tms1,
				tms_from_fs__current: tms2,
				is_tms_matching,
				is_auto_matching,
			})
		}
		return false
	}

	return true
}
// TODO should be original FS?
export function is_current_fs_date_reliable__primary(state: Immutable<State>): boolean | undefined {
	assert(state.current_exif_data !== undefined, `is_current_fs_date_reliable__primary() is_exif_available`)

	if (!is_exif_powered_media_file(state))
		return undefined // don't know

	// TODO when we start doing FS normalization, detect that and discard the info since non primary

	const date__from_exif = _get_creation_date_from_exif(state)
	if (!date__from_exif) return undefined

	assert(state.current_fs_stats !== undefined, `are_fs_stats_read`)
	const date__from_fs__current = create_better_date_from_utc_tms(_get_creation_date_from_current_fs_stats(state), 'tz:auto')
	assert(_get_creation_date_from_current_fs_stats(state) === get_timestamp_utc_ms_from(date__from_fs__current), `current fs tms back and forth stability`)

	const is_matching = _is_matching(date__from_exif, date__from_fs__current, state.id)
	if (!is_matching) {
		console.warn('exif data', state.current_exif_data)
	}
	return is_matching
}
// all together
export type DateConfidence = 'primary' | 'secondary' | 'junk'
interface BestDate {
	candidate: BetterDate
	source:
		// primary
		| 'manual'
		| 'exif'
		| 'some_basename_nn' | 'some_basename_nn+fs'
		| 'original_fs+original_env_hints'
		| 'some_basename_normalized'
		| 'original_fs+env_hints'
		// secondary
		| 'env_hints'
		// junk
		| 'original_fs'
	confidence: DateConfidence // TODO redundant with source?
	is_fs_matching: boolean // useful for deciding to fix FS or not
}
export function get_best_creation_date_meta(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): BestDate {
	logger.trace('get_best_creation_date_meta()', { id: state.id })

	assert(has_all_infos_for_extracting_the_creation_date(state, { require_neighbors_hints: false }), 'has_all_infos_for_extracting_the_creation_date()')

	const tms__from_fs__original = _get_creation_date_from_original_fs_stats(state)
	const date__from_fs__original = create_better_date_from_utc_tms(tms__from_fs__original, 'tz:auto')
	assert(tms__from_fs__original === get_timestamp_utc_ms_from(date__from_fs__original), `original fs tms back and forth stability`)

	const result: BestDate = {
		candidate: date__from_fs__original,
		source: 'original_fs',
		confidence: 'junk',
		is_fs_matching: false, // init value
	}

	// TODO review algo of "is fs matching" when we start normalizing FS

	/////// PRIMARY SOURCES ///////

	// the strongest indicator = explicit user's will
	const date__from_manual = _get_creation_date_manual(state)
	logger.trace('get_best_creation_date_meta() trying manual…')
	if (date__from_manual) {
		throw new Error('NIMP use manual!')
	}

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const date__from_basename__whatever_non_normalized: BetterDate | null = _get_creation_date_from_whatever_non_normalized_basename(state)

	// strongest source after "manual"
	const date__from_exif = _get_creation_date_from_exif(state)
	logger.trace('get_best_creation_date_meta() trying EXIF…')
	if (date__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = date__from_exif
		result.source = 'exif'
		result.confidence = 'primary'
		result.is_fs_matching = _is_matching(date__from_fs__original, result.candidate)

		if (date__from_basename__whatever_non_normalized) {
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_basename = get_human_readable_timestamp_auto(date__from_basename__whatever_non_normalized, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_basename)) {
				// perfect match + EXIF more precise
			}
			else if (_is_matching(date__from_basename__whatever_non_normalized, result.candidate)) {
				// good enough, keep EXIF
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`get_best_creation_date_meta() EXIF/nn-basename discrepancy`, {
					basename: get_oldest_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(date__from_exif) - get_timestamp_utc_ms_from(date__from_basename__whatever_non_normalized)),
					id: state.id,
					//date__from_basename__whatever_non_normalized,
					auto_from_basename,
					//date__from_exif,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		return result
	}

	// second most authoritative source
	logger.trace('get_best_creation_date_meta() trying original basename NN…')
	if (date__from_basename__whatever_non_normalized) {
		result.candidate = date__from_basename__whatever_non_normalized
		result.source = 'some_basename_nn'
		result.confidence = 'primary'
		result.is_fs_matching = _is_matching(date__from_fs__original, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(date__from_fs__original, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.source = 'some_basename_nn+fs'
			result.candidate = date__from_fs__original
		}
		else if (result.is_fs_matching) {
			// good enough, switch to FS more precise
			// TODO review if tz could be an issue?
			/* TZ is an issue, we only accept perfect matches (case above)
			TODO try to investigate this FS issue
			result.source = 'some_basename_nn+fs'
			result.candidate = date__from_fs__original
			 */
		}
		else {
			// FS is notoriously unreliable, don't care when compared to this better source
		}

		return result
	}

	// FS is ok if confirmed by some primary hints
	logger.trace('get_best_creation_date_meta() trying FS + original hints…', { is_fs_confirmed_by_original_hints: state.notes.original.is_fs_birthtime_assessed_reliable })
	if (state.notes.original.is_fs_birthtime_assessed_reliable) {
		result.candidate = date__from_fs__original
		result.source = 'original_fs+original_env_hints'
		result.confidence = 'primary'
		result.is_fs_matching = true
		return result
	}

	// third = if original or current basename is already normalized,
	// since we only normalize on primary source of trust,
	// we trust our past self which may have had more info at the time
	const date__from_basename__whatever_normalized = _get_creation_date_from_whatever_normalized_basename(state)
	if (date__from_basename__whatever_normalized) {
		result.candidate = date__from_basename__whatever_normalized
		result.source = 'some_basename_normalized'
		result.confidence = 'primary'
		result.is_fs_matching = _is_matching(date__from_fs__original, result.candidate)

		// normalized is already super precise, no need to refine with FS

		return result
	}

	/////// SECONDARY SOURCES ///////
	// TODO review is that even useful?

	const date__from_any_parent_folder = _get_creation_date_from_any_current_parent_folder(state)
	if (date__from_any_parent_folder) {
		// weak source
		result.candidate = date__from_any_parent_folder
		result.source = 'env_hints'
		result.confidence = 'secondary'
		result.is_fs_matching = _is_matching(date__from_fs__original, result.candidate)

		return result
	}

	/////// JUNK SOURCE ///////

	// still the starting default
	assert(result.candidate === date__from_fs__original)
	assert(result.confidence === 'junk')
	result.is_fs_matching = true // obviously

	return result
}

export function get_best_creation_date(state: Immutable<State>): BetterDate {
	const meta = get_best_creation_date_meta(state)

	/*if (_get_creation_date_from_whatever_normalized_basename(state)) {
		const date_from_whatever_normalized_basename = _get_creation_date_from_whatever_normalized_basename(state)!
		assertㆍbetter_dateㆍdeepㆍequal(meta.candidate, date_from_whatever_normalized_basename)
	}*/

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
			meta: {
				...meta,
				candidate: get_debug_representation(meta.candidate),
			},
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

		if (requested_confidence && bcd_meta.confidence !== 'primary') {
			// not confident enough in getting the date, can't add the date
		}
		else {
			const bcd = bcd_meta.candidate
			const prefix = 'MM' + get_human_readable_timestamp_auto(bcd, 'tz:embedded')
			result = [ prefix, result ].filter(s => !!s).join('_') // take into account chance of result being empty so far
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
	const memoized_parse_original_basename = memoize_once(parse_basename)
	const memoized_parse_current_basename = memoize_once(parse_basename)
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

		return memoized_parse_original_basename(original_basename)
	}
	function get_parsed_current_basename(state: Immutable<State>) {
		const current_basename = get_current_basename(state)
		if (get_params().is_perfect_state) {
			if(!has_all_infos_for_extracting_the_creation_date(state, { should_log: false })) {
				assert(
					!is_normalized_media_basename(current_basename),
					`PERFECT STATE current basename should never be an already normalized basename "${current_basename}"!`
				)
			}
		}

		return memoized_parse_current_basename(current_basename)
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

		are_notes_restored: false,
		notes: {
			original: {
				basename: parsed_path.base,
				parent_path: parsed_path.dir,
				fs_birthtime_ms: get_UTC_timestamp_ms(), // so far
				is_fs_birthtime_assessed_reliable: undefined, // so far
			},

			deleted: undefined,
			starred: undefined,
			manual_date: undefined,

			currently_known_as: parsed_path.base,
			renaming_source: undefined,
		},

		are_neighbors_hints_collected: false,

		memoized: {
			get_parsed_path,
			get_parsed_original_basename,
			get_parsed_current_basename,
			get_normalized_extension,
		},
	}

	if (!is_exif_powered_media_file(state))
		state.current_exif_data = null

	return state
}

export function on_fs_stats_read(state: Immutable<State>, fs_stats_subset: Immutable<FsStatsSubset>): Immutable<State> {
	logger.trace(`${LIB} on_fs_stats_read(…)`, { })

	assert(fs_stats_subset, `on_fs_stats_read() params`)
	assert(state.current_fs_stats === undefined, `on_fs_stats_read() should not be called several times`)
	assert(!state.are_notes_restored, `on_fs_stats_read() notes`)

	// TODO add to a log for bad fs stats

	state = {
		...state,
		current_fs_stats: fs_stats_subset,
		notes: {
			...state.notes,
			original: {
				...state.notes.original,
				fs_birthtime_ms: get_most_reliable_birthtime_from_fs_stats(fs_stats_subset),
			}
		}
	}

	return state
}

export function on_exif_read(state: Immutable<State>, exif_data: Immutable<EXIFTags>): Immutable<State> {
	logger.trace(`${LIB} on_exif_read(…)`, { })

	assert(is_exif_powered_media_file(state), `on_exif_read() should expect EXIF`)
	assert(exif_data, 'on_exif_read() params')
	assert(state.current_exif_data === undefined, `on_exif_read() should not be called several times`)
	assert(!state.are_notes_restored, `on_exif_read() notes`)

	if (exif_data && exif_data.errors && exif_data.errors.length) {
		logger.error(`Error reading exif data for "${state.id}"!`, { errors: exif_data.errors })
		// XXX TODO mark file as "in error" to not be renamed / processed
		state = {
			...state,
			current_exif_data: null,
		}
	}

	// TODO memory optim cherry pick useful fields only

	state = {
		...state,
		current_exif_data: exif_data,
		notes: {
			...state.notes,
			original: {
				...state.notes.original,
				exif_orientation: get_orientation_from_exif(exif_data),
			}
		}
	}

	return state
}

export function on_hash_computed(state: Immutable<State>, hash: string): Immutable<State> {
	logger.trace(`${LIB} on_hash_computed(…)`, { })

	assert(hash, 'on_hash_computed() ok')
	assert(state.current_hash === undefined, `on_hash_computed() should not be called several times`)

	state = {
		...state,
		current_hash: hash,
	}

	return state
}

export function on_notes_recovered(state: Immutable<State>, recovered_notes: null | Immutable<PersistedNotes>): Immutable<State> {
	logger.trace(`${LIB} on_notes_recovered(…)`, { id: state.id, recovered_notes })

	assert(!state.are_notes_restored, `on_notes_recovered() should not be called several times`)
	assert(state.current_hash, 'on_notes_recovered() should be called based on the hash') // obvious but just in case…
	assert(state.current_exif_data !== undefined, 'on_notes_recovered() should be called after exif') // obvious but just in case…
	assert(state.current_fs_stats, 'on_notes_recovered() should be called after FS') // obvious but just in case…

	state = {
		...state,
		are_notes_restored: true,
		notes: {
			...state.notes,
			...recovered_notes,
			currently_known_as: get_parsed_path(state).base, // force keep this one
			original: {
				...state.notes.original,
				...recovered_notes?.original,
			},
		},
	}

	return state
}

export function on_neighbors_hints_collected(
	state: Immutable<State>,
	date_range_from_reliable_neighbors: null | [ SimpleYYYYMMDD, SimpleYYYYMMDD ],
	are_reliable_neighbors_fs_correct: undefined | boolean,
	PARAMS = get_params(),
): Immutable<State> {
	logger.trace(`${LIB} on_neighbors_hints_collected(…)`, { id: state.id, date_range_from_reliable_neighbors, are_reliable_neighbors_fs_correct })
	if (is_notes(state)) return state

	assert(!state.are_neighbors_hints_collected, `on_neighbors_hints_collected() should not be called several times ${state.id}`)
	assert(state.are_notes_restored, `on_neighbors_hints_collected() should be called after notes restoration ${state.id}`)

	state = {
		...state,
		are_neighbors_hints_collected: true,
	}

	if (is_first_file_encounter(state)) {
		const tms__from_fs__original = _get_creation_date_from_original_fs_stats(state)
		const date__from_fs__original = create_better_date_from_utc_tms(tms__from_fs__original, 'tz:auto')
		assert(tms__from_fs__original === get_timestamp_utc_ms_from(date__from_fs__original), `original fs tms back and forth stability`)

		const is_fs_birthtime_assessed_reliable: boolean | undefined = (() => {

			const date__from_parent_folder__original = _get_creation_date_from_original_parent_folder(state)
			if (date__from_parent_folder__original) {
				const tms___from_parent_folder__original = get_timestamp_utc_ms_from(date__from_parent_folder__original)

				if (tms__from_fs__original >= tms___from_parent_folder__original
					&& tms__from_fs__original < (tms___from_parent_folder__original + PARAMS.max_event_duration_in_days * DAY_IN_MILLIS)) {
					return true
				}
			}

			if (are_reliable_neighbors_fs_correct === false)
				return false

			if (date_range_from_reliable_neighbors) {
				const symd_range = date_range_from_reliable_neighbors
				const date_range__from_reliable_neighbors__original: [ BetterDate, BetterDate ] = symd_range.map(symd => create_better_date_from_simple(symd, 'tz:auto')) as any

				const tms__from_original_reliable_neighbors__begin = get_timestamp_utc_ms_from(
						date_range__from_reliable_neighbors__original[0],
					)
				const tms__from_original_reliable_neighbors__end = get_timestamp_utc_ms_from(
						date_range__from_reliable_neighbors__original[1],
					)

				// TODO allow a little bit of margin?
				if (tms__from_fs__original >= tms__from_original_reliable_neighbors__begin
					&& tms__from_fs__original <= tms__from_original_reliable_neighbors__end) {
					return true
				}
			}

			return undefined // equivalent to false
		})()

		logger.trace(`${LIB} on_neighbors_hints_collected(…) on first encounter, assessed the FS birthtime reliability`, {
			id: state.id,
			is_fs_birthtime_assessed_reliable,
		})

		state = {
			...state,
			notes: {
				...state.notes,
				original: {
					...state.notes.original,
					is_fs_birthtime_assessed_reliable,
				},
			},
		}
	}

	return state
}

export function on_moved(state: Immutable<State>, new_id: FileId): Immutable<State> {
	logger.trace(`${LIB} on_moved(…)`, { new_id })

	const previous_base = get_parsed_path(state).base
	const ideal_basename = get_ideal_basename(state)
	const meta = get_best_creation_date_meta(state)

	state =  {
		...state,
		id: new_id,
	}
	const parsed = get_parsed_path(state)

	state = {
		...state,
		notes: {
			...state.notes,
			currently_known_as: parsed.base,
		}
	}

	if (parsed.base !== previous_base && parsed.base === ideal_basename) {
		state = {
			...state,
			notes: {
				...state.notes,
				renaming_source: meta.source,
			}
		}
	}

	return state
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
			assert(duplicate_state.are_notes_restored, 'merge_duplicates(…) should happen after notes are restored (if any)')
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
		if (val.original.fs_birthtime_ms < acc[1]) {
			acc[0] = index
			acc[1] = val.original.fs_birthtime_ms
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
	const earliest_fs_birthtime = notes[index__earliest_birthtime].original.fs_birthtime_ms

	merged_notes = {
		...merged_notes,
		original: {
			...merged_notes.original,
			fs_birthtime_ms: earliest_fs_birthtime,
		}
	}

	// fill holes with whatever is defined, earliest wins
	logger.silly('merge_notes() notes so far', merged_notes)
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
		logger.silly('merge_notes() notes so far', merged_notes)
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
		if (!has_all_infos_for_extracting_the_creation_date(state, { should_log: false })) {
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

	if (base !== state.notes.original.basename || dir !== state.notes.original.parent_path) {
		// historically known as
		str += ` (Note: HKA "${state.notes.original.parent_path}/${state.notes.original.basename}")`
	}

	return stylize_string.gray.dim(str)
}
