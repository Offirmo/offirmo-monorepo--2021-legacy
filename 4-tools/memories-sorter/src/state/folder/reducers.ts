import path from 'path'
import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import { RelativePath, SimpleYYYYMMDD } from '../../types'
import { get_params, Params } from '../../params'
import { pathㆍparse_memoized } from '../../services/name_parser'
import logger from '../../services/logger'
import * as BetterDateLib from '../../services/better-date'
import { get_debug_representation } from '../../services/better-date'
import { is_year } from '../../services/matchers'
import * as File from '../file'

import {
	LIB,
	SPECIAL_FOLDERⵧINBOX__BASENAME,
	SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME,
	SPECIAL_FOLDERⵧCANT_RECOGNIZE__BASENAME,
} from './consts'
import {
	FolderId,
	Type,
	State,
} from './types'
import {
	get_depth,
	get_event_end_date‿symd,
	get_event_range,
	get_event_begin_date,
	ERROR__RANGE_TOO_BIG,
	is_looking_like_a_backup,
	get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources,
} from './selectors'

////////////////////////////////////

function _get_inferred_folder_type_from_path(id: FolderId, pathㆍparsed: path.ParsedPath): Type {
	assert(id, '_get_inferred_folder_type_from_path() id')

	if (id === '.') return Type.root

	const depth = get_depth(pathㆍparsed)

	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDERⵧINBOX__BASENAME) return Type.inbox
	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME) return Type.cant_autosort
	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDERⵧCANT_RECOGNIZE__BASENAME) return Type.cant_recognize
	if (depth === 0 && is_year(pathㆍparsed.base)) return Type.year

	return Type.event // for starter, may be demoted later
}

////////////////////////////////////

export function create(id: RelativePath): Immutable<State> {
	logger.trace(`${LIB} create(…)`, { id })

	const pathㆍparsed = pathㆍparse_memoized(id)
	const type = _get_inferred_folder_type_from_path(id, pathㆍparsed)

	return {
		id,
		type,
		reason_for_demotion_from_event: null,

		media_children_count: 0,
		media_children_pass_1_count: 0,
		media_children_pass_2_count: 0,

		media_children_bcd_ranges: {

			from_fsⵧcurrent: undefined,

			from_primaryⵧcurrentⵧphase_1: undefined,

			from_primaryⵧfinal: undefined,
		},

		forced_event_range: null,

		media_children_fs_reliability_count: {
			'unknown': 0,
			'unreliable': 0,
			'reliable': 0,
		},
	}
}

export function on_subfile_found(state: Immutable<State>, file_state: Immutable<File.State>): Immutable<State> {
	logger.trace(`${LIB} on_subfile_found(…)`, { file_id: file_state.id })

	if (File.is_notes(file_state)) {
		// skip those meta files
		return state
	}

	return {
		...state,
		media_children_count: state.media_children_count + 1,
	}

	// Should we automatically call on_info gathered() ?
	// NO! We don't know whether new files will be added! (ex. new folders created during the sorting phase)
}

