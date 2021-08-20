/////////////////////////////////////////////////
// Important concepts:
// - BCD = Best Creation Date
// - "oldest known" vs. "original"
//   What is contain in "original" may not be the original
//   Sometimes we explicitly want the original and will fail if not original.
// - FS reliability
//   We'd rather mis-sort than not sort, for manual sorting is harder than manual fixing
/////////////////////////////////////////////////

import path from 'path'

import micro_memoize from 'micro-memoize'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
import { Tags as EXIFTags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import {
	EXIF_POWERED_FILE_EXTENSIONS_LC,
	NOTES_BASENAME_SUFFIX_LC,
	DIGIT_PROTECTION_SEPARATOR,
} from '../consts'
import {
	Basename,
	RelativePath,
	SimpleYYYYMMDD,
	TimeZone,
} from '../types'
import { Params, get_params } from '../params'
import logger from '../services/logger'
import {
	FsStatsSubset,
	get_most_reliable_birthtime_from_fs_stats,
} from '../services/fs_stats'
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
	is_normalized_event_folder_relpath,
	is_processed_media_basename,
	parse_file_basename,
	pathㆍparse_memoized,
} from '../services/name_parser'
import {
	BetterDate,
	BetterDateMembers,
	get_human_readable_timestamp_auto,
	get_compact_date,
	create_better_date_from_utc_tms,
	create_better_date_from_ExifDateTime,
	get_timestamp_utc_ms_from,
	is_same_date_with_potential_tz_difference,
	get_debug_representation,
	create_better_date_obj, get_members,
	DAY_IN_MILLIS,
} from '../services/better-date'
import { FileHash } from '../services/hash'
import { is_digit } from '../services/matchers'

/////////////////////////////////////////////////

export type FsReliability = 'reliable' | 'unreliable' | 'unknown'

export interface NeighborHints {
	parent_folder_bcd: null | BetterDate // we can't interpret it ourselves, for ex. can't discriminate between an event date and a backup date
	fs_bcd_assessed_reliability: FsReliability
}

// Data that we'll destroy/modify but is worth keeping
export interface HistoricalData {
	/////// Data that we'll likely destroy but is precious:
	// - in itself
	// - to recompute the date with stability on subsequent runs
	// - to recompute the date properly in case of a bug or an improvement of our algo

	// from path
	basename: Basename // can contain the date + we "clean" it, maybe with bugs
	parent_path: RelativePath // can contain the event description + useful to manually re-sort in multi-level folder cases

	// from fs
	// we should always store it in case it changes for some reason + we may overwrite it
	fs_bcd_tms: TimestampUTCMs // TODO migration

	// from neighbors
	neighbor_hints: {
		fs_bcd_assessed_reliability: FsReliability
		parent_folder_bcd?: BetterDateMembers
	}

	// from exif bc. we'll change it in the future
	exif_orientation?: number
	trailing_extra_bytes_cleaned?: number // TODO fix macOs bug
}

// notes contain infos that can't be preserved inside the file itself
// but that need to be preserved across invocations
export interface PersistedNotes {
	// backup
	historical: HistoricalData // TODO migration

	// user data
	deleted: undefined | boolean // TODO implement this feature TODO rename? TODO undefined?
	starred: undefined | boolean // TODO implement this feature TODO undefined?
	manual_date: undefined // TODO implement this feature

	// meta
	// useful to clean out notes about deleted files and keep only the one relevant to the subset of notes we're in
	best_date_afawk_symd: undefined | SimpleYYYYMMDD // TODO fill

	// for debug
	currently_known_as: Basename | null // not strictly useful, intended at humans reading the notes manually
	renaming_source: undefined | string
}


// Id = path relative to root so far
export type FileId = RelativePath

export interface State {
	id: FileId

	// those fields need I/O to be completed, they start undefined
	current_fs_stats: undefined | FsStatsSubset // can't be null, is always a file
	current_hash: undefined | FileHash // can't be null, always a file
	current_exif_data: undefined | EXIFTags | null // can be null if no EXIF for this format
	current_neighbor_hints: undefined | NeighborHints

	are_notes_restored: boolean // needed to check if restoration happened
	notes: PersistedNotes
}

////////////////////////////////////

const LIB = '🖼 ' // iTerm has the wrong width 2020/12/15

///////////////////// ACCESSORS /////////////////////

export function get_current_relative_path(state: Immutable<State>): RelativePath {
	return state.id
}

export function get_current_path‿pparsed(state: Immutable<State>): Immutable<path.ParsedPath> {
	return pathㆍparse_memoized(get_current_relative_path(state))
}

export function get_current_basename(state: Immutable<State>): Basename {
	return get_current_path‿pparsed(state).base
}

export function get_oldest_known_basename(state: Immutable<State>): Basename {
	assert(state.are_notes_restored, `get_oldest_known_basename() needs restored notes`)
	return state.notes.historical.basename
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
	return get_current_path‿pparsed(state).dir || '.'
}

export function get_current_top_parent_folder_id(state: Immutable<State>): RelativePath {
	return get_current_relative_path(state).split(path.sep)[0] || '.'
}

export function is_notes(state: Immutable<State>): boolean {
	return get_current_basename(state).endsWith(NOTES_BASENAME_SUFFIX_LC)
}

export function is_media_file(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): boolean {
	const path_parsed = get_current_path‿pparsed(state)

	const is_invisible_file = path_parsed.base.startsWith('.')
	if (is_invisible_file) return false

	let normalized_extension = get_current_extension‿normalized(state)
	return PARAMS.extensions_of_media_files‿lc.includes(normalized_extension)
}

export function is_exif_powered_media_file(state: Immutable<State>): boolean {
	if (!is_media_file(state)) return false

	let normalized_extension = get_current_extension‿normalized(state)

	return EXIF_POWERED_FILE_EXTENSIONS_LC.includes(normalized_extension)
}

