import path from 'path'

import micro_memoize from 'micro-memoize'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
import { Tags as EXIFTags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { EXIF_POWERED_FILE_EXTENSIONS, NOTES_BASENAME_SUFFIX, DIGIT_PROTECTION_SEPARATOR } from '../consts'
import { Basename, RelativePath, SimpleYYYYMMDD, TimeZone } from '../types'
import { get_params, Params } from '../params'
import logger from '../services/logger'
import { FsStatsSubset, get_most_reliable_birthtime_from_fs_stats } from '../services/fs_stats'
import {
	get_best_creation_date_from_exif,
	get_creation_timezone_from_exif,
	get_orientation_from_exif,
} from '../services/exif'
import {
	ParseResult,
	get_file_basename_copy_index,
	get_file_basename_extension‿normalized,
	get_file_basename_without_copy_index,
	is_normalized_event_folder,
	is_processed_media_basename,
	parse_file_basename,
	parse_folder_basename,
} from '../services/name_parser'
import {
	BetterDate,
	get_human_readable_timestamp_auto,
	get_compact_date,
	create_better_date_from_utc_tms,
	create_better_date_from_ExifDateTime,
	get_timestamp_utc_ms_from,
	create_better_date_from_symd,
	is_same_date_with_potential_tz_difference,
	DAY_IN_MILLIS,
	get_debug_representation,
} from '../services/better-date'
import { FileHash } from '../services/hash'
import { is_digit } from '../services/matchers'

/////////////////////////////////////////////////

// Data that we'll destroy/modify but is worth keeping
export interface OriginalData {
	// TODO should we store the date of first encounter? would that add any information?

	/////// Data that we'll likely destroy but is precious:
	// - in itself
	// - to recompute the date with stability on subsequent runs
	// - to recompute the date properly in case of a bug or an improvement of our algo

	// from path
	basename: Basename // can contain the date + we "clean" it, maybe with bugs
	parent_path: RelativePath // can contain the event description + useful to manually re-sort in multi-level folder cases

	// from fs
	// we should always store it in case it changes for some reason + we may overwrite it
	fs_birthtime_ms: TimestampUTCMs
	is_fs_birthtime_assessed_reliable: undefined | boolean // aggregated from various info incl. neighbors at the time of the discovery

	// from exif bc. we'll change it in the future
	exif_orientation?: number
	//trailing_zeroed_bytes_cleaned: number // TODO fix macOs bug
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

	// for debug
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

	are_notes_restored: boolean // need to know to stop propagating current data to notes TODO remember if there were notes restored?
	notes: PersistedNotes

	are_neighbors_hints_collected: boolean
}

////////////////////////////////////

const LIB = '🖼 ' // iTerm has the wrong width 2020/12/15

///////////////////// ACCESSORS /////////////////////

export function get_current_relative_path(state: Immutable<State>): RelativePath {
	return state.id
}

const _path_parse_memoized = micro_memoize(path.parse, {
	// note: maybe premature
	maxSize: (1 + 1 + 5 + 5) * 10, // current base, original base, current path segments, original path segments...
})
export function get_current_path‿pathparsed(state: Immutable<State>): Immutable<path.ParsedPath> {
	return _path_parse_memoized(state.id)
}

export function get_current_basename(state: Immutable<State>): Basename {
	return get_current_path‿pathparsed(state).base
}

export function get_oldest_known_basename(state: Immutable<State>): Basename {
	assert(state.are_notes_restored, `get_oldest_known_basename() needs restored notes`)
	return state.notes.original.basename
}

export function get_current_basename‿parsed(state: Immutable<State>): Immutable<ParseResult> {
	return parse_file_basename(get_current_basename(state))
}

export function get_oldest_known_basename‿parsed(state: Immutable<State>): Immutable<ParseResult> {
	return parse_file_basename(get_oldest_known_basename(state))
}

export function get_current_extension‿normalized(state: Immutable<State>): string {
	return get_file_basename_extension‿normalized(get_current_basename(state))
}

export function get_current_parent_folder_id(state: Immutable<State>): RelativePath {
	return get_current_path‿pathparsed(state).dir || '.'
}

export function get_current_top_parent_folder_id(state: Immutable<State>): RelativePath {
	return get_current_relative_path(state).split(path.sep)[0] || '.'
}

export function is_notes(state: Immutable<State>): boolean {
	return get_current_basename(state).endsWith(NOTES_BASENAME_SUFFIX)
}

export function is_media_file(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): boolean {
	const path_parsed = get_current_path‿pathparsed(state)

	const is_invisible_file = path_parsed.base.startsWith('.')
	if (is_invisible_file) return false

	let normalized_extension = get_current_extension‿normalized(state)
	return PARAMS.extensions_of_media_files‿lc.includes(normalized_extension)
}

export function is_exif_powered_media_file(state: Immutable<State>): boolean {
	if (!is_media_file(state)) return false

	let normalized_extension = get_current_extension‿normalized(state)

	return EXIF_POWERED_FILE_EXTENSIONS.includes(normalized_extension)
}

export function has_all_infos_for_extracting_the_creation_date(state: Immutable<State>, { should_log = true as boolean, require_neighbors_hints = true as boolean}): boolean {
	// TODO optim if name = canonical?

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

// TODO improve with tracking
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
function _get_creation_date_from_exif__edt(state: Immutable<State>): ExifDateTime | undefined {
	const { id, current_exif_data } = state

	assert(!!current_exif_data, `_get_creation_date_from_exif__edt(): ${id} exif data available`)

	try {
		return get_best_creation_date_from_exif(current_exif_data)
	}
	catch (err) {
		logger.fatal(`_get_creation_date_from_exif__edt() error for "${id}"!`, { err })
		throw err
	}
}
function _get_creation_tz_from_exif(state: Immutable<State>): TimeZone | undefined {
	const { id, current_exif_data } = state

	assert(!!current_exif_data, `_get_creation_tz_from_exif(): ${id} exif data available`)

	try {
		return get_creation_timezone_from_exif(current_exif_data)
	}
	catch (err) {
		logger.fatal(`_get_creation_tz_from_exif() error for "${id}"!`, { err })
		throw err
	}
}
function _get_creation_date_from_exif(state: Immutable<State>): BetterDate | undefined {
	const { id, current_exif_data } = state

	assert(current_exif_data !== undefined, `_get_creation_date_from_exif(): ${id} exif data should have been read`)

	if (!is_exif_powered_media_file(state)) {
		assert(current_exif_data === null, `_get_creation_date_from_exif(): ${id} exif data should be null for non-exif media`)
		return undefined
	}

	assert(current_exif_data !== null, `_get_creation_date_from_exif(): ${id} exif data should not be empty for an exif-powered media`)

	const _from_exif__internal: ExifDateTime | undefined = _get_creation_date_from_exif__edt(state)
	if (!_from_exif__internal) return undefined

	const _from_exif__tz = _get_creation_tz_from_exif(state)
	return create_better_date_from_ExifDateTime(_from_exif__internal, _from_exif__tz)
}
function _get_creation_date_from_original_fs_stats(state: Immutable<State>): TimestampUTCMs {
	assert(state.are_notes_restored, `_get_creation_date_from_original_fs_stats() needs notes restored`)
	// TODO one day ignore if we implement FS normalization & original basename is processed
	return state.notes.original.fs_birthtime_ms
}
function _get_creation_date_from_current_fs_stats(state: Immutable<State>): TimestampUTCMs {
	assert(state.current_fs_stats, '_get_creation_date_from_current_fs_stats() fs stats collected')
	return get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)
}
function _get_creation_date_from_original_basename(state: Immutable<State>): BetterDate | undefined {
	assert(state.are_notes_restored, `_get_creation_date_from_original_basename() needs notes restored`)

	const oldest_known_basename = get_oldest_known_basename(state)

	if (is_processed_media_basename(oldest_known_basename)) {
		// this is not the original basename, we lost the info...
		logger.warn(`_get_creation_date_from_original_basename() lost the original basename`, {
			id: state.id,
			oldest_known_basename,
		})
		return undefined
	}

	const parsed = get_oldest_known_basename‿parsed(state)
	return parsed.date
}
function _get_creation_date_from_whatever_non_processed_basename(state: Immutable<State>): BetterDate | undefined {
	if (!is_processed_media_basename(get_oldest_known_basename(state))) {
		const parsed = get_oldest_known_basename‿parsed(state)
		if (parsed.date)
			return parsed.date
	}

	if (!is_processed_media_basename(get_current_basename(state))) {
		const parsed = get_current_basename‿parsed(state)
		if (parsed.date)
			return parsed.date
	}

	return undefined
}
function _get_creation_date_from_whatever_already_processed_basename(state: Immutable<State>): BetterDate | undefined {
	if (is_processed_media_basename(get_oldest_known_basename(state)))
		return get_oldest_known_basename‿parsed(state).date!

	if (is_processed_media_basename(get_current_basename(state)))
		return get_current_basename‿parsed(state).date!

	return undefined
}
// junk
function _get_creation_date_from_original_parent_folder(state: Immutable<State>): BetterDate | undefined {
	assert(state.are_notes_restored, `_get_creation_date_from_original_parent_folder() needs notes restored`)

	if (is_processed_media_basename(get_oldest_known_basename(state))) {
		// this is not the original parent folder, we lost the info...
		// (warned already in other selector)
		return undefined
	}

	let rel_folder_path = state.notes.original.parent_path
	while (rel_folder_path) {
		const path_parsed = _path_parse_memoized(rel_folder_path)
		const parsed_basename = parse_folder_basename(path_parsed.base)
		if (parsed_basename.date) {
			return parsed_basename.date
		}
		rel_folder_path = path_parsed.dir
	}

	return undefined
}
function _get_creation_date_from_any_parent_folder(state: Immutable<State>): BetterDate | undefined {
	const from_original = _get_creation_date_from_original_parent_folder(state)
	if (from_original) return from_original

	let rel_folder_path = get_current_parent_folder_id(state)
	while (rel_folder_path) {
		const path_parsed = _path_parse_memoized(rel_folder_path)
		const parsed_basename = parse_folder_basename(path_parsed.base)
		if (parsed_basename.date) {
			return parsed_basename.date
		}
		rel_folder_path = path_parsed.dir
	}

	return undefined
}
// misc
function _are_dates_matching(d1: Immutable<BetterDate>, d2: Immutable<BetterDate>, debug_id?: string): boolean {
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
			logger.warn(`_is_matching() yielded FALSE`, {
				id: debug_id,
				auto1,
				auto2,
				tms1,
				tms2,
				is_tms_matching,
				is_auto_matching,
				diff_s: Math.abs(tms2 - tms1) / 1000.,
			})
		}
		return false
	}

	return true
}
export function is_current_fs_date_confirmed_by_trustable_other_current_date_sources(state: Immutable<State>): boolean | undefined {
	assert(state.current_exif_data !== undefined, `is_current_fs_date_confirmed_by_trustable_other_current_date_sources() is_exif_available`)

	if (!is_exif_powered_media_file(state))
		return undefined // no way to know

	// TODO when we start doing FS normalization, detect that and discard the info since non primary

	const date__from_exif = _get_creation_date_from_exif(state)
	if (!date__from_exif) return undefined

	assert(state.current_fs_stats !== undefined, `is_current_fs_date_confirmed_by_trustable_other_current_date_sources() fs_stats_read`)
	const date__from_fs__current = create_better_date_from_utc_tms(_get_creation_date_from_current_fs_stats(state), 'tz:auto')
	assert(_get_creation_date_from_current_fs_stats(state) === get_timestamp_utc_ms_from(date__from_fs__current), `current fs tms back and forth stability`)

	const is_matching = _are_dates_matching(date__from_exif, date__from_fs__current, state.id)
	if (!is_matching) {
		logger.log('⚠️ is_current_fs_date_confirmed_by_trustable_other_current_date_sources() yielding FALSE', state.current_exif_data!)
	}
	return is_matching
}
// all together
export type DateConfidence = 'primary' | 'secondary' | 'junk' // 1 = we can match to event and rename, 2 = we can match to an event, 3 = neither
interface BestDate {
	candidate: BetterDate
	source:
		// primary
		| 'manual'
		// primary -- original
		| 'exif'
		| 'original_basename_np' | 'original_basename_np+fs'
		| 'original_fs+original_env_hints'