export function on_subfile_primary_infos_gathered(state: Immutable<State>, file_state: Immutable<File.State>): Immutable<State> {
	logger.trace(`${LIB} on_subfile_primary_infos_gathered(…)…`, { file_id: file_state.id })

	if (File.is_notes(file_state)) {
		// skip those meta files
		return state
	}

	assert(state.media_children_pass_1_count < state.media_children_count, `on_subfile_primary_infos_gathered() should not be called x times!`)

	//////////// consolidate: reliability
	const file_bcd__reliabilityⵧfrom_fsⵧcurrent = File.get_creation_dateⵧfrom_fsⵧcurrent__reliability_according_to_our_own_trustable_current_primary_date_sources(file_state)
	/*if (file_bcd__reliabilityⵧfrom_fsⵧcurrent === 'unreliable') {
		logger.warn(`⚠️ File "${file_state.id}" fs bcd reliability has been estimated as UNRELIABLE after phase 1`)
	}*/

	const key = String(file_bcd__reliabilityⵧfrom_fsⵧcurrent) as keyof State['media_children_fs_reliability_count']
	state = {
		...state,
		media_children_fs_reliability_count: {
			...state.media_children_fs_reliability_count,
			[key]: state.media_children_fs_reliability_count[key] + 1,
		},
	}

	//////////// consolidate: date range -- fs current
	const file_bcdⵧfrom_fsⵧcurrent‿tms = File.get_creation_dateⵧfrom_fsⵧcurrent‿tms(file_state)

	const new_children_begin_dateⵧfrom_fsⵧcurrent = Math.min(
			state.media_children_bcd_ranges.from_fsⵧcurrent?.begin ?? Infinity,
			file_bcdⵧfrom_fsⵧcurrent‿tms
		)
	const new_children_end_dateⵧfrom_fsⵧcurrent = Math.max(
			state.media_children_bcd_ranges.from_fsⵧcurrent?.end ?? 0,
			file_bcdⵧfrom_fsⵧcurrent‿tms
		)

	if (new_children_begin_dateⵧfrom_fsⵧcurrent === state.media_children_bcd_ranges.from_fsⵧcurrent?.begin
		&& new_children_end_dateⵧfrom_fsⵧcurrent === state.media_children_bcd_ranges.from_fsⵧcurrent?.end) {
		// no change
	} else {
		logger.silly(
			`${ LIB } updating folder’s children's "bcd ⵧ from fs ⵧ current" date range`,
			{
				id: state.id,
				...(new_children_begin_dateⵧfrom_fsⵧcurrent !== state.media_children_bcd_ranges.from_fsⵧcurrent?.begin && {
					begin_before: get_debug_representation(state.media_children_bcd_ranges.from_fsⵧcurrent?.begin),
					begin_new: get_debug_representation(new_children_begin_dateⵧfrom_fsⵧcurrent),
				}),
				...(new_children_end_dateⵧfrom_fsⵧcurrent !== state.media_children_bcd_ranges.from_fsⵧcurrent?.end && {
					end_before: get_debug_representation(state.media_children_bcd_ranges.from_fsⵧcurrent?.end),
					end_new: get_debug_representation(new_children_end_dateⵧfrom_fsⵧcurrent),
				}),
			}
		)

		state = {
			...state,

			media_children_bcd_ranges: {
				...state.media_children_bcd_ranges,
				from_fsⵧcurrent: {
					begin: new_children_begin_dateⵧfrom_fsⵧcurrent,
					end: new_children_end_dateⵧfrom_fsⵧcurrent,
				},
			}
		}
	}

	//////////// consolidate: date range -- primary current
	assert(!File.has_neighbor_hints(file_state), `on_subfile_primary_infos_gathered() should not have neighbor hints yet`)
	const file_bcdⵧfrom_primaryⵧcurrent‿meta = File.get_best_creation_dateⵧfrom_current_data‿meta(file_state)
	if (file_bcdⵧfrom_primaryⵧcurrent‿meta.confidence !== 'primary') {
		// low confidence = don't act on that
	}
	else {
		const file_bcd__from_primary_current = file_bcdⵧfrom_primaryⵧcurrent‿meta.candidate

		const new_children_begin_dateⵧfrom_primaryⵧcurrent = state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.begin
			? BetterDateLib.min(state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.begin, file_bcd__from_primary_current)
			: file_bcd__from_primary_current
		const new_children_end_dateⵧfrom_primaryⵧcurrent = state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.end
			? BetterDateLib.max(state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.end, file_bcd__from_primary_current)
			: file_bcd__from_primary_current

		if (BetterDateLib.is_deep_equal(new_children_begin_dateⵧfrom_primaryⵧcurrent, state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.begin)
			&& BetterDateLib.is_deep_equal(new_children_end_dateⵧfrom_primaryⵧcurrent, state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.end)) {
			// no change
		} else {
			logger.silly(
				`${ LIB } updating folder’s children's "current primary" date range`,
				{
					id: state.id,
					...(new_children_begin_dateⵧfrom_primaryⵧcurrent !== state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.begin && {
						begin_before: get_debug_representation(state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.begin),
						begin_now: get_debug_representation(new_children_begin_dateⵧfrom_primaryⵧcurrent),
					}),
					...(new_children_end_dateⵧfrom_primaryⵧcurrent !== state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.end && {
						end_before: get_debug_representation(state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.end),
						end_now: get_debug_representation(new_children_end_dateⵧfrom_primaryⵧcurrent),
					}),
				}
			)

			state = {
				...state,

				media_children_bcd_ranges: {
					...state.media_children_bcd_ranges,
					from_primaryⵧcurrentⵧphase_1: {
						begin: new_children_begin_dateⵧfrom_primaryⵧcurrent,
						end: new_children_end_dateⵧfrom_primaryⵧcurrent,
					},
				}
			}
		}
	}

	state = {
		...state,
		media_children_pass_1_count: state.media_children_pass_1_count + 1,
	}

	return state
}