export function has_all_infos_for_extracting_the_creation_date(state: Immutable<State>, {
	should_log = true as boolean,
	require_neighbors_hints = true as boolean,
	require_notes = true as boolean,
}): boolean {
	// TODO optim if name = canonical?

	const is_note = is_notes(state)

	const is_exif_available_if_needed   = state.current_exif_data      !== undefined
	const are_fs_stats_read             = state.current_fs_stats       !== undefined
	const is_current_hash_computed      = state.current_hash           !== undefined
	const are_neighbors_hints_collected = state.current_neighbor_hints !== undefined
	const { are_notes_restored } = state

	const is_exif_requirement_met = is_exif_available_if_needed
	const is_fs_stats_requirement_met = are_fs_stats_read
	const is_neighbor_hints_requirement_met = are_neighbors_hints_collected || !require_neighbors_hints
	const is_current_hash_requirement_met = is_current_hash_computed || !require_notes || is_note
	const is_notes_requirement_met = are_notes_restored || !require_notes || is_note

	const has_all_infos = is_exif_requirement_met
		&& is_fs_stats_requirement_met
		&& is_neighbor_hints_requirement_met
		&& is_current_hash_requirement_met
		&& is_notes_requirement_met

	if (!has_all_infos && should_log) {
		// TODO remove, valid check most of the time
		logger.warn(`has_all_infos_for_extracting_the_creation_date() !met`, {
			requirements: {
				require_neighbors_hints,
				require_notes,
			},
			data: {
				is_note,
				is_exif_available_if_needed,
				are_fs_stats_read,
				is_current_hash_computed,
				are_neighbors_hints_collected,
				are_notes_restored,
			},
			requirements_met: {
				is_exif_requirement_met,
				is_fs_stats_requirement_met,
				is_neighbor_hints_requirement_met,
				is_current_hash_requirement_met,
			is_notes_requirement_met,
			},
		})
	}

	return has_all_infos
}

/*
// TODO REVIEW improve with tracking? Should we even need this?
export function is_first_file_encounter(state: Immutable<State>): boolean | undefined {
	if (!state.are_notes_restored)
		return undefined // don't know yet

	// compare all historical properties
	const { historical } = state.notes
	if (historical.basename !== get_current_basename(state)) return false
	if (historical.parent_path !== get_current_parent_folder_id(state)) return false
	assert(state.current_fs_stats, `is_first_file_encounter() should have fs stats`)
	if (historical.fs_bcd_tms !== get_creation_date__from_fs_stats__current‿tms(state)) return false
	assert(state.current_exif_data !== undefined, `is_first_file_encounter() should have EXIF data`)
	if (is_exif_powered_media_file(state)
		&& historical.exif_orientation !== (state.current_exif_data
		? get_orientation_from_exif(state.current_exif_data)
		: undefined))
		return false

	return true
}
*/

