import path from 'path'

import micro_memoize from 'micro-memoize'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
import { Tags as EXIFTags, ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import {
	EXIF_POWERED_FILE_EXTENSIONS_LC,
	NOTES_BASENAME_SUFFIX_LC,
	DIGIT_PROTECTION_SEPARATOR,
} from '../../consts'
import {
	Basename,
	RelativePath,
	SimpleYYYYMMDD,
	TimeZone,
} from '../../types'
import { Params, get_params } from '../../params'
import logger from '../../services/logger'
import {
	FsStatsSubset,
	get_most_reliable_birthtime_from_fs_stats,
} from '../../services/fs_stats'
import {
	get_best_creation_date_from_exif,
	get_creation_timezone_from_exif,
	get_orientation_from_exif,
} from '../../services/exif'
import {
	ParseResult,
	get_file_basename_copy_index,
	get_file_basename_extension‿normalized,
	get_file_basename_without_copy_index,
	is_normalized_event_folder_relpath,
	is_processed_media_basename,
	parse_file_basename,
	pathㆍparse_memoized, is_folder_basename__matching_a_processed_event_format, parse_folder_basename,
} from '../../services/name_parser'
import {
	BetterDate,
	BetterDateMembers,
	get_human_readable_timestamp_auto,
	get_compact_date,
	create_better_date_from_utc_tms,
	create_better_date_from_ExifDateTime,
	get_timestamp_utc_ms_from,
	are_same_tms_date_with_potential_tz_difference,
	get_debug_representation,
	create_better_date_obj, get_members_for_serialization,
	DAY_IN_MILLIS,
	are_dates_matching_while_disregarding_tz_and_precision, DateRange,
} from '../../services/better-date'
import { FileHash } from '../../services/hash'
import { is_digit } from '../../services/matchers'

import { LIB } from './consts'
import {
	FileId,
	State,
	NeighborHints,
	PersistedNotes,
	FsReliability,
} from './types'
import * as NeighborHintsLib from './sub/neighbor-hints'

////////////////////////////////////


// not necessarily an "event"
/*
export function get_expected_date_range_from_folder_basename_if_any(folder_path‿rel: RelativePath): null | DateRange {
	const folder_path‿pparsed = pathㆍparse_memoized(folder_path‿rel)
	const folder_basename = folder_path‿pparsed.base

	if (folder_basename.length < 12) {
		// must be big enough, just a year won't do
		return null
	}

	const basename‿parsed = parse_folder_basename(folder_basename)
	if (!basename‿parsed.date)
		return null

	// TODO review: should we return null if range too big?

	// reminder: a dated folder can indicate either
	// - the date of an EVENT = date of the beginning of the file range
	// - the date of a BACKUP = date of the END of the file range
	// we need extra info to discriminate between the two options

	// try to cross-reference with the children date range = best source of info
	const { begin, end } = (() => {
		assert(is_data_gathering_pass_1_done(state), `get_event_start_from_basename() at least pass 1 should be complete`)

		if (is_data_gathering_pass_2_done(state) && state.children_bcd_ranges.from_primaryⵧfinal) {
			return state.children_bcd_ranges.from_primaryⵧfinal
		}

		return state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1!
	})()
	if (!!begin && !!end) {
		// we have a range, let's cross-reference…
		const date__from_basename‿symd = BetterDateLib.get_compact_date(basename‿parsed.date, 'tz:embedded')

		// TODO use the best available data?
		const date_range_begin‿symd = BetterDateLib.get_compact_date(begin, 'tz:embedded')
		const date_range_end‿symd = BetterDateLib.get_compact_date(end, 'tz:embedded')

		if (date__from_basename‿symd <= date_range_begin‿symd) {
			// clearly a beginning date
			return basename‿parsed.date
		}
		else if (date__from_basename‿symd >= date_range_end‿symd) {
			// clearly a backup date, ignore it
			return null
		}
		else {
			// strange situation, let's investigate...
			throw new Error('get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources() NIMP1')
		}
	}

	// we have no range, let's try something else…
	if (basename‿parsed.meaningful_part.toLowerCase().includes('backup')) {
		// clearly not an event
		return null
	}

	if (is_folder_basename__matching_a_processed_event_format(current_basename)) {
		// this looks very very much like an event
		// TODO check parent is year as well?
		return basename‿parsed.date
	}

	// can't really tell...
	console.error({
		current_basename,
		ip: is_folder_basename__matching_a_processed_event_format(current_basename),
		pmp: basename‿parsed.meaningful_part,
	})
	throw new Error('get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources() NIMP2')
}

export function get_expected_date_range_from_folder({
		folder_path‿rel,
		rangeⵧfrom_fsⵧcurrent,
		rangeⵧfrom_primaryⵧcurrentⵧphase_1,
}: {
	folder_path‿rel: RelativePath
	rangeⵧfrom_fsⵧcurrent: DateRange<TimestampUTCMs> // can't be null since there is at least the current file!
	rangeⵧfrom_primaryⵧcurrentⵧphase_1: undefined | DateRange
}): DateRange {

	xxx
}
*/

////////////////////////////////////

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
	assert(state.are_notes_restored, `get_oldest_known_basename() expects notes restored!`)
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

export function has_neighbor_hints(state: Immutable<State>): boolean {
	return state.current_neighbor_hints !== undefined
}

///////

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

	const is_exif_available_or_null     = state.current_exif_data      !== undefined
	const are_fs_stats_read             = state.current_fs_stats       !== undefined
	const is_current_hash_computed      = state.current_hash           !== undefined
	const are_neighbors_hints_collected = has_neighbor_hints(state)
	const { are_notes_restored } = state

	const is_exif_requirement_met = is_exif_available_or_null
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
				is_exif_available_if_needed: is_exif_available_or_null,
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

/* TODO REVIEW improve with tracking? Should we even need this?
export function is_first_file_encounter(state: Immutable<State>): boolean | undefined {
	if (!state.are_notes_restored)
		return undefined // don't know yet

	// compare all historical properties
	const { historical } = state.notes
	if (historical.basename !== get_current_basename(state)) return false
	if (historical.parent_path !== get_current_parent_folder_id(state)) return false
	assert(state.current_fs_stats, `is_first_file_encounter() should have fs stats`)
	if (historical.fs_bcd_tms !== get_creation_dateⵧfrom_fsⵧcurrent‿tms(state)) return false
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
function _get_creation_dateⵧfrom_manual(state: Immutable<State>): BetterDate | undefined {
	if (state.notes.manual_date === undefined)
		return undefined

	throw new Error('NIMP feature: manual date!')
}
function _get_creation_dateⵧfrom_exif‿edt(state: Immutable<State>): ExifDateTime | undefined {
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
function _get_creation_tzⵧfrom_exif(state: Immutable<State>): TimeZone | undefined {
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
function _get_creation_dateⵧfrom_exif(state: Immutable<State>): BetterDate | undefined {
	const { id, current_exif_data } = state

	assert(current_exif_data !== undefined, `_get_creation_date_from_exif(): ${id} exif data should have been read`)

	if (!is_exif_powered_media_file(state)) {
		assert(current_exif_data === null, `_get_creation_date_from_exif(): ${id} exif data should be null for non-exif media`)
		return undefined
	}

	assert(current_exif_data !== null, `_get_creation_date_from_exif(): ${id} exif data should not be empty for an exif-powered media`)

	const _from_exif‿edt: ExifDateTime | undefined = _get_creation_dateⵧfrom_exif‿edt(state)
	if (!_from_exif‿edt) return undefined

	const _from_exif__tz = _get_creation_tzⵧfrom_exif(state)
	const bcd = create_better_date_from_ExifDateTime(_from_exif‿edt, _from_exif__tz)
	logger.trace(`_get_creation_date__from_exif() got bcd from EXIF`, {
		//current_exif_data,
		//edt: _from_exif‿edt.toISOString(),
		_from_exif__tz,
		bcd: get_debug_representation(bcd),
	})
	return bcd
}
function _get_creation_dateⵧfrom_fsⵧoldest_known‿tms(state: Immutable<State>): TimestampUTCMs {
	assert(state.are_notes_restored, `_get_creation_date_from_original_fs_stats() needs notes restored`)
	// TODO one day ignore if we implement FS normalization & historical basename is processed
	return state.notes.historical.fs_bcd_tms
}
export function get_creation_dateⵧfrom_fsⵧcurrent‿tms(state: Immutable<State>): TimestampUTCMs {
	assert(state.current_fs_stats, 'get_creation_dateⵧfrom_fsⵧcurrent‿tms() fs stats collected')
	return get_most_reliable_birthtime_from_fs_stats(state.current_fs_stats)
}
function _get_creation_dateⵧfrom_basename_npⵧoldest_known(state: Immutable<State>): BetterDate | undefined {
	assert(state.are_notes_restored, `_get_creation_date__from_basename_np__oldest_known() needs notes restored`)

	const oldest_known_basename = get_oldest_known_basename(state)

	if (is_processed_media_basename(oldest_known_basename)) {
		// this is not the original basename, we lost the info...
		logger.warn(`_get_creation_date__from_basename_np__oldest_known() reporting loss of the original basename`, {
			id: state.id,
			oldest_known_basename,
		})
		return undefined
	}

	const parsed = get_oldest_known_basename‿parsed(state)
	return parsed.date
}
function _get_creation_dateⵧfrom_basename_pⵧoldest_known(state: Immutable<State>): BetterDate | undefined {
	assert(state.are_notes_restored, `_get_creation_date__from_basename_p__oldest_known() needs notes restored`)

	const oldest_known_basename = get_oldest_known_basename(state)

	if (!is_processed_media_basename(oldest_known_basename)) {
		// cool, ideal case of still knowing the original basename
		return undefined
	}

	// we lost the original basename
	// use this info with caution, since earlier versions of this tool may have had a bad algorithm
	const parsed = get_oldest_known_basename‿parsed(state)
	return parsed.date
}
function _get_creation_dateⵧfrom_basename_npⵧcurrent(state: Immutable<State>): BetterDate | undefined {
	if (!is_processed_media_basename(get_current_basename(state))) {
		const parsed = get_current_basename‿parsed(state)
		if (parsed.date)
			return parsed.date
	}

	return undefined
}
function _get_creation_dateⵧfrom_basename_pⵧcurrent(state: Immutable<State>): BetterDate | undefined {
	if (is_processed_media_basename(get_current_basename(state))) {
		const parsed = get_current_basename‿parsed(state)
		if (parsed.date)
			return parsed.date
	}

	return undefined
}
/*
function _get_creation_date__from_basename_np__any(state: Immutable<State>): BetterDate | undefined {
	if (!is_processed_media_basename(get_oldest_known_basename(state))) {
		const parsed = get_oldest_known_basename‿parsed(state)
		if (parsed.date)
			return parsed.date
	}

	return _get_creation_dateⵧfrom_basename_npⵧcurrent(state)
}
function _get_creation_date__from_basename_p__any(state: Immutable<State>): BetterDate | undefined {
	if (is_processed_media_basename(get_oldest_known_basename(state)))
		return get_oldest_known_basename‿parsed(state).date!

	if (is_processed_media_basename(get_current_basename(state)))
		return get_current_basename‿parsed(state).date!

	return undefined
}*/
// junk
function _get_creation_dateⵧfrom_parent_folderⵧoldest_known(state: Immutable<State>): BetterDate | undefined {
	assert(state.are_notes_restored, `_get_creation_date__from_parent_folder__original() needs notes restored`)

	const historical_neighbor_hints = state.notes.historical.neighbor_hints
	if (historical_neighbor_hints.parent_bcd)
		return create_better_date_obj(historical_neighbor_hints.parent_bcd)

	// try to infer a date from parent path
	const parent_basename = pathㆍparse_memoized(state.notes.historical.parent_path).base
	const parsed = parse_folder_basename(parent_basename)

	return parsed.date
}
function _get_creation_dateⵧfrom_parent_folderⵧcurrent(state: Immutable<State>): BetterDate | undefined {
	assert(state.current_neighbor_hints, `_get_creation_date__from_parent_folder__current() needs neighbor hints`)

	return NeighborHintsLib.get_fallback_junk_bcd(state.current_neighbor_hints)
}

// all together
export type DateConfidence =
	| 'primary' // reliable data coming from the file itself = we can match to an event and rename
	| 'secondary' // reliable data but coming from secondary sources such as folder date or neighbor hints = we can match to an event BUT won't rename
	| 'junk' // we don't even trust sorting this file
export interface BestCreationDate {
	candidate: BetterDate
	source: `${'exif' | 'basename_np' | 'fs' | 'basename_p' | 'parent'}ⵧ${'current' | 'oldest'}${'' | '+fs' | `+neighbor${'✔' | '?' | '✖'}`}`
	sourceV1: // TODO remove
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
// Note that oldest known !== original
// (ideally this func should NOT rely on anything else than TRULY ORIGINAL data)
export const get_best_creation_dateⵧfrom_oldest_known_data‿meta = micro_memoize(function get_best_creation_dateⵧfrom_oldest_known_data‿meta(state: Immutable<State>, PARAMS = get_params()): BestCreationDate {
	logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, {
			require_neighbors_hints: false,
			require_notes: true,
		}),
		'get_best_creation_dateⵧfrom_oldest_known_data‿meta() has_all_infos_for_extracting_the_creation_date()'
	)

	// Reminder: may not be the original, many things may have caused a FS date change (incl. our own FS normalization)
	const bcd__from_fs__oldest_known‿tms = _get_creation_dateⵧfrom_fsⵧoldest_known‿tms(state)
	const bcd__from_fs__oldest_known = create_better_date_from_utc_tms(bcd__from_fs__oldest_known‿tms, 'tz:auto')
	assert(bcd__from_fs__oldest_known‿tms === get_timestamp_utc_ms_from(bcd__from_fs__oldest_known), `oldest fs tms back and forth stability`)

	const result: BestCreationDate = {
		// so far. safe, init values
		candidate: bcd__from_fs__oldest_known,
		sourceV1: 'original_fs',
		source: 'fsⵧoldest',
		confidence: 'junk',
		from_historical: true,
		is_fs_matching: false,
	}

	/////// PRIMARY SOURCES ///////

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll try to get a more precise one from EXIF or FS if matching
	const bcd__from_basename_np__oldest_known: BetterDate | undefined = _get_creation_dateⵧfrom_basename_npⵧoldest_known(state)

	// strongest source
	const bcd__from_exif = _get_creation_dateⵧfrom_exif(state)
	logger.trace('get_best_creation_dateⵧfrom_oldest_known_data‿meta() trying EXIF…', {
		has_candidate: !!bcd__from_exif,
		...(!!bcd__from_exif && {data: state.current_exif_data}),
	})
	if (bcd__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = bcd__from_exif
		result.sourceV1 = 'exif'
		result.source = 'exifⵧoldest'
		result.confidence = 'primary'
		result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		if (bcd__from_basename_np__oldest_known) {
			// cross check
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_basename = get_human_readable_timestamp_auto(bcd__from_basename_np__oldest_known, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_basename)) {
				// perfect match, keep EXIF more precise
			}
			else if (are_dates_matching_while_disregarding_tz_and_precision(bcd__from_basename_np__oldest_known, result.candidate)) {
				// good enough, keep EXIF more precise
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`get_best_creation_date_meta__from_historical_data() EXIF vs. historical-basename discrepancy`, {
					oldest_known_basename: get_oldest_known_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(bcd__from_exif) - get_timestamp_utc_ms_from(bcd__from_basename_np__oldest_known)),
					id: state.id,
					auto_from_basename,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// second most authoritative source
	logger.trace('get_best_creation_dateⵧfrom_oldest_known_data‿meta() trying basename--NP', { has_candidate: !!bcd__from_basename_np__oldest_known })
	if (bcd__from_basename_np__oldest_known) {
		result.candidate = bcd__from_basename_np__oldest_known
		result.sourceV1 = 'original_basename_np'
		result.source = 'basename_npⵧoldest'
		result.confidence = 'primary'
		result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(bcd__from_fs__oldest_known, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.sourceV1 = 'original_basename_np+fs'
			result.source = 'basename_npⵧoldest+fs'
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

		logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// FS is ok as PRIMARY if confirmed by some primary hints
	const fs__reliabilityⵧaccording_to_env = NeighborHintsLib.get_historical_fs_reliability(state.notes.historical.neighbor_hints, bcd__from_fs__oldest_known‿tms)
	logger.trace('get_best_creation_dateⵧfrom_oldest_known_data‿meta() trying FS as primary (if reliable)…', {
		bcd__from_fs__oldest_known: get_debug_representation(bcd__from_fs__oldest_known),
		fs__reliabilityⵧaccording_to_env,
	})
	if (fs__reliabilityⵧaccording_to_env === 'reliable') {
		result.candidate = bcd__from_fs__oldest_known
		result.sourceV1 = 'original_fs+original_env_hints'
		result.source = 'fsⵧoldest+neighbor✔'
		result.confidence = 'primary'
		result.is_fs_matching = true

		logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// Note: date from parent folder should NEVER make it above secondary

	/////// SECONDARY SOURCES ///////
	// TODO review is that even useful?

	// if oldest known basename is already normalized,
	// it means that
	// 1) we don't know the original basename :-(
	// 2) theoretically if the file was renamed, it means that confidence was high at the time
	//    however it may have been an earlier, inferior version of this tool, so we can't trust it as primary (TODO reconsider in the future?)
	const date__from_basename_p__oldest_known = _get_creation_dateⵧfrom_basename_pⵧoldest_known(state)
	logger.trace('get_best_creation_dateⵧfrom_oldest_known_data‿meta() trying basename (already processed)…', { has_candidate: !!date__from_basename_p__oldest_known })
	if (date__from_basename_p__oldest_known) {
		result.candidate = date__from_basename_p__oldest_known
		result.sourceV1 = 'some_basename_p'
		result.source = 'basename_pⵧoldest'
		result.confidence = 'secondary' // since we can't guarantee that it's truly from original
		result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		// normalized is already super precise, no need to refine with FS
		// TODO see if we can migrate by detecting algo improvement?

		logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	logger.trace('get_best_creation_dateⵧfrom_oldest_known_data‿meta() trying FS as secondary (if reliability unknown)…', {
		bcd__from_fs__oldest_known: get_debug_representation(bcd__from_fs__oldest_known),
		fs__reliabilityⵧaccording_to_env,
	})
	if (fs__reliabilityⵧaccording_to_env === 'unknown') {
		// not that bad
		// we won't rename the file, but good enough to match to an event
		result.candidate = bcd__from_fs__oldest_known
		result.sourceV1 = 'original_fs+original_env_hints'
		result.source = 'fsⵧoldest+neighbor?'
		result.confidence = 'secondary'
		result.is_fs_matching = true

		logger.trace(`get_best_creation_date_meta__from_historical_data() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// worst secondary choice
	const bcdⵧfrom_parent_folderⵧoldest = _get_creation_dateⵧfrom_parent_folderⵧoldest_known(state)
	logger.trace('get_best_creation_dateⵧfrom_oldest_known_data‿meta() trying parent folder…', {
		has_candidate: !!bcdⵧfrom_parent_folderⵧoldest,
		bcdⵧfrom_parent_folderⵧoldest: get_debug_representation(bcdⵧfrom_parent_folderⵧoldest),
	})
	if (bcdⵧfrom_parent_folderⵧoldest) {
		// while the parent's date is likely to be several days off
		// it's still useful for sorting into an event
		result.candidate = bcdⵧfrom_parent_folderⵧoldest
		result.source = 'parentⵧoldest'
		result.sourceV1 = 'original_env_hints'
		result.confidence = 'secondary'
		result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__oldest_known, result.candidate)

		logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	/////// JUNK SOURCES ///////

	// still the starting default
	assert(result.source === 'fsⵧoldest')
	assert(result.candidate === bcd__from_fs__oldest_known)
	assert(result.confidence === 'junk')
	assert(fs__reliabilityⵧaccording_to_env === 'unreliable')
	result.source = 'fsⵧoldest+neighbor✖'
	result.is_fs_matching = true // obviously

	logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta() defaulted to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
	return result
}, {
	maxSize: 10, // we need 1 or millions. The >1 is for having less noise during unit tests across a few files
	onCacheHit() {
		logger.trace(`get_best_creation_dateⵧfrom_oldest_known_data‿meta()… [memoized hit]`)
	}
})

// used on 1st stage consolidation => it should be able to work without hints and notes
// info may be overriden by notes later
// useful for files we encounter for the first time
export const get_best_creation_dateⵧfrom_current_data‿meta = micro_memoize(function get_best_creation_dateⵧfrom_current_data‿meta(state: Immutable<State>, PARAMS = get_params()): BestCreationDate {
	logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, {
			should_log: true,
			require_notes: false,
			require_neighbors_hints: false,
		}),
		'get_best_creation_dateⵧfrom_current_data‿meta() has_all_infos_for_extracting_the_creation_date()'
	)

	const bcd__from_fs__current‿tms = get_creation_dateⵧfrom_fsⵧcurrent‿tms(state)
	const bcd__from_fs__current = create_better_date_from_utc_tms(bcd__from_fs__current‿tms, 'tz:auto')
	assert(bcd__from_fs__current‿tms === get_timestamp_utc_ms_from(bcd__from_fs__current), `current fs tms back and forth stability`)

	const result: BestCreationDate = {
		candidate: bcd__from_fs__current,
		sourceV1: 'current_fs',
		source: 'fsⵧcurrent',
		confidence: 'junk',
		from_historical: false, // always in this func
		is_fs_matching: false, // init value
	}

	/////// PRIMARY SOURCES ///////

	// some good cameras put the date in the file name
	// however it's usually only precise up to the day,
	// so we'll still try to get a more precise one from EXIF or FS if matching
	const bcd__from_basename_np__current: BetterDate | undefined = _get_creation_dateⵧfrom_basename_npⵧcurrent(state)

	// strongest source
	const bcd__from_exif = _get_creation_dateⵧfrom_exif(state)
	logger.trace('get_best_creation_dateⵧfrom_current_data‿meta() trying EXIF…', {
		has_candidate: !!bcd__from_exif,
		...(!!bcd__from_exif && {data: state.current_exif_data}),
	})
	if (bcd__from_exif) {
		// best situation, EXIF is the most reliable
		result.candidate = bcd__from_exif
		result.sourceV1 = 'exif'
		result.source = 'exifⵧcurrent'
		result.confidence = 'primary'
		result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, result.candidate)

		// cross-check the date from basename if any
		if (bcd__from_basename_np__current) {
			const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
			const auto_from_np_basename = get_human_readable_timestamp_auto(bcd__from_basename_np__current, 'tz:embedded')

			if (auto_from_candidate.startsWith(auto_from_np_basename)) {
				// perfect match + EXIF more precise
			}
			else if (are_dates_matching_while_disregarding_tz_and_precision(bcd__from_basename_np__current, result.candidate)) {
				// good enough, keep EXIF
				// TODO evaluate in case of timezone?
			}
			else {
				// this is suspicious, report it
				logger.warn(`_get_best_creation_date_meta__from_current_data() EXIF/np-basename discrepancy`, {
					basename: get_current_basename(state),
					oldest_known_basename: get_oldest_known_basename(state),
					diff: Math.abs(get_timestamp_utc_ms_from(bcd__from_exif) - get_timestamp_utc_ms_from(bcd__from_basename_np__current)),
					id: state.id,
					auto_from_np_basename,
					auto_from_exif: auto_from_candidate,
				})
			}
		}

		logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// second most authoritative source
	logger.trace('get_best_creation_dateⵧfrom_current_data‿meta() trying current basename--NP…', { has_candidate: !!bcd__from_basename_np__current })
	if (bcd__from_basename_np__current) {
		result.candidate = bcd__from_basename_np__current
		result.sourceV1 = 'current_basename_np'
		result.source = 'basename_npⵧcurrent'
		result.confidence = 'primary'
		result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, result.candidate)

		const auto_from_candidate = get_human_readable_timestamp_auto(result.candidate, 'tz:embedded')
		const auto_from_fs = get_human_readable_timestamp_auto(bcd__from_fs__current, 'tz:embedded')
		if (auto_from_fs.startsWith(auto_from_candidate)) {
			// perfect match, switch to FS more precise
			result.sourceV1 = 'some_basename_np+fs'
			result.source = 'basename_npⵧcurrent+fs'
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

		logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// FS is ok as PRIMARY if confirmed by some primary hints
	// Note that hints are secondary but the main data is truely primary
	if (state.current_neighbor_hints) {
		const fs__reliabilityⵧaccording_to_env = _get_current_fs_reliability_according_to_own_and_env(state)
		logger.trace('get_best_creation_dateⵧfrom_current_data‿meta() trying FS as primary (if reliable)…', {
			bcd__from_fs__current: get_debug_representation(bcd__from_fs__current),
			current_neighbor_hints: NeighborHintsLib.to_string(state.current_neighbor_hints),
			current_fs_reliability: fs__reliabilityⵧaccording_to_env,
			expected: 'reliable'
		})

		if (fs__reliabilityⵧaccording_to_env === 'reliable') {
			result.candidate = bcd__from_fs__current
			result.sourceV1 = 'current_fs+current_env_hints'
			result.source = 'fsⵧcurrent+neighbor✔'
			result.confidence = 'primary'
			result.is_fs_matching = true

			logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
			return result
		}
	}

	// Note: date from parent folder should NEVER make it above secondary

	/////// SECONDARY SOURCES ///////

	// if historical or current basename is already normalized,
	// since we only normalize on primary source of trust,
	// we trust our past self which may have had more info at the time
	// however we don't entirely trust (ex. old algorithm with bugs), so the confidence is downgraded to secondary
	const date__from_basename_p__current = _get_creation_dateⵧfrom_basename_pⵧcurrent(state)
	logger.trace('get_best_creation_dateⵧfrom_current_data‿meta() trying current basename--P…', { has_candidate: !!date__from_basename_p__current })
	if (date__from_basename_p__current) {
		result.candidate = date__from_basename_p__current
		result.sourceV1 = 'some_basename_p'
		result.source = 'basename_pⵧcurrent'
		result.confidence = 'secondary' // since we can't guarantee that it's truly from original + unsure we can trust a past algo
		result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, result.candidate)

		// normalized is already super precise, no need to refine with FS

		logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
		return result
	}

	// borderline secondary/junk
	logger.trace('get_best_creation_dateⵧfrom_current_data‿meta() trying env hints…', {
		current_neighbor_hints: NeighborHintsLib.to_string(state.current_neighbor_hints),
	})
	if (state.current_neighbor_hints) {
		const current_fs_reliability = _get_current_fs_reliability_according_to_own_and_env(state)
		logger.trace('get_best_creation_dateⵧfrom_current_data‿meta() trying FS as secondary (if reliability unknown)…', {
			bcd__from_fs__current: get_debug_representation(bcd__from_fs__current),
			//current_neighbor_hints: state.current_neighbor_hints,
			current_fs_reliability,
			expected: 'unknown'
		})
		if (current_fs_reliability === 'unknown') {
			result.candidate = bcd__from_fs__current
			result.sourceV1 = 'current_fs+current_env_hints'
			result.source = 'fsⵧcurrent+neighbor?'
			result.confidence = 'secondary'
			result.is_fs_matching = true

			logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${result.source} with confidence = ${result.confidence} ✔`)
			return result
		}

		// borderline secondary/junk
		// the user may have manually sorted the file into the right folder
		// why secondary and not junk? -> to keep the file in its current folder
		const bcdⵧfrom_parent_folderⵧcurrent = _get_creation_dateⵧfrom_parent_folderⵧcurrent(state)
		logger.trace('get_best_creation_dateⵧfrom_current_data‿meta() trying parent folder…', {
			has_candidate: !!bcdⵧfrom_parent_folderⵧcurrent,
			bcdⵧfrom_parent_folderⵧcurrent: get_debug_representation(bcdⵧfrom_parent_folderⵧcurrent),
		})
		if (bcdⵧfrom_parent_folderⵧcurrent) {
			result.candidate = bcdⵧfrom_parent_folderⵧcurrent
			result.sourceV1 = 'current_env_hints'
			result.source = 'parentⵧcurrent'
			result.confidence = 'secondary'
			result.is_fs_matching = are_dates_matching_while_disregarding_tz_and_precision(bcd__from_fs__current, result.candidate)
			assert(!result.is_fs_matching, `get_best_creation_date_meta__from_current_data() if FS matches why wasn't it taken as source??`)

			logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta() resolved to ${get_debug_representation(result.candidate)} from ${ result.source } with confidence = ${ result.confidence } ✔`)
			return result
		}
	}

	/////// JUNK SOURCE ///////

	// default to fs
	assert(result.source === 'fsⵧcurrent')
	assert(result.confidence === 'junk')
	if (state.current_neighbor_hints) {
		const current_fs_reliability = _get_current_fs_reliability_according_to_own_and_env(state)
		assert(current_fs_reliability === 'unreliable')
		result.source = 'fsⵧcurrent+neighbor✖'
	}

	logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta() defaulted to ${get_debug_representation(result.candidate)} from ${ result.source } with confidence = ${ result.confidence } ✔`)
	return result
}, {
	maxSize: 10, // we need 1 or millions. The >1 is for having less noise during unit tests across a few files
	onCacheHit() {
		logger.trace(`get_best_creation_dateⵧfrom_current_data‿meta()… [memoized hit]`)
	}
})

// Best creation date overall
// mixes the best info from historical and current + takes into account "manual"
export const get_best_creation_date‿meta = micro_memoize(function get_best_creation_date_meta(state: Immutable<State>, PARAMS = get_params()): BestCreationDate {
	logger.trace(`get_best_creation_date‿meta()`, { id: state.id })

	assert(
		has_all_infos_for_extracting_the_creation_date(state, {
			require_neighbors_hints: true,
			require_notes: true,
		}),
		'get_best_creation_date‿meta() has_all_infos_for_extracting_the_creation_date()'
	)

	const bcd__from_fs__oldest_known‿tms = _get_creation_dateⵧfrom_fsⵧoldest_known‿tms(state)
	const bcd__from_fs__oldest_known = create_better_date_from_utc_tms(bcd__from_fs__oldest_known‿tms, 'tz:auto')
	assert(bcd__from_fs__oldest_known‿tms === get_timestamp_utc_ms_from(bcd__from_fs__oldest_known), `original fs tms back and forth stability`)

	const result: BestCreationDate = {
		candidate: bcd__from_fs__oldest_known,
		sourceV1: 'original_fs',
		source: 'fsⵧoldest',
		confidence: 'junk',
		from_historical: false,
		is_fs_matching: false, // init value
	}

	/////// PRIMARY SOURCES ///////

	// the strongest indicator = explicit user's will
	const bcd__from_manual = _get_creation_dateⵧfrom_manual(state)
	logger.trace('get_best_creation_date‿meta() trying manual…')
	if (bcd__from_manual) {
		throw new Error('NIMP feature: manual date!')
	}

	// then rely on original data as much as possible
	logger.trace('get_best_creation_date‿meta() trying historical data…')
	const meta__from_oldest_known = get_best_creation_dateⵧfrom_oldest_known_data‿meta(state, PARAMS)
	if (meta__from_oldest_known.confidence === 'primary') {
		logger.trace(`get_best_creation_date‿meta() resolved to ${get_debug_representation(meta__from_oldest_known.candidate)} from ${result.source} of oldest data result ✔ (primary)`)
		return meta__from_oldest_known
	}

	// strongest source after "manual"
	// BUT redundant with "oldest known"
	const bcd__from_exif = _get_creation_dateⵧfrom_exif(state)
	assert(!bcd__from_exif, `get_best_creation_date‿meta() EXIF should have already been covered by "oldest known"`)

	logger.trace('get_best_creation_date‿meta() trying current data…')
	const meta__from_current = get_best_creation_dateⵧfrom_current_data‿meta(state, PARAMS)
	if (meta__from_current.confidence === 'primary') {
		logger.trace(`get_best_creation_date‿meta() resolved to ${get_debug_representation(meta__from_current.candidate)} from ${result.source} of current data result ✔ (primary)`)
		return meta__from_current
	}

	// Reminder: FS is handled by the "_historical()" selector
	// if not triggered, means current FS is not original hence not primary

	// Note: date from parent folder should NEVER make it above secondary

	/////// SECONDARY SOURCES ///////
	// for secondary source, it's the "current" which has priority

	if (meta__from_current.confidence === 'secondary') {
		logger.trace(`get_best_creation_date‿meta() resolved to ${get_debug_representation(meta__from_current.candidate)} from ${result.source} of current data result ✔ (secondary)`)
		return meta__from_current
	}

	if (meta__from_oldest_known.confidence === 'secondary') {
		logger.trace(`get_best_creation_date‿meta() resolved to ${get_debug_representation(meta__from_oldest_known.candidate)} from ${result.source} of oldest data result ✔ (secondary)`)
		return meta__from_oldest_known
	}

	/////// JUNK SOURCE ///////

	// at this level, historical is still better
	logger.trace(`get_best_creation_date‿meta() defaulted to ${get_debug_representation(meta__from_oldest_known.candidate)} from ${result.source} of oldest data result ✔ (junk)`)
	return meta__from_oldest_known
}, {
	maxSize: 10, // we need 1 or millions. The >1 is for having less noise during unit tests across a few files
	onCacheHit() {
		logger.trace(`get_best_creation_date_meta()… [memoized hit]`)
	}
})

export function get_best_creation_date(state: Immutable<State>): BetterDate {
	const meta = get_best_creation_date‿meta(state)
	return meta.candidate
}

export function get_best_creation_date‿compact(state: Immutable<State>): SimpleYYYYMMDD {
	return get_compact_date(get_best_creation_date(state), 'tz:embedded')
}

export function get_best_creation_date__year(state: Immutable<State>): number {
	return Math.trunc(get_best_creation_date‿compact(state) / 10000)
}

function _is_confident_in_date(state: Immutable<State>, up_to: DateConfidence): boolean {
	const meta = get_best_creation_date‿meta(state)
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

export function get_creation_dateⵧfrom_fsⵧcurrent__reliability_according_to_our_own_trustable_current_primary_date_sources(state: Immutable<State>): FsReliability {
	const bcdⵧfrom_fsⵧcurrent‿tms = get_creation_dateⵧfrom_fsⵧcurrent‿tms(state)
	const bcdⵧfrom_fsⵧcurrent = create_better_date_from_utc_tms(bcdⵧfrom_fsⵧcurrent‿tms, 'tz:auto')

	// TODO when we start doing FS normalization, detect it and return undefined

	const bcdⵧfrom_exif = _get_creation_dateⵧfrom_exif(state)
	if (bcdⵧfrom_exif) {
		if (are_dates_matching_while_disregarding_tz_and_precision(bcdⵧfrom_fsⵧcurrent, bcdⵧfrom_exif, state.id))
			return 'reliable'
	}

	const bcdⵧfrom_basename_npⵧcurrent = _get_creation_dateⵧfrom_basename_npⵧcurrent(state)
	if(bcdⵧfrom_basename_npⵧcurrent) {
		if (are_dates_matching_while_disregarding_tz_and_precision(bcdⵧfrom_fsⵧcurrent, bcdⵧfrom_basename_npⵧcurrent, state.id))
			return 'reliable'
	}

	if (!bcdⵧfrom_exif && !bcdⵧfrom_basename_npⵧcurrent) {
		return 'unknown'
	}

	logger.log('⚠️ get_creation_date__reliability_according_to_other_trustable_current_primary_date_sourcesⵧfrom_fsⵧcurrent() is yielding FALSE', {
		id: state.id,
		bcd__from_fs__current: get_debug_representation(bcdⵧfrom_fsⵧcurrent‿tms),
		bcd__from_exif: get_debug_representation(bcdⵧfrom_exif),
		bcd__from_basename__current_non_processed: get_debug_representation(bcdⵧfrom_basename_npⵧcurrent),
		//current_exif_data: state.current_exif_data,
	})

	return 'unreliable'
}

export function _get_current_fs_reliability_according_to_own_and_env(
	state: Immutable<State>,
	PARAMS = get_params(),
	neighbor_hints: Immutable<NeighborHints> = state.current_neighbor_hints!,
): FsReliability {
	assert(neighbor_hints, `_get_current_fs_assessed_reliability() should be called with neighbor hints`)

	// first look at ourself
	const self_assessed_reliability = get_creation_dateⵧfrom_fsⵧcurrent__reliability_according_to_our_own_trustable_current_primary_date_sources(state)
	if (self_assessed_reliability !== 'unknown') {
		logger.trace(`_get_current_fs_assessed_reliability() current fs reliability has been assessed to "${self_assessed_reliability}" from self`)
		return self_assessed_reliability
	}

	// unclear reliability so far, let's try to infer one from our neighbors
	const bcdⵧfrom_fsⵧcurrent‿tms = get_creation_dateⵧfrom_fsⵧcurrent‿tms(state)
	const reliability_according_to_neighbors = NeighborHintsLib.is_candidate_fs_bcd_looking_reliable_according_to_neighbor_hints(neighbor_hints, bcdⵧfrom_fsⵧcurrent‿tms)
	logger.trace(`_get_current_fs_reliability_according_to_own_and_env() current fs reliability has been assessed to "${reliability_according_to_neighbors}"`)
	return reliability_according_to_neighbors
}

// TODO export function should_normalize(...) if older norm etc. Or should be in ideal basename?
/*
export function is_date_from_original_data(state: Immutable<State>): boolean {
	const meta = get_best_creation_date‿meta(state)
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
		const bcd_meta = get_best_creation_date‿meta(state)

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