// OPTIONAL, used to semantically consolidate some infos to NULL after discovering the FS
// everything should work even if not called (undefined ~ null)
export function on_fs_exploration_done(state: Immutable<State>): Immutable<State> {
	if (state.media_children_pass_1_count !== state.media_children_count) {
		console.log(state)
		debugger
	}
	assert(state.media_children_pass_1_count === state.media_children_count)

	const { media_children_count } = state
	if (media_children_count === 0) {
		state = {
			...state,
			media_children_bcd_ranges: {
				...state.media_children_bcd_ranges,
				from_fsⵧcurrent: null,
				from_primaryⵧcurrentⵧphase_1: null,
				from_primaryⵧfinal: null,
			},
		}
	}

	return state
}

export function on_subfile_all_infos_gathered(state: Immutable<State>, file_state: Immutable<File.State>): Immutable<State> {
	logger.trace(`${LIB} on_subfile_all_infos_gathered(…)`, { file_id: file_state.id })

	if (File.is_notes(file_state)) {
		// skip those meta files
		return state
	}

	assert(state.media_children_pass_2_count < state.media_children_count, `on_subfile_all_infos_gathered() should not be called x times!`)

	//////////// consolidate: date range -- primary final
	const file_bcd‿meta = File.get_best_creation_date‿meta(file_state)
	if (file_bcd‿meta.confidence !== 'primary') {
		// low confidence = don't act on that
	}
	else {
		const file_bcd__primary_final = file_bcd‿meta.candidate

		const new_children_begin_date__primary_final = state.media_children_bcd_ranges.from_primaryⵧfinal?.begin
			? BetterDateLib.min(state.media_children_bcd_ranges.from_primaryⵧfinal.begin, file_bcd__primary_final)
			: file_bcd__primary_final
		const new_children_end_date__primary_final = state.media_children_bcd_ranges.from_primaryⵧfinal?.end
			? BetterDateLib.max(state.media_children_bcd_ranges.from_primaryⵧfinal.end, file_bcd__primary_final)
			: file_bcd__primary_final

		if (BetterDateLib.is_deep_equal(new_children_begin_date__primary_final, state.media_children_bcd_ranges.from_primaryⵧfinal?.begin)
			&& BetterDateLib.is_deep_equal(new_children_end_date__primary_final, state.media_children_bcd_ranges.from_primaryⵧfinal?.end)) {
			// no change
		} else {
			logger.silly(
				`${ LIB } updating folder’s children's "final primary" date range`,
				{
					id: state.id,
					...(new_children_begin_date__primary_final !== state.media_children_bcd_ranges.from_primaryⵧfinal?.begin && {
						begin_before: get_debug_representation(state.media_children_bcd_ranges.from_primaryⵧfinal?.begin),
						begin_now: get_debug_representation(new_children_begin_date__primary_final),
					}),
					...(new_children_end_date__primary_final !== state.media_children_bcd_ranges.from_primaryⵧfinal?.end && {
						end_before: get_debug_representation(state.media_children_bcd_ranges.from_primaryⵧfinal?.end),
						end_now: get_debug_representation(new_children_end_date__primary_final),
					}),
				}
			)

			state = {
				...state,
				media_children_bcd_ranges: {
					...state.media_children_bcd_ranges,
					from_primaryⵧfinal: {
						begin: new_children_begin_date__primary_final,
						end: new_children_end_date__primary_final,
					},
				}
			}
		}
	}

	state = {
		...state,
		media_children_pass_2_count: state.media_children_pass_2_count + 1,
	}

	return state
}