		| 'some_basename_np' | 'some_basename_np+fs'
		| 'some_basename_p'

		// secondary
		| 'env_hints'

		// junk
		| 'original_fs'
	confidence: DateConfidence // TODO redundant with source?
	from_original: boolean // TODO redundant with source?
	// TODO review algo of "is fs matching" when we start normalizing FS -> ignore if already normalized?
	is_fs_matching: boolean // useful for deciding to fix FS or not
}

// for stability, we try to rely on the original data first and foremost
// (this func should NOT rely on anything else than TRUELY ORIGINAL data)
// TODO UT
export function _get_best_creation_date_meta__from_original_data(state: Immutable<State>, PARAMS = get_params()): BestDate {
	logger.trace(`_get_best_creation_date_meta__from_original_data()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, { require_neighbors_hints: false }),
		'_get_best_creation_date_meta__from_original_data() has_all_infos_for_extracting_the_creation_date()'
	)

	// TODO when implementing FS normalization, may not be original and should be discarded
	const tms__from_fs__original = _get_creation_date_from_original_fs_stats(state)
	const date__from_fs__original = create_better_date_from_utc_tms(tms__from_fs__original, 'tz:auto')
	assert(tms__from_fs__original === get_timestamp_utc_ms_from(date__from_fs__original), `original fs tms back and forth stability`)

	const result: BestDate = {
		candidate: date__from_fs__original,
		source: 'original_fs',
		confidence: 'junk',
		from_original: true,
		is_fs_matching: false, // init value
	}

	/////// PRIMARY SOURCES ///////

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const date__from_basename__original: BetterDate | undefined = _get_creation_date_from_original_basename(state)

	// strongest source outside of "manual"
	const date__from_exif = _get_creation_date_from_exif(state)
	logger.trace('_get_best_creation_date_meta__from_original_data() trying EXIF…')
	if (date__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = date__from_exif
		result.source = 'exif'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching(date__from_fs__original, result.candidate)

		if (date__from_basename__original) {
			// cross check
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_basename = get_human_readable_timestamp_auto(date__from_basename__original, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_basename)) {
				// perfect match + EXIF more precise
			}
			else if (_are_dates_matching(date__from_basename__original, result.candidate)) {
				// good enough, keep EXIF
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`_get_best_creation_date_meta__from_original_data() EXIF/original-basename discrepancy`, {
					oldest_known_basename: get_oldest_known_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(date__from_exif) - get_timestamp_utc_ms_from(date__from_basename__original)),
					id: state.id,
					auto_from_basename,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		logger.trace(`_get_best_creation_date_meta__from_original_data() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// second most authoritative source
	logger.trace('_get_best_creation_date_meta__from_original_data() trying original basename (non processed)…')
	if (date__from_basename__original) {
		result.candidate = date__from_basename__original
		result.source = 'original_basename_np'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching(date__from_fs__original, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(date__from_fs__original, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.source = 'original_basename_np+fs'
			result.candidate = date__from_fs__original
		}
		else if (result.is_fs_matching) {
			// good enough, switch to FS more precise
			// TODO review if tz could be an issue?
			/* TZ is an issue, we only accept perfect matches (case above)
			TODO try to investigate this FS issue
			result.source = 'some_basename_np+fs'
			result.candidate = date__from_fs__original
			 */
		}
		else {
			// FS is notoriously unreliable, don't care when compared to this better source
		}

		logger.trace(`_get_best_creation_date_meta__from_original_data() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// FS is ok if confirmed by some primary hints
	// TODO clarify the hint
	logger.trace('_get_best_creation_date_meta__from_original_data() trying FS + original hints…', {
		are_neighbors_hints_collected: state.are_neighbors_hints_collected,
		is_fs_confirmed_by_original_hints: state.notes.original.is_fs_birthtime_assessed_reliable,
	})
	if (state.are_neighbors_hints_collected && state.notes.original.is_fs_birthtime_assessed_reliable) {
		result.candidate = date__from_fs__original
		result.source = 'original_fs+original_env_hints'
		result.confidence = 'primary'
		result.is_fs_matching = true

		logger.trace(`_get_best_creation_date_meta__from_original_data() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// already processed original basename?
	// it's not original, don't rely on it...

	/////// SECONDARY SOURCES ///////
	// TODO review is that even useful?

	logger.trace('_get_best_creation_date_meta__from_original_data() trying FS if reliability unknown…', {
		are_neighbors_hints_collected: state.are_neighbors_hints_collected,
		is_fs_birthtime_assessed_reliability_unknown: state.notes.original.is_fs_birthtime_assessed_reliable === undefined,
	})
	if (state.are_neighbors_hints_collected && state.notes.original.is_fs_birthtime_assessed_reliable === undefined) {
		// not that bad
		// we won't rename the file, but good enough to match to an event
		result.candidate = date__from_fs__original
		result.source = 'original_fs+original_env_hints'
		result.confidence = 'secondary'
		result.is_fs_matching = true

		logger.trace(`_get_best_creation_date_meta__from_original_data() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	/////// JUNK SOURCES ///////

	// borderline secondary/junk
	const date__from_parent_folder__original = _get_creation_date_from_original_parent_folder(state)
	if (date__from_parent_folder__original) {
		// dangerous source
		// ex. a phone backup spanning a 6mth period may have the backup date
		const tms__from_parent_folder__original = get_timestamp_utc_ms_from(date__from_parent_folder__original)
		const looks_like_event_date = (tms__from_fs__original >= tms__from_parent_folder__original
			&& tms__from_fs__original < (tms__from_parent_folder__original + PARAMS.max_event_durationⳇₓday * DAY_IN_MILLIS))
		result.candidate = date__from_parent_folder__original
		result.source = 'env_hints'
		result.confidence = looks_like_event_date ? 'secondary' : 'junk'
		result.is_fs_matching = _are_dates_matching(date__from_fs__original, result.candidate)

		logger.trace(`_get_best_creation_date_meta__from_original_data() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// still the starting default
	assert(result.candidate === date__from_fs__original)
	assert(result.confidence === 'junk')
	result.is_fs_matching = true // obviously

	logger.trace(`_get_best_creation_date_meta__from_original_data() used ${result.source} with confidence = ${result.confidence} ✔`)
	return result
}

export const get_best_creation_date_meta = micro_memoize(function get_best_creation_date_meta(state: Immutable<State>, PARAMS = get_params()): BestDate {
	logger.trace(`get_best_creation_date_meta()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, { require_neighbors_hints: false }),
		'get_best_creation_date_meta() has_all_infos_for_extracting_the_creation_date()'
	)

	const tms__from_fs__oldest_known = _get_creation_date_from_original_fs_stats(state)
	const date__from_fs__oldest_known = create_better_date_from_utc_tms(tms__from_fs__oldest_known, 'tz:auto')
	assert(tms__from_fs__oldest_known === get_timestamp_utc_ms_from(date__from_fs__oldest_known), `original fs tms back and forth stability`)

	const result: BestDate = {
		candidate: date__from_fs__oldest_known,
		source: 'original_fs',
		confidence: 'junk',
		from_original: false,
		is_fs_matching: false, // init value
	}

	/////// PRIMARY SOURCES ///////

	// the strongest indicator = explicit user's will
	const date__from_manual = _get_creation_date_manual(state)
	logger.trace('get_best_creation_date_meta() trying manual…')
	if (date__from_manual) {
		throw new Error('NIMP use manual!')
	}

	// then rely on original data as much as possible
	logger.trace('get_best_creation_date_meta() trying original data…')
	const meta__from_original = _get_best_creation_date_meta__from_original_data(state, PARAMS)
	if (meta__from_original.confidence === 'primary') {
		logger.trace(`get_best_creation_date_meta() used original data result ✔`)
		return meta__from_original
	}

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const date__from_basename__whatever_non_processed: BetterDate | undefined = _get_creation_date_from_whatever_non_processed_basename(state)

	// strongest source after "manual"
	const date__from_exif = _get_creation_date_from_exif(state)
	logger.trace('get_best_creation_date_meta() trying EXIF…')
	if (date__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = date__from_exif
		result.source = 'exif'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching(date__from_fs__oldest_known, result.candidate)

		if (date__from_basename__whatever_non_processed) {
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_np_basename = get_human_readable_timestamp_auto(date__from_basename__whatever_non_processed, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_np_basename)) {
				// perfect match + EXIF more precise
			}
			else if (_are_dates_matching(date__from_basename__whatever_non_processed, result.candidate)) {
				// good enough, keep EXIF
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`get_best_creation_date_meta() EXIF/np-basename discrepancy`, {
					basename: get_current_basename(state),
					oldest_known_basename: get_oldest_known_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(date__from_exif) - get_timestamp_utc_ms_from(date__from_basename__whatever_non_processed)),
					id: state.id,
					auto_from_np_basename,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		logger.trace(`get_best_creation_date_meta() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// second most authoritative source
	logger.trace('get_best_creation_date_meta() trying any basename NP…')
	if (date__from_basename__whatever_non_processed) {
		result.candidate = date__from_basename__whatever_non_processed
		result.source = 'some_basename_np'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching(date__from_fs__oldest_known, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(date__from_fs__oldest_known, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.source = 'some_basename_np+fs'
			result.candidate = date__from_fs__oldest_known
		}
		else if (result.is_fs_matching) {
			// good enough, switch to FS more precise
			// TODO review if tz could be an issue?
			/* TZ is an issue, we only accept perfect matches (case above)
			TODO try to investigate this FS issue
			result.source = 'some_basename_np+fs'
			result.candidate = date__from_fs__oldest_known
			 */
		}
		else {
			// FS is notoriously unreliable, don't care when compared to this better source
		}

		logger.trace(`get_best_creation_date_meta() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// FS is handled by the "_original()" selector

	// third = if original or current basename is already normalized,
	// since we only normalize on primary source of trust,
	// we trust our past self which may have had more info at the time
	// XXX how about algorithm fix?? TODO review
	const date__from_basename__whatever_processed = _get_creation_date_from_whatever_already_processed_basename(state)
	logger.trace('get_best_creation_date_meta() trying whatever date even already processed…', { has_candidate: !!date__from_basename__whatever_processed })
	if (date__from_basename__whatever_processed) {
		result.candidate = date__from_basename__whatever_processed
		result.source = 'some_basename_p'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching(date__from_fs__oldest_known, result.candidate)

		// normalized is already super precise, no need to refine with FS
		// TODO review what if algo improvement?

		logger.trace(`get_best_creation_date_meta() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	/////// SECONDARY SOURCES ///////
	// TODO review is that even useful?

	if (meta__from_original.confidence === 'secondary') {
		logger.trace(`get_best_creation_date_meta() used original data result ✔`)
		return meta__from_original
	}

	// TODO use current folder fs reliability??

	/////// JUNK SOURCE ///////

	// borderline secondary/junk
	const date__from_parent_folder__any = _get_creation_date_from_any_parent_folder(state)
	if (date__from_parent_folder__any) {
		// dangerous source
		// ex. a phone backup spanning a 6mth period may have the backup date
		const tms__from_parent_folder__any = get_timestamp_utc_ms_from(date__from_parent_folder__any)
		const looks_like_event_date = (tms__from_fs__oldest_known >= tms__from_parent_folder__any
			&& tms__from_fs__oldest_known < (tms__from_parent_folder__any + PARAMS.max_event_durationⳇₓday * DAY_IN_MILLIS))
		result.candidate = date__from_parent_folder__any
		result.source = 'env_hints'
		result.confidence = looks_like_event_date ? 'secondary' : 'junk'
		result.is_fs_matching = _are_dates_matching(date__from_fs__oldest_known, result.candidate)

		logger.trace(`get_best_creation_date_meta() used ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// at this level, original is still better
	logger.trace(`get_best_creation_date_meta() used original data result ✔`)
	return meta__from_original
}, {
	maxSize: 10, // we need 1 or millions. The >1 is for having less noise during unit tests across a few files
	onCacheHit() {
		logger.trace(`get_best_creation_date_meta()… [memoized hit]`)
	}
})

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

export function is_confident_in_date(state: Immutable<State>, up_to: DateConfidence = 'primary'): boolean {
	const meta = get_best_creation_date_meta(state)
	const { confidence } = meta

	let is_confident = false
	switch (confidence) {
		case 'primary':
			is_confident = true
			break

		case 'secondary':
			is_confident = ( up_to === 'secondary')
			break

		case 'junk':
			is_confident = false
			break
	}

	if (!is_confident) {
		logger.warn(`get_confidence_in_date() low confidence`, {
			id: state.id,
			up_to,
			meta: {
				...meta,
				candidate: get_debug_representation(meta.candidate),
			},
		})
	}

	return is_confident
}

export function is_date_from_original_data(state: Immutable<State>): boolean {
	const meta = get_best_creation_date_meta(state)
	return meta.from_original
}

export function get_ideal_basename(state: Immutable<State>, {
	PARAMS = get_params(),
	copy_marker = 'none',
	requested_confidence = true, // unit tests
}: {
	PARAMS?: Immutable<Params>
	requested_confidence?: boolean
	copy_marker?: 'none' | 'preserve' | 'temp' | number
} = {}): Basename {
	const parsed_oldest_known_basename = get_oldest_known_basename‿parsed(state)
	const meaningful_part = parsed_oldest_known_basename.meaningful_part
	let extension = parsed_oldest_known_basename.extension_lc
	extension = PARAMS.extensions_to_normalize‿lc[extension] || extension

	logger.trace(`get_ideal_basename()`, {
		is_media_file: is_media_file(state),
		parsed_oldest_known_basename,
	})

	let result = meaningful_part // so far
	if (meaningful_part.endsWith(')')) {
		logger.warn('⚠️⚠️⚠️ TODO check meaningful_part.endsWith copy index??', { current_id: state.id, parsed_oldest_known_basename })
	}

	if (is_media_file(state)) {
		const bcd_meta = get_best_creation_date_meta(state)

		switch (bcd_meta.confidence) {
			case 'junk':
				break
			// @ts-ignore
			case 'secondary':
				if (requested_confidence) {
					// not confident enough in getting the date, can't add the date
					break
				}
				/* fallthrough */
			case 'primary':
			default:
				const bcd = bcd_meta.candidate
				const prefix = 'MM' + get_human_readable_timestamp_auto(bcd, 'tz:embedded')
				if (is_digit(result[0])) {
					// protection to prevent future executions to parse the meaningful part as DD/HH/MM/SS
					result = DIGIT_PROTECTION_SEPARATOR + result
				}
				result = [ prefix, result ].filter(s => !!s).join('_') // take into account chance of result being empty so far
		}
	}

	switch (copy_marker) {
		case 'none':
			break
		case 'preserve':
			if (parsed_oldest_known_basename.copy_index)
				result += ` (${parsed_oldest_known_basename.copy_index})`
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

	const parsed_path = _path_parse_memoized(id)

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
	}

	if (!is_exif_powered_media_file(state))
		state.current_exif_data = null

	if (get_params().expect_perfect_state) {
		assert(
			!is_processed_media_basename(get_current_basename(state)),
			`PERFECT STATE current basename should never be an already processed basename "${get_current_basename(state)}"!`
		)
	}

	return state
}

// Those "on_info_read..." happens first and have no inter-dependencies

export function on_info_read__fs_stats(state: Immutable<State>, fs_stats_subset: Immutable<FsStatsSubset>): Immutable<State> {
	logger.trace(`${LIB} on_info_read__fs_stats(…)`, { })

	assert(fs_stats_subset, `on_info_read__fs_stats() params`)
	assert(state.current_fs_stats === undefined, `on_info_read__fs_stats() should not be called several times`)
	assert(!state.are_notes_restored, `on_info_read__fs_stats() notes should not be restored yet`)

	// TODO add to a log for bad fs stats

	state = {
		...state,
		current_fs_stats: fs_stats_subset,
		notes: {
			...state.notes,
			original: {
				// as far as we know we are dealing with the original
				...state.notes.original,
				fs_birthtime_ms: get_most_reliable_birthtime_from_fs_stats(fs_stats_subset),
			}
		}
	}

	return state
}

export function on_info_read__exif(state: Immutable<State>, exif_data: Immutable<EXIFTags>): Immutable<State> {
	logger.trace(`${LIB} on_info_read__exif(…)`, { })

	assert(is_exif_powered_media_file(state), `on_info_read__exif() should expect EXIF`)
	assert(exif_data, 'on_info_read__exif() params')
	assert(state.current_exif_data === undefined, `on_info_read__exif() should not be called several times`)
	assert(!state.are_notes_restored, `on_info_read__exif() notes should not be restored yet`)

	if (exif_data && exif_data.errors && exif_data.errors.length) {
		logger.error(`Error reading exif data for "${state.id}"!`, { errors: exif_data.errors })
		// XXX TODO mark file as "in error" to not be renamed / processed
		return {
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
				// as far as we know we are dealing with the original
				...state.notes.original,
				exif_orientation: get_orientation_from_exif(exif_data),
			}
		}
	}

	return state
}

export function on_info_read__hash(state: Immutable<State>, hash: string): Immutable<State> {
	logger.trace(`${LIB} on_info_read__hash(…)`, { })

	assert(hash, 'on_info_read__hash() ok')
	assert(state.current_hash === undefined, `on_info_read__hash() should not be called several times`)

	state = {
		...state,
		current_hash: hash,
	}

	return state
}

// TODO clarify!
export function on_info_read__current_neighbors_hints(
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

	// TODO should not matter if first encounter
	if (is_first_file_encounter(state)) {
		const tms__from_fs__original = _get_creation_date_from_original_fs_stats(state)
		const date__from_fs__original = create_better_date_from_utc_tms(tms__from_fs__original, 'tz:auto')
		assert(tms__from_fs__original === get_timestamp_utc_ms_from(date__from_fs__original), `original fs tms back and forth stability`)

		// XXX clarify
		// we can already assess that thanks to exif
		const is_fs_birthtime_assessed_reliable: boolean | undefined = (() => {

			const date__from_parent_folder__original = _get_creation_date_from_original_parent_folder(state)
			if (date__from_parent_folder__original) {
				const tms__from_parent_folder__original = get_timestamp_utc_ms_from(date__from_parent_folder__original)

				if (tms__from_fs__original >= tms__from_parent_folder__original
					&& tms__from_fs__original < (tms__from_parent_folder__original + PARAMS.max_event_durationⳇₓday * DAY_IN_MILLIS)) {
					return true
				}
			}

			if (are_reliable_neighbors_fs_correct === false)
				return false

			if (date_range_from_reliable_neighbors) {
				const symd_range = date_range_from_reliable_neighbors
				const date_range__from_reliable_neighbors__original: [ BetterDate, BetterDate ] = symd_range.map(symd => create_better_date_from_symd(symd, 'tz:auto')) as any

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

// happens AFTER on_info_read...

export function on_notes_recovered(state: Immutable<State>, recovered_notes: null | Immutable<PersistedNotes>): Immutable<State> {
	logger.trace(`${LIB} on_notes_recovered(…)`, { id: state.id, recovered_notes })

	if (state.are_notes_restored) {
		// FOR DEBUG
		// seen in very rare cases
		// - manual copy/paste for test where a media and a non-media file have the same hash
		// - strange case = collision???
		console.error('PENDING ERROR BELOW', state)
	}
	assert(!state.are_notes_restored, `on_notes_recovered() should not be called several times`)

	assert(state.current_hash, 'on_notes_recovered() should be called based on the hash') // obvious but just in case…
	assert(state.current_exif_data !== undefined, 'on_notes_recovered() should be called after exif') // obvious but just in case…
	assert(state.current_fs_stats, 'on_notes_recovered() should be called after FS') // obvious but just in case…

	// TODO track whether we are the original? hard to know later
	if (recovered_notes) {
		const current_ext‿norm = get_current_extension‿normalized(state)
		const original_ext‿norm = get_file_basename_extension‿normalized(recovered_notes.original.basename)
		assert(current_ext‿norm === original_ext‿norm, `recovered notes should refer to the same file type! "${current_ext‿norm}" vs. "${original_ext‿norm}`)
	}

	state = {
		...state,
		are_notes_restored: true,
		notes: {
			...state.notes,
			...recovered_notes,
			currently_known_as: get_current_basename(state), // force keep this one
			original: {
				...state.notes.original,
				...recovered_notes?.original,
			},
		},
	}

	if (get_params().expect_perfect_state) {
		assert(
			!is_processed_media_basename(get_oldest_known_basename(state)),
			`PERFECT STATE original basename should never be an already processed basename "${get_oldest_known_basename(state)}"!`
		)
	}

	return state
}

export function on_moved(state: Immutable<State>, new_id: FileId): Immutable<State> {
	logger.trace(`${LIB} on_moved(…)`, { previous_id: state.id, new_id })
	assert(new_id !== state.id, `on_moved() should be a real move`)

	const previous_basename = get_current_basename(state)
	const ideal_basename = get_ideal_basename(state)
	const meta = get_best_creation_date_meta(state)

	state =  {
		...state,
		id: new_id,
	}

	const new_basename = get_current_basename(state)
	state = {
		...state,
		notes: {
			...state.notes,
			currently_known_as: new_basename,
		}
	}

	if (new_basename !== previous_basename) {
		const new_basename_without_copy_index = get_file_basename_without_copy_index(new_basename)
		if(new_basename_without_copy_index !== ideal_basename) {
			// can that happen?
			assert(new_basename_without_copy_index === ideal_basename, `file renaming should only be a normalization! ~"${new_basename_without_copy_index}"`)
		}
		else {
			state = {
				...state,
				notes: {
					...state.notes,
					renaming_source: meta.source,
				}
			}
		}
	}

	return state
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { id } = state
	const is_eligible = is_media_file(state)
	const path_parsed = get_current_path‿pathparsed(state)
	const { dir, base } = path_parsed

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

///////////////////// SPECIAL /////////////////////

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
		const selected__has_normalized_basename = get_file_basename_without_copy_index(get_current_basename(selected_state)) === get_ideal_basename(selected_state)
		const candidate__has_normalized_basename = get_file_basename_without_copy_index(get_current_basename(candidate_state)) === get_ideal_basename(candidate_state)
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
			// we try to keep the already normalized one
			reasons.add('normalized_parent_folder')

			if (selected__has_normalized_parent_folder)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		let selected__current_copy_index = get_file_basename_copy_index(get_current_basename(selected_state))
		let candidate__current_copy_index = get_file_basename_copy_index(get_current_basename(candidate_state))
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
		const selected__current_fs_creation_date_tms = _get_creation_date_from_current_fs_stats(selected_state)
		const candidate__current_fs_creation_date_tms = _get_creation_date_from_current_fs_stats(candidate_state)
		if (selected__current_fs_creation_date_tms !== candidate__current_fs_creation_date_tms) {
			reasons.add('current_fs_creation_date')
			//console.log('different best_creation_date', selected__best_creation_date_tms, candidate__best_creation_date_tms)
			// earliest file wins

			if (selected__current_fs_creation_date_tms <= candidate__current_fs_creation_date_tms)
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

		// still equal so far, try to discriminate with another criteria
		if (selected_state.id.length !== candidate_state.id.length) {
			reasons.add('current_id.length')

			// shorter name wins!
			if (selected_state.id.length < candidate_state.id.length)
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
	const index__non_processed_basename = notes.findIndex(n => !is_processed_media_basename(n.original.basename))
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
		if (candidate.length < acc[1] && !is_processed_media_basename(candidate)) {
			acc[0] = index
			acc[1] = candidate.length
		}
		return acc
	}, [-1, Number.POSITIVE_INFINITY])[0]

	let index__best_starting_candidate = index__shortest_non_normalized_basename >= 0
		? index__shortest_non_normalized_basename
		: index__non_processed_basename >= 0
			? index__non_processed_basename
			:  index__earliest_birthtime >= 0 // fs time really unreliable
				? index__earliest_birthtime
				: 0
	let merged_notes = notes[index__best_starting_candidate]
	assert(merged_notes, 'merge_notes(…) selected a starting point')

	logger.silly(`merge_notes(…)`, {
		index__best_starting_candidate,
		index__shortest_non_normalized_basename,
		index__non_normalized_basename: index__non_processed_basename,
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
	if (is_processed_media_basename(merged_notes.original.basename)) {
		logger.warn(`merge_notes(): ?? final original basename "${merged_notes.original.basename}" is already processed`)
	}

	return merged_notes
}