// primary, in order
function _get_creation_date__from_manual(state: Immutable<State>): BetterDate | undefined {
	if (state.notes.manual_date === undefined)
		return undefined

	throw new Error('NIMP manual date!')
}
function _get_creation_date__from_exif‿edt(state: Immutable<State>): ExifDateTime | undefined {
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
function _get_creation_tz__from_exif(state: Immutable<State>): TimeZone | undefined {
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
function _get_creation_date__from_exif(state: Immutable<State>): BetterDate | undefined {
	const { id, current_exif_data } = state

	assert(current_exif_data !== undefined, `_get_creation_date_from_exif(): ${id} exif data should have been read`)

	if (!is_exif_powered_media_file(state)) {
		assert(current_exif_data === null, `_get_creation_date_from_exif(): ${id} exif data should be null for non-exif media`)
		return undefined
	}

	assert(current_exif_data !== null, `_get_creation_date_from_exif(): ${id} exif data should not be empty for an exif-powered media`)

	const _from_exif‿edt: ExifDateTime | undefined = _get_creation_date__from_exif‿edt(state)
	if (!_from_exif‿edt) return undefined

	const _from_exif__tz = _get_creation_tz__from_exif(state)
	const bcd = create_better_date_from_ExifDateTime(_from_exif‿edt, _from_exif__tz)
	logger.trace(`_get_creation_date__from_exif() got bcd from EXIF`, {
		//current_exif_data,
		//edt: _from_exif‿edt.toISOString(),
		_from_exif__tz,
		bcd: get_debug_representation(bcd),
	})
	return bcd
}
function _get_creation_date__from_fs_stats__oldest_known‿tms(state: Immutable<State>): TimestampUTCMs {
	assert(state.are_notes_restored, `_get_creation_date_from_original_fs_stats() needs notes restored`)
	// TODO one day ignore if we implement FS normalization & historical basename is processed
	return state.notes.historical.fs_bcd_tms
}
export function get_creation_date__from_fs_stats__current‿tms(state: Immutable<State>): TimestampUTCMs {
	assert(state.current_fs_stats, 'get_creation_date__from_fs_stats__current‿tms() fs stats collected')
	return get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)
}
function _get_creation_date__from_basename__original(state: Immutable<State>): BetterDate | undefined {
	assert(state.are_notes_restored, `_get_creation_date_from_original_basename() needs notes restored`)

	const oldest_known_basename = get_oldest_known_basename(state)

	if (is_processed_media_basename(oldest_known_basename)) {
		// this is not the original basename, we lost the info...
		logger.warn(`_get_creation_date_from_original_basename() reporting loss of the original basename`, {
			id: state.id,
			oldest_known_basename,
		})
		return undefined
	}

	const parsed = get_oldest_known_basename‿parsed(state)
	return parsed.date
}
function _get_creation_date__from_basename__current_non_processed(state: Immutable<State>): BetterDate | undefined {
	if (!is_processed_media_basename(get_current_basename(state))) {
		const parsed = get_current_basename‿parsed(state)
		if (parsed.date)
			return parsed.date
	}

	return undefined
}
function _get_creation_date__from_basename__whatever_non_processed(state: Immutable<State>): BetterDate | undefined {
	if (!is_processed_media_basename(get_oldest_known_basename(state))) {
		const parsed = get_oldest_known_basename‿parsed(state)
		if (parsed.date)
			return parsed.date
	}

	return _get_creation_date__from_basename__current_non_processed(state)
}
function _get_creation_date__from_basename__whatever_already_processed(state: Immutable<State>): BetterDate | undefined {
	if (is_processed_media_basename(get_oldest_known_basename(state)))
		return get_oldest_known_basename‿parsed(state).date!

	if (is_processed_media_basename(get_current_basename(state)))
		return get_current_basename‿parsed(state).date!

	return undefined
}
// junk
function _get_creation_date__from_parent_folder__original(state: Immutable<State>): BetterDate | undefined {
	assert(state.are_notes_restored, `_get_creation_date__from_parent_folder__original() needs notes restored`)

	if (is_processed_media_basename(get_oldest_known_basename(state))) {
		// this is not the original parent folder, we lost the info...
		// (warned already in other selector)
		return undefined
	}

	if (!state.notes.historical.neighbor_hints.parent_folder_bcd)
		return undefined

	return create_better_date_obj(state.notes.historical.neighbor_hints.parent_folder_bcd)
}
function _get_creation_date__from_parent_folder__current(state: Immutable<State>): BetterDate | undefined {
	assert(state.current_neighbor_hints, `_get_creation_date__from_parent_folder__current() needs neighbor hints`)

	if(state.current_neighbor_hints.parent_folder_bcd)
		return state.current_neighbor_hints.parent_folder_bcd

	return undefined
}
function _get_creation_date__from_parent_folder__any(state: Immutable<State>): BetterDate | undefined {
	const bcd_original = _get_creation_date__from_parent_folder__original(state)
	if (bcd_original)
		return bcd_original

	return _get_creation_date__from_parent_folder__current(state)
}
// misc
function _are_dates_matching_while_disregarding_tz_and_precision(d1: Immutable<BetterDate>, d2: Immutable<BetterDate>, debug_id?: string): boolean {
	const tms1 = get_timestamp_utc_ms_from(d1)
	const tms2 = get_timestamp_utc_ms_from(d2)

	const auto1 = get_human_readable_timestamp_auto(d1, 'tz:embedded')
	const auto2 = get_human_readable_timestamp_auto(d2, 'tz:embedded')

	const is_tms_matching = is_same_date_with_potential_tz_difference(tms1, tms2)

	const [ longest, shortest ] = auto1.length >= auto2.length
		? [ auto1, auto2 ]
		: [ auto2, auto1 ]
	const is_matching_with_different_precisions = longest.startsWith(shortest)

	if (!is_tms_matching && !is_matching_with_different_precisions) {
		if (debug_id) {
			logger.warn(`_is_matching() yielded FALSE`, {
				id: debug_id,
				auto1,
				auto2,
				tms1,
				tms2,
				is_tms_matching,
				is_matching_with_different_precisions,
				diff_s: Math.abs(tms2 - tms1) / 1000.,
			})
		}
		return false
	}

	return true
}
// all together
export type DateConfidence = 'primary' // reliable data coming from the file itself = we can match to event and rename
	| 'secondary' // reliable data but coming from secondary sources such as folder date or neighbor hints = we can match to an event BUT won't rename
	| 'junk' // 3 we don't even trust sorting this file
interface BestDate {
	candidate: BetterDate
	source:
		// primary
		| 'manual'

		// primary
		| 'exif'

		// primary -- original
		| 'original_basename_np' | 'original_basename_np+fs'
		| 'original_fs+original_env_hints'

		// primary -- current
		| 'current_basename_np'
		| 'some_basename_np' | 'some_basename_np+fs'
		| 'current_fs+current_env_hints'

		// secondary
		| 'some_basename_p'
		| 'original_env_hints'
		| 'current_env_hints'

		// junk
		| 'original_fs'
		| 'current_fs'
	confidence: DateConfidence // redundant with 'source' but makes it easier to code / consume
	from_historical: boolean // redundant with 'source' but makes it easier to code / consume
	is_fs_matching: boolean // useful for deciding to fix FS or not TODO use
}

// for stability, we try to rely on the oldest known data first and foremost.
// Note that historical !== original
// (ideally this func should NOT rely on anything else than TRULY ORIGINAL data)
// TODO UT
export function get_best_creation_date_meta__from_historical_data(state: Immutable<State>, PARAMS = get_params()): BestDate {
	logger.trace(`get_best_creation_date_meta__from_historical_data()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, {}),
		'get_best_creation_date_meta__from_historical_data() has_all_infos_for_extracting_the_creation_date()'
	)

	// TODO when implementing FS normalization, may not be original and should be discarded
	const bcd__from_fs__oldest_known‿tms = _get_creation_date__from_fs_stats__oldest_known‿tms(state)
	const bcd__from_fs__oldest_known = create_better_date_from_utc_tms(bcd__from_fs__oldest_known‿tms, 'tz:auto')
	assert(bcd__from_fs__oldest_known‿tms === get_timestamp_utc_ms_from(bcd__from_fs__oldest_known), `oldest fs tms back and forth stability`)

	const result: BestDate = {
		candidate: bcd__from_fs__oldest_known,
		source: 'original_fs',
		confidence: 'junk',
		from_historical: true,
		is_fs_matching: false, // init value
	}

	/////// PRIMARY SOURCES ///////

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const bcd__from_basename__original: BetterDate | undefined = _get_creation_date__from_basename__original(state)

	// strongest source
	const bcd__from_exif = _get_creation_date__from_exif(state)
	logger.trace('get_best_creation_date_meta__from_historical_data() trying EXIF…', {
		has_candidate: !!bcd__from_exif,
		data: state.current_exif_data,
	})
	if (bcd__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = bcd__from_exif
		result.source = 'exif'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		if (bcd__from_basename__original) {
			// cross check
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_basename = get_human_readable_timestamp_auto(bcd__from_basename__original, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_basename)) {
				// perfect match + EXIF more precise
			}
			else if (_are_dates_matching_while_disregarding_tz_and_precision(bcd__from_basename__original, result.candidate)) {
				// good enough, keep EXIF
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`get_best_creation_date_meta__from_historical_data() EXIF/historical-basename discrepancy`, {
					oldest_known_basename: get_oldest_known_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(bcd__from_exif) - get_timestamp_utc_ms_from(bcd__from_basename__original)),
					id: state.id,
					auto_from_basename,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		logger.trace(`get_best_creation_date_meta__from_historical_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// second most authoritative source
	logger.trace('get_best_creation_date_meta__from_historical_data() trying original basename (non processed)…')
	if (bcd__from_basename__original) {
		result.candidate = bcd__from_basename__original
		result.source = 'original_basename_np'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(bcd__from_fs__oldest_known, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.source = 'original_basename_np+fs'
			result.candidate = bcd__from_fs__oldest_known
		}
		else if (result.is_fs_matching) {
			// good enough, switch to FS more precise
			// TODO review if tz could be an issue?
			/* TZ is an issue, we only accept perfect matches (case above)
			TODO try to investigate this FS issue
			result.source = 'some_basename_np+fs'
			result.candidate = bcd__from_fs__oldest_known
			 */
		}
		else {
			// FS is notoriously unreliable, don't care when compared to this better source
		}

		logger.trace(`get_best_creation_date_meta__from_historical_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// FS is ok as PRIMARY if confirmed by some primary hints
	logger.trace('get_best_creation_date_meta__from_historical_data() trying FS as primary (if reliable)…', {
		bcd__from_fs__oldest_known: get_debug_representation(bcd__from_fs__oldest_known),
		neighbor_hints: {
			fs_bcd_assessed_reliability: state.notes.historical.neighbor_hints.fs_bcd_assessed_reliability,
			parent_folder_bcd: get_debug_representation(state.notes.historical.neighbor_hints.parent_folder_bcd && create_better_date_obj(state.notes.historical.neighbor_hints.parent_folder_bcd)),
		},
	})
	if (state.notes.historical.neighbor_hints.fs_bcd_assessed_reliability === 'reliable') {
		result.candidate = bcd__from_fs__oldest_known
		result.source = 'original_fs+original_env_hints'
		result.confidence = 'primary'
		result.is_fs_matching = true

		logger.trace(`get_best_creation_date_meta__from_historical_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// Note: date from parent folder should NEVER make it above secondary

	/////// SECONDARY SOURCES ///////
	// TODO review is that even useful?

	logger.trace('get_best_creation_date_meta__from_historical_data() trying FS as secondary (if reliability unknown)…', {
		bcd__from_fs__oldest_known: get_debug_representation(bcd__from_fs__oldest_known),
		fs_bcd_assessed_reliability: state.notes.historical.neighbor_hints.fs_bcd_assessed_reliability,
	})
	if (state.notes.historical.neighbor_hints.fs_bcd_assessed_reliability === 'unknown') {
		// not that bad
		// we won't rename the file, but good enough to match to an event
		result.candidate = bcd__from_fs__oldest_known
		result.source = 'original_fs+original_env_hints'
		result.confidence = 'secondary'
		result.is_fs_matching = true

		logger.trace(`get_best_creation_date_meta__from_historical_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	/* TODO review needed? partially redundant with the above
	// worst secondary choice
	const bcd__from_parent_folder__original = _get_creation_date__from_parent_folder__original(state)
	logger.trace('get_best_creation_date_meta__from_historical_data() trying parent folder…', {
		date__from_parent_folder__original: bcd__from_parent_folder__original,
	})
	if (bcd__from_parent_folder__original) {
		// while the parent's date is likely to be several days off
		// it's still useful for sorting into an event
		result.candidate = bcd__from_parent_folder__original
		result.source = 'original_env_hints'
		result.confidence = 'secondary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		logger.trace(`get_best_creation_date_meta__from_historical_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}*/

	/////// JUNK SOURCES ///////

	// still the starting default
	assert(result.candidate === bcd__from_fs__oldest_known)
	assert(result.confidence === 'junk')
	result.is_fs_matching = true // obviously

	logger.trace(`get_best_creation_date_meta__from_historical_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
	return result
}

// TODO on a first encounter, __from_historical_data and __from_current_data should return the same!!!

// used on 1st stage consolidation => it should be able to work without hints and notes
// info may be overriden by notes later
// useful for files we encounter for the first time
export function get_best_creation_date_meta__from_current_data(state: Immutable<State>, PARAMS = get_params()): BestDate {
	logger.trace(`_get_best_creation_date_meta__from_current_data()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, {
			should_log: true,
			require_notes: false,
			require_neighbors_hints: false,
		}),
		'get_best_creation_date_meta__from_current_data() has_all_infos_for_extracting_the_creation_date()'
	)

	assert(!state.current_neighbor_hints, `get_best_creation_date_meta__from_current_data() ???`)

	const bcd__from_fs__current‿tms = get_creation_date__from_fs_stats__current‿tms(state)
	const bcd__from_fs__current = create_better_date_from_utc_tms(bcd__from_fs__current‿tms, 'tz:auto')
	assert(bcd__from_fs__current‿tms === get_timestamp_utc_ms_from(bcd__from_fs__current), `current fs tms back and forth stability`)

	const result: BestDate = {
		candidate: bcd__from_fs__current,
		source: 'current_fs',
		confidence: 'junk',
		from_historical: false, // always in this func
		is_fs_matching: false, // init value
	}

	/////// PRIMARY SOURCES ///////

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const bcd__from_basename__current_non_processed: BetterDate | undefined = _get_creation_date__from_basename__current_non_processed(state)

	// strongest source
	const bcd__from_exif = _get_creation_date__from_exif(state)
	logger.trace('get_best_creation_date_meta__from_current_data() trying EXIF…')
	if (bcd__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = bcd__from_exif
		result.source = 'exif'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, result.candidate)

		if (bcd__from_basename__current_non_processed) {
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_np_basename = get_human_readable_timestamp_auto(bcd__from_basename__current_non_processed, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_np_basename)) {
				// perfect match + EXIF more precise
			}
			else if (_are_dates_matching_while_disregarding_tz_and_precision(bcd__from_basename__current_non_processed, result.candidate)) {
				// good enough, keep EXIF
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`_get_best_creation_date_meta__from_current_data() EXIF/np-basename discrepancy`, {
					basename: get_current_basename(state),
					oldest_known_basename: get_oldest_known_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(bcd__from_exif) - get_timestamp_utc_ms_from(bcd__from_basename__current_non_processed)),
					id: state.id,
					auto_from_np_basename,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		logger.trace(`_get_best_creation_date_meta__from_current_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// second most authoritative source
	logger.trace('get_best_creation_date_meta__from_current_data() trying current basename NP…')
	if (bcd__from_basename__current_non_processed) {
		result.candidate = bcd__from_basename__current_non_processed
		result.source = 'current_basename_np'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(bcd__from_fs__current, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.source = 'some_basename_np+fs'
			result.candidate = bcd__from_fs__current
		}
		else if (result.is_fs_matching) {
			// good enough, switch to FS more precise
			// TODO review if tz could be an issue?
			/* TZ is an issue, we only accept perfect matches (case above)
			TODO try to investigate this FS issue
			result.source = 'some_basename_np+fs'
			result.candidate = bcd__from_fs__current
			 */
		}
		else {
			// FS is notoriously unreliable, don't care when compared to this better source
		}

		logger.trace(`_get_best_creation_date_meta__from_current_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// FS is ok as PRIMARY if confirmed by some primary hints XXX hints are secondary TODO review
	if (state.current_neighbor_hints) {
		// TODO review is that still primary if hints are secondary??
		// TODO review is that even useful??
		const current_fs_reliability = _get_current_fs_assessed_reliability(state)
		logger.trace('get_best_creation_date_meta__from_current_data() trying FS as primary (if reliable)…', {
			bcd__from_fs__current: get_debug_representation(bcd__from_fs__current),
			//current_neighbor_hints: state.current_neighbor_hints,
			current_fs_reliability,
			expected: 'reliable'
		})
		if (current_fs_reliability === 'reliable') {
			result.candidate = bcd__from_fs__current
			result.source = 'current_fs+current_env_hints'
			result.confidence = 'primary'
			result.is_fs_matching = true

			logger.trace(`get_best_creation_date_meta__from_current_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
			return result
		}
	}

	// Note: date from parent folder should NEVER make it above secondary

	/////// SECONDARY SOURCES ///////

	if (state.current_neighbor_hints) {
		// TODO review is that even useful??
		const current_fs_reliability = _get_current_fs_assessed_reliability(state)
		logger.trace('get_best_creation_date_meta__from_current_data() trying FS as secondary (if reliability unknown)…', {
			bcd__from_fs__current: get_debug_representation(bcd__from_fs__current),
			//current_neighbor_hints: state.current_neighbor_hints,
			current_fs_reliability,
			expected: 'unknown'
		})
		if (current_fs_reliability === 'unknown') {
			result.candidate = bcd__from_fs__current
			result.source = 'current_fs+current_env_hints'
			result.confidence = 'secondary'
			result.is_fs_matching = true

			logger.trace(`get_best_creation_date_meta__from_current_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
			return result
		}
	}

	// borderline secondary/junk
	logger.trace('get_best_creation_date_meta__from_current_data() trying env hints…', {
		current_neighbor_hints: state.current_neighbor_hints
	})
	if (state.current_neighbor_hints) {
		// TODO review is that even useful??
		const date__from_parent_folder__current = _get_creation_date__from_parent_folder__current(state)
		if (date__from_parent_folder__current) {
			result.candidate = date__from_parent_folder__current
			result.source = 'current_env_hints'
			result.confidence = 'secondary'
			result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, result.candidate)

			logger.trace(`get_best_creation_date_meta__from_current_data() resolved to ${get_debug_representation(result.candidate)} from ${ result.source } with confidence = ${ result.confidence } ✔`)
			return result
		}
	}

	/////// JUNK SOURCE ///////

	// default to fs
	assert(result.source === 'current_fs')
	assert(result.confidence === 'junk')

	return result
}

// Best creation date overall
// mixes the best info from historical and current + takes into account "manual"
export const get_best_creation_date_meta = micro_memoize(function get_best_creation_date_meta(state: Immutable<State>, PARAMS = get_params()): BestDate {
	logger.trace(`get_best_creation_date_meta()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, {}),
		'get_best_creation_date_meta() has_all_infos_for_extracting_the_creation_date()'
	)

	const bcd__from_fs__oldest_known‿tms = _get_creation_date__from_fs_stats__oldest_known‿tms(state)
	const bcd__from_fs__oldest_known = create_better_date_from_utc_tms(bcd__from_fs__oldest_known‿tms, 'tz:auto')
	assert(bcd__from_fs__oldest_known‿tms === get_timestamp_utc_ms_from(bcd__from_fs__oldest_known), `original fs tms back and forth stability`)

	const result: BestDate = {
		candidate: bcd__from_fs__oldest_known,
		source: 'original_fs',
		confidence: 'junk',
		from_historical: false,
		is_fs_matching: false, // init value
	}

	/////// PRIMARY SOURCES ///////

	// the strongest indicator = explicit user's will
	const bcd__from_manual = _get_creation_date__from_manual(state)
	logger.trace('get_best_creation_date_meta() trying manual…')
	if (bcd__from_manual) {
		throw new Error('NIMP use manual!')
	}

	// then rely on original data as much as possible
	logger.trace('get_best_creation_date_meta() trying historical data…')
	const meta__from_historical = get_best_creation_date_meta__from_historical_data(state, PARAMS)
	if (meta__from_historical.confidence === 'primary') {
		logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(meta__from_historical.candidate)} from historical data result ✔ (primary)`)
		return meta__from_historical
	}

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const bcd__from_basename__whatever_non_processed: BetterDate | undefined = _get_creation_date__from_basename__whatever_non_processed(state)

	// strongest source after "manual"
	// TODO review = redundant with historical??
	const bcd__from_exif = _get_creation_date__from_exif(state)
	logger.trace('get_best_creation_date_meta() trying EXIF…')
	if (bcd__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = bcd__from_exif
		result.source = 'exif'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		if (bcd__from_basename__whatever_non_processed) {
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_np_basename = get_human_readable_timestamp_auto(bcd__from_basename__whatever_non_processed, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_np_basename)) {
				// perfect match + EXIF more precise
			}
			else if (_are_dates_matching_while_disregarding_tz_and_precision(bcd__from_basename__whatever_non_processed, result.candidate)) {
				// good enough, keep EXIF
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`get_best_creation_date_meta() EXIF/np-basename discrepancy`, {
					basename: get_current_basename(state),
					oldest_known_basename: get_oldest_known_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(bcd__from_exif) - get_timestamp_utc_ms_from(bcd__from_basename__whatever_non_processed)),
					id: state.id,
					auto_from_np_basename,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// second most authoritative source
	logger.trace('get_best_creation_date_meta() trying any basename NP…')
	if (bcd__from_basename__whatever_non_processed) {
		result.candidate = bcd__from_basename__whatever_non_processed
		result.source = 'some_basename_np'
		result.confidence = 'primary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(bcd__from_fs__oldest_known, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.source = 'some_basename_np+fs'
			result.candidate = bcd__from_fs__oldest_known
		}
		else if (result.is_fs_matching) {
			// good enough, switch to FS more precise
			// TODO review if tz could be an issue?
			/* TZ is an issue, we only accept perfect matches (case above)
			TODO try to investigate this FS issue
			result.source = 'some_basename_np+fs'
			result.candidate = bcd__from_fs__oldest_known
			 */
		}
		else {
			// FS is notoriously unreliable, don't care when compared to this better source
		}

		logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// FS is handled by the "_historical()" selector
	// if not triggered, means current FS is not original hence not primary

	// Note: date from parent folder should NEVER make it above secondary

	/////// SECONDARY SOURCES ///////
	// TODO review is that even useful?

	if (meta__from_historical.confidence === 'secondary' && meta__from_historical.source !== 'original_env_hints') {
		logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(meta__from_historical.candidate)} from historical data result ✔ (secondary)`)
		return meta__from_historical
	}

	// if historical or current basename is already normalized,
	// since we only normalize on primary source of trust,
	// we trust our past self which may have had more info at the time
	// XXX how about algorithm fix?? TODO review
	const date__from_basename__whatever_processed = _get_creation_date__from_basename__whatever_already_processed(state)
	logger.trace('get_best_creation_date_meta() trying whatever date even already processed…', { has_candidate: !!date__from_basename__whatever_processed })
	if (date__from_basename__whatever_processed) {
		result.candidate = date__from_basename__whatever_processed
		result.source = 'some_basename_p'
		result.confidence = 'secondary' // since we can't guarantee that it's truely from original
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		// normalized is already super precise, no need to refine with FS
		// TODO review what if algo improvement?

		logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// borderline secondary/junk
	// the user may have manually sorted the file into the right folder
	const date__from_parent_folder__any = _get_creation_date__from_parent_folder__current(state)
	if (date__from_parent_folder__any) {
		result.candidate = date__from_parent_folder__any
		result.source = 'current_env_hints'
		result.confidence = 'secondary'
		result.is_fs_matching = _are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	if (meta__from_historical.confidence === 'secondary') {
		logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(meta__from_historical.candidate)} from historical data result ✔ (secondary)`)
		return meta__from_historical
	}

	/////// JUNK SOURCE ///////

	// at this level, historical is still better
	logger.trace(`get_best_creation_date_meta() resolved to ${get_debug_representation(meta__from_historical.candidate)} from historical data result ✔ (junk)`)
	return meta__from_historical
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

function _is_confident_in_date(state: Immutable<State>, up_to: DateConfidence): boolean {
	const meta = get_best_creation_date_meta(state)
	const { confidence } = meta

	let is_confident = false
	switch (confidence) {
		case 'primary':
			is_confident = true
			break

		case 'secondary':
			is_confident = (up_to === 'secondary')
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
export function is_confident_in_date_enough_to__fix_fs(state: Immutable<State>): boolean {
	return _is_confident_in_date(state, 'primary')
}
export function is_confident_in_date_enough_to__sort(state: Immutable<State>): boolean {
	return _is_confident_in_date(state, 'secondary')
}

export function get_current_fs_date_reliability_according_to_other_trustable_current_primary_date_sources(state: Immutable<State>): FsReliability {
	const bcd__from_fs__current‿tms = get_creation_date__from_fs_stats__current‿tms(state)
	const bcd__from_fs__current = create_better_date_from_utc_tms(bcd__from_fs__current‿tms, 'tz:auto')

	// TODO when we start doing FS normalization, detect that and return undefined

	const bcd__from_exif = _get_creation_date__from_exif(state)
	if (bcd__from_exif) {
		if (_are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, bcd__from_exif, state.id))
			return 'reliable'
	}

	const bcd__from_basename__current_non_processed = _get_creation_date__from_basename__current_non_processed(state)
	if(bcd__from_basename__current_non_processed) {
		if (_are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, bcd__from_basename__current_non_processed, state.id))
			return 'reliable'
	}

	if (!bcd__from_exif && !bcd__from_basename__current_non_processed) {
		return 'unknown'
	}

	logger.log('⚠️ get_current_fs_date_reliability_according_to_other_trustable_current_primary_date_sources() yielding FALSE', {
		id: state.id,
		bcd__from_fs__current: get_debug_representation(bcd__from_fs__current‿tms),
		bcd__from_exif: get_debug_representation(bcd__from_exif),
		bcd__from_basename__current_non_processed: get_debug_representation(bcd__from_basename__current_non_processed),
		//current_exif_data: state.current_exif_data,
	})

	return 'unreliable'
}

function _get_current_fs_assessed_reliability(
	state: Immutable<State>,
	PARAMS = get_params(),
	neighbor_hints: Immutable<NeighborHints> = state.current_neighbor_hints!,
): FsReliability {
	assert(neighbor_hints, `_get_current_fs_assessed_reliability() should be called with neighbor hints`)

	// first look at ourself
	const self_assessed_reliability = get_current_fs_date_reliability_according_to_other_trustable_current_primary_date_sources(state)
	if (self_assessed_reliability !== 'unknown') {
		logger.trace(`_get_current_fs_assessed_reliability() current fs reliability has been assessed to "${self_assessed_reliability}" from self`)
		return self_assessed_reliability
	}

	// unknown reliability so far, let's try to infer one from our neighbors
	const bcd__from_fs__current‿tms = get_creation_date__from_fs_stats__current‿tms(state)

	const bcd__from_parent_folder__current = neighbor_hints.parent_folder_bcd
	if (bcd__from_parent_folder__current) {
		const bcd__from_parent_folder__current‿tms = get_timestamp_utc_ms_from(bcd__from_parent_folder__current)

		if (bcd__from_fs__current‿tms >= bcd__from_parent_folder__current‿tms
			&& bcd__from_fs__current‿tms < (bcd__from_parent_folder__current‿tms + PARAMS.max_event_durationⳇₓday * DAY_IN_MILLIS)) {
			// ok, looks like an event folder configuration
			logger.trace(`_get_current_fs_assessed_reliability() current fs reliability has been assessed to "reliable" from our fs + parent folder bcd`)
			return 'reliable'
		}
	}

	// still unknown
	const folder_fs_bcd_assessed_reliability = neighbor_hints.fs_bcd_assessed_reliability
	switch(folder_fs_bcd_assessed_reliability) {
		case 'reliable':
			logger.trace(`_get_current_fs_assessed_reliability() current fs reliability has been assessed to "reliable" from parent reliability=reliable`)
			return 'reliable'
		case 'unreliable':
			// NO! Don't allow a single bad file to pollute an entire folder
			// ok we're not reliable, but can't say that we're unreliable
			// fallthrough
		default:
			// fallthrough
			break
	}

	// TODO evaluate if needed?
	/*
	if (date_range_from_reliable_neighbors‿tms) {
		const tms__from_original_reliable_neighbors__begin = date_range_from_reliable_neighbors‿tms[0]
		const tms__from_original_reliable_neighbors__end = date_range_from_reliable_neighbors‿tms[1]

		// TODO allow a little bit of margin?
		if (bcd__from_fs__current‿tms >= tms__from_original_reliable_neighbors__begin
			&& bcd__from_fs__current‿tms <= tms__from_original_reliable_neighbors__end) {
			return 'reliable'
		}
	}*/

	logger.trace(`_get_current_fs_assessed_reliability() current fs reliability has been assessed to "unknown" from fallback`)
	return 'unknown'
}

// TODO export function should_normalize(...) if older norm etc. Or should be in ideal basename?
/*
export function is_date_from_original_data(state: Immutable<State>): boolean {
	const meta = get_best_creation_date_meta(state)
	return meta.from_historical
}
*/
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
		parsed_oldest_known_basename: (() => {
			const { date, ...rest } = parsed_oldest_known_basename
			return {
				...rest,
				date: get_debug_representation(date),
			}
		})(),
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
				if (requested_confidence && !is_processed_media_basename(get_current_basename(state))) {
					// not confident enough in getting the date, can't add the date
					break
				}
				/* fallthrough */
			case 'primary':
				/* fallthrough */
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

	const parsed_path = pathㆍparse_memoized(id)

	const state: State = {
		id,

		current_exif_data: undefined,
		current_fs_stats: undefined,
		current_hash: undefined,
		current_neighbor_hints: undefined,

		are_notes_restored: false,
		notes: {
			historical: {
				basename: parsed_path.base,
				parent_path: parsed_path.dir,

				fs_bcd_tms: get_UTC_timestamp_ms(), // so far
				neighbor_hints: {
					// so far
					parent_folder_bcd: undefined,
					fs_bcd_assessed_reliability: 'unreliable',
				},

				exif_orientation: undefined,
				trailing_extra_bytes_cleaned: undefined,
			},

			deleted: undefined,
			starred: undefined,
			manual_date: undefined,

			best_date_afawk_symd: undefined,

			currently_known_as: parsed_path.base,
			renaming_source: undefined,
		},
	}

	if (!is_exif_powered_media_file(state as Immutable<State>))
		state.current_exif_data = null

	if (get_params().expect_perfect_state) {
		const current_basename = parsed_path.base
		assert(
			!is_processed_media_basename(current_basename),
			`PERFECT STATE current basename should never be an already processed basename "${current_basename}"!`
		)
	}

	return enforce_immutability(state)
}

// Those PRIMARY "on_info_read..." happens first and have no inter-dependencies

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
			historical: {
				// as far as we know we are dealing with the original
				...state.notes.historical,
				fs_bcd_tms: get_most_reliable_birthtime_from_fs_stats(fs_stats_subset),
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
			historical: {
				// as far as we know we are dealing with the original
				...state.notes.historical,
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

// this extra SECONDARY "on_info_read..." happens on consolidation, requires ALL files to have all the PRIMARY loaded
export function on_info_read__current_neighbors_primary_hints(
	state: Immutable<State>,
	neighbor_hints: Immutable<NeighborHints>,
	PARAMS = get_params(),
): Immutable<State> {
	logger.trace(`${LIB} on_info_read__current_neighbors_primary_hints(…)`, {
		id: state.id,
		neighbor_hints: {
			parent_folder_bcd: get_debug_representation(neighbor_hints.parent_folder_bcd),
			fs_bcd_assessed_reliability: neighbor_hints.fs_bcd_assessed_reliability,
		},
	})

	assert(!state.current_neighbor_hints, `on_info_read__current_neighbors_primary_hints() should not be called several times ${state.id}`)
	assert(!state.are_notes_restored, `on_info_read__current_neighbors_primary_hints() should be called BEFORE notes restoration ${state.id}`)

	const our_current_fs_bcd_assessed_reliability: FsReliability = _get_current_fs_assessed_reliability(state, PARAMS, neighbor_hints)

	state = {
		...state,
		current_neighbor_hints: neighbor_hints,
		notes: {
			...state.notes,
			historical: {
				...state.notes.historical,
				neighbor_hints: {
					parent_folder_bcd: neighbor_hints.parent_folder_bcd
						? get_members(neighbor_hints.parent_folder_bcd)
						: undefined,
					fs_bcd_assessed_reliability: our_current_fs_bcd_assessed_reliability,
				}
			},
		},
	}

	return state
}

// happens AFTER ALL on_info_read...
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
		const original_ext‿norm = get_file_basename_extension‿normalized(recovered_notes.historical.basename)
		assert(current_ext‿norm === original_ext‿norm, `recovered notes should refer to the same file type! "${current_ext‿norm}" vs. "${original_ext‿norm}`)
	}

	state = {
		...state,
		are_notes_restored: true,
		notes: {
			...state.notes,
			...recovered_notes,
			currently_known_as: get_current_basename(state), // force keep this one
			historical: {
				...state.notes.historical,
				...recovered_notes?.historical,
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
	const path_parsed = get_current_path‿pparsed(state)
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

	if (base !== state.notes.historical.basename || dir !== state.notes.historical.parent_path) {
		// historically known as
		str += ` (Note: HKA "${state.notes.historical.parent_path}/${state.notes.historical.basename}")`
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
	//let min_fs_bcd_tms = get_most_reliable_birthtime_from_fs_stats(selected_state.current_fs_stats!) // so far
	states.forEach(candidate_state => {
		if (candidate_state === selected_state) return

		//min_fs_bcd_tms = Math.min(min_fs_bcd_tms, get_most_reliable_birthtime_from_fs_stats(candidate_state.current_fs_stats!))

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
		const selected__has_normalized_parent_folder = is_normalized_event_folder_relpath(get_current_parent_folder_id(selected_state))
		const candidate__has_normalized_parent_folder = is_normalized_event_folder_relpath(get_current_parent_folder_id(candidate_state))
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
		const selected__current_fs_creation_date_tms = get_creation_date__from_fs_stats__current‿tms(selected_state)
		const candidate__current_fs_creation_date_tms = get_creation_date__from_fs_stats__current‿tms(candidate_state)
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
	logger.trace(`${LIB} merge_notes(…)`, { ids: notes.map(n => n.historical.basename) })
	assert(notes.length > 1, 'merge_notes(…) should be given several notes to merge')

	// get hints at earliest
	const index__non_processed_basename = notes.findIndex(n => !is_processed_media_basename(n.historical.basename))
	const index__earliest_birthtime = notes.reduce((acc, val, index) => {
		// birthtimes tend to be botched to a *later* date by the FS
		if (val.historical.fs_bcd_tms < acc[1]) {
			acc[0] = index
			acc[1] = val.historical.fs_bcd_tms
		}
		return acc
	}, [-1, Number.POSITIVE_INFINITY])[0]
	const index__shortest_non_normalized_basename = notes.reduce((acc, val, index) => {
		const candidate = val.historical.basename
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
	const earliest_fs_birthtime = notes[index__earliest_birthtime].historical.fs_bcd_tms

	merged_notes = {
		...merged_notes,
		historical: {
			...merged_notes.historical,
			fs_bcd_tms: earliest_fs_birthtime,
		}
	}

	// fill holes with whatever is defined, earliest wins
	logger.silly('merge_notes() notes so far', merged_notes)
	notes.forEach(duplicate_notes => {
		/*if (duplicate_notes.historical.basename.length < shortest_original_basename.length && !is_normalized_media_basename(duplicate_notes.historical.basename))
			shortest_original_basename = duplicate_notes.historical.basename*/
		merged_notes = {
			...merged_notes,
			..._get_defined_props(duplicate_notes),
			..._get_defined_props(merged_notes),
			historical: {
				...merged_notes.historical,
				..._get_defined_props(duplicate_notes.historical),
				..._get_defined_props(merged_notes.historical),
			}
		}
		logger.silly('merge_notes() notes so far', merged_notes)
	})

	/*let shortest_original_basename: Basename = merged_notes.historical.basename // for now
	if (merged_notes.historical.basename !== shortest_original_basename) {
		logger.warn(`merge_notes(): ?? final historical basename "${merged_notes.historical.basename}" is not the shortest: "${shortest_original_basename}"`)
	}*/
	if (is_processed_media_basename(merged_notes.historical.basename)) {
		logger.warn(`merge_notes(): ?? final historical basename "${merged_notes.historical.basename}" is already processed`)
	}

	return merged_notes
}