// to be called after FS exploration for pre-existing folders
export function on_all_infos_gathered(state: Immutable<State>): Immutable<State> {
	assert(state.media_children_pass_2_count === state.media_children_count)

	const { media_children_count } = state
	if (media_children_count <= 0) {
		logger.verbose(`${LIB} ☑ FYI folder fully explored: type="${state.type}", no media children ✖`, {
			id: state.id,
			...(state.reason_for_demotion_from_event && { reason_for_demotion_from_event: state.reason_for_demotion_from_event }),
		})
	} else
	{
		try {
			const event_range = get_event_range(state)

			if (!event_range) {
				logger.warn(`${LIB} FYI folder fully explored: type="${state.type}", has media children but event date range = NONE!?`, {
					id: state.id,
					type: state.type,
					media_children_count,
					...(state.reason_for_demotion_from_event && { reason_for_demotion_from_event: state.reason_for_demotion_from_event }),
					is_looking_like_a_backup: is_looking_like_a_backup(state),
					event_beginⵧfrom_folder_basename: get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state),
				})
			}
			else {
				assert(state.type === Type.event || state.type === Type.overlapping_event)
				logger.verbose(`${LIB} ☑ FYI folder fully explored: type="${state.type}"`, {
					id: state.id,
					media_children_count,
					event_range: `${get_debug_representation(event_range.begin)} → ${get_debug_representation(event_range.end)}`,
					// TODO range size in days
				})
			}
		}
		catch (err: any) {
			if (err?.message === ERROR__RANGE_TOO_BIG) {
				state = demote_to_unknown(state, `date range too big`)
			}

			logger.warn(
				`${LIB} FYI folder fully explored: type="${state.type}", event date range = NONE!?(2)`, {
					id: state.id,
					...(state.reason_for_demotion_from_event && { reason_for_demotion_from_event: state.reason_for_demotion_from_event }),
				}
			)
		}
	}

	return  state
}

export function on_overlap_clarified(state: Immutable<State>, target_end_date‿symd: SimpleYYYYMMDD, PARAMS: Immutable<Params> = get_params()): Immutable<State> {
	logger.trace(`${LIB} on_overlap_clarified(…)`, {
		prev_end_date‿symd: get_event_end_date‿symd(state),
		new_end_date‿symd: target_end_date‿symd,
	})

	assert(state.type === Type.event, `on_overlap_clarified() should be called on an event`)
	assert(!!get_event_range(state), `on_overlap_clarified() should be called on a dated event`)

	const end_date = BetterDateLib.create_better_date_from_symd(target_end_date‿symd, 'tz:auto')
	const capped_end_date = BetterDateLib.add_days(get_event_begin_date(state), PARAMS.max_event_durationⳇₓday)
	assert(BetterDateLib.compare_utc(end_date, capped_end_date) <= 0, `on_overlap_clarified() target event range should be acceptable`)

	return {
		...state,
		forced_event_range: {
			begin: get_event_begin_date(state),
			end: end_date,
		},
	}
}

export function demote_to_overlapping(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} demote_to_overlapping(…)`, { id: state.id })

	assert(state.type === Type.event, 'demote_to_overlapping(): should be demote-able')

	return {
		...state,
		type: Type.overlapping_event,
	}
}

export function demote_to_unknown(state: Immutable<State>, reason: string): Immutable<State> {
	logger.trace(`${LIB} demote_to_unknown(…)`, { id: state.id, reason})

	assert(state.type === Type.event, 'demote_to_unknown(): should be demote-able')

	return {
		...state,
		type: Type.unknown,
		reason_for_demotion_from_event: reason,
		forced_event_range: null,
	}
}

// either deleted or moved
export function on_subfile_removed(state: Immutable<State>): Immutable<State> {

	// Do nothing!!!
	// The infos we store in a folder are meant to evaluate the folder type and date range
	// once the sorting begins, we no longer need to change those infos
	// hence we don't care about children anymore

	return state
}
