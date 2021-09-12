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
	is_data_gathering_pass_1_done,
	get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources,
	is_current_basename_intentful_of_event_start,
} from './selectors'

////////////////////////////////////

function _get_starting_folder_type_from_path(id: FolderId, pathㆍparsed: path.ParsedPath): Type {
	assert(id, '_get_starting_folder_type_from_path() id')

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
	const type = _get_starting_folder_type_from_path(id, pathㆍparsed)

	return {
		id,
		type,
		reason_for_demotion_from_event: null,

		children_count: 0,
		children_pass_1_count: 0,
		children_pass_2_count: 0,

		children_bcd_ranges: {

			from_fsⵧcurrent: {
				begin: undefined,
				end: undefined,
			},

			from_primaryⵧcurrentⵧphase_1: {
				begin: undefined,
				end: undefined,
			},

			from_primaryⵧfinal: {
				begin: undefined,
				end: undefined,
			},
		},

		event_range: {
			begin: undefined,
			end: undefined,
		},

		children_fs_reliability_count: {
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
		children_count: state.children_count + 1,
	}
}

export function on_subfile_primary_infos_gathered(state: Immutable<State>, file_state: Immutable<File.State>, PARAMS: Immutable<Params> = get_params()): Immutable<State> {
	logger.trace(`${LIB} on_subfile_primary_infos_gathered(…)`, { file_id: file_state.id })

	if (File.is_notes(file_state)) {
		// skip those meta files
		return state
	}

	//////////// consolidate: reliability
	const file_bcd__reliabilityⵧfrom_fsⵧcurrent = File.get_creation_date__reliability_according_to_other_trustable_current_primary_date_sourcesⵧfrom_fsⵧcurrent(file_state)
	if (file_bcd__reliabilityⵧfrom_fsⵧcurrent === 'unreliable') {
		logger.warn(`⚠️ File "${file_state.id}" fs bcd reliability has been estimated as UNRELIABLE after phase 1`)
	}

	const key = String(file_bcd__reliabilityⵧfrom_fsⵧcurrent) as keyof State['children_fs_reliability_count']
	state = {
		...state,
		children_fs_reliability_count: {
			...state.children_fs_reliability_count,
			[key]: state.children_fs_reliability_count[key] + 1,
		},
	}

	//////////// consolidate: date range -- fs current
	const file_bcdⵧfrom_fsⵧcurrent‿tms = File.get_creation_dateⵧfrom_fsⵧcurrent‿tms(file_state)

	const new_children_begin_dateⵧfrom_fsⵧcurrent = Math.min(
			state.children_bcd_ranges.from_fsⵧcurrent.begin ?? Infinity,
			file_bcdⵧfrom_fsⵧcurrent‿tms
		)
	const new_children_end_dateⵧfrom_fsⵧcurrent = Math.max(
		state.children_bcd_ranges.from_fsⵧcurrent.end ?? 0,
		file_bcdⵧfrom_fsⵧcurrent‿tms
	)

	if (new_children_begin_dateⵧfrom_fsⵧcurrent === state.children_bcd_ranges.from_fsⵧcurrent.begin
		&& new_children_end_dateⵧfrom_fsⵧcurrent === state.children_bcd_ranges.from_fsⵧcurrent.end) {
		// no change
	} else {
		logger.verbose(
			`${ LIB } updating folder’s children's "bcd ⵧ from fs ⵧ current" date range`,
			{
				id: state.id,
				file_bcdⵧfrom_fsⵧcurrent‿tms,
				new_children_begin_dateⵧfrom_fsⵧcurrent,
				new_children_end_dateⵧfrom_fsⵧcurrent,
			}
		)

		state = {
			...state,

			children_bcd_ranges: {
				...state.children_bcd_ranges,
				from_fsⵧcurrent: {
					begin: new_children_begin_dateⵧfrom_fsⵧcurrent,
					end: new_children_end_dateⵧfrom_fsⵧcurrent,
				},
			}
		}
	}

	//////////// consolidate: date range -- primary current
	const file_bcdⵧfrom_primaryⵧcurrent_meta = File.get_best_creation_dateⵧfrom_current_data‿meta(file_state)
	if (file_bcdⵧfrom_primaryⵧcurrent_meta.confidence !== 'primary') {
		// low confidence = don't act on that
	}
	else {
		const file_bcd__from_primary_current = file_bcdⵧfrom_primaryⵧcurrent_meta.candidate

		const new_children_begin_date__primary_current = state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.begin
			? BetterDateLib.min(state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.begin, file_bcd__from_primary_current)
			: file_bcd__from_primary_current
		const new_children_end_date__primary_current = state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.end
			? BetterDateLib.max(state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.end, file_bcd__from_primary_current)
			: file_bcd__from_primary_current

		if (BetterDateLib.is_deep_equal(new_children_begin_date__primary_current, state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.begin)
			&& BetterDateLib.is_deep_equal(new_children_end_date__primary_current, state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1.end)) {
			// no change
		} else {
			logger.verbose(
				`${ LIB } updating folder’s children's "current primary" date range`,
				{
					id: state.id,
					file_bcd__from_primary_current,
					new_children_begin_date__primary_current,
					new_children_end_date__primary_current,
				}
			)

			state = {
				...state,

				children_bcd_ranges: {
					...state.children_bcd_ranges,
					from_primaryⵧcurrentⵧphase_1: {
						begin: new_children_begin_date__primary_current,
						end: new_children_end_date__primary_current,
					},
				}
			}
		}
	}

	state = {
		...state,
		children_pass_1_count: state.children_pass_1_count + 1,
	}

	if (is_data_gathering_pass_1_done(state)) {
		state = on_fs_exploration_done(state)
	}

	return state
}

// is automatically called by on_subfile_primary_infos_gathered()
// but still useful on its own for unit tests
// TODO call it for empty dirs?
export function on_fs_exploration_done(state: Immutable<State>): Immutable<State> {
	assert(is_data_gathering_pass_1_done(state), `on_fs_exploration_done() pass 1 should be done!`)
	assert(state.children_pass_2_count === 0, `on_fs_exploration_done() pass 2 should NOT be started!`)

	if (state.event_range.begin)
		return state // nothing to do, already set

	// init the event range
	const event_begin_from_folder_basename = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
	if (event_begin_from_folder_basename) {
		state = {
			...state,
			event_range: {
				// this is just a starter, 2nd
				begin: event_begin_from_folder_basename,
				end: event_begin_from_folder_basename,
			}
		}
	}

	return state
}

export function on_subfile_all_infos_gathered(state: Immutable<State>, file_state: Immutable<File.State>, PARAMS: Immutable<Params> = get_params()): Immutable<State> {
	logger.trace(`${LIB} on_subfile_all_infos_gathered(…)`, { file_id: file_state.id })

	if (File.is_notes(file_state)) {
		// skip those meta files
		return state
	}

	//////////// consolidate: date range -- primary final
	const file_meta_bcd = File.get_best_creation_date‿meta(file_state)
	if (file_meta_bcd.confidence !== 'primary') {
		// low confidence = don't act on that
	}
	else {
		const file_bcd__primary_final = file_meta_bcd.candidate

		const new_children_begin_date__primary_final = state.children_bcd_ranges.from_primaryⵧfinal.begin
			? BetterDateLib.min(state.children_bcd_ranges.from_primaryⵧfinal.begin, file_bcd__primary_final)
			: file_bcd__primary_final
		const new_children_end_date__primary_final = state.children_bcd_ranges.from_primaryⵧfinal.end
			? BetterDateLib.max(state.children_bcd_ranges.from_primaryⵧfinal.end, file_bcd__primary_final)
			: file_bcd__primary_final

		if (BetterDateLib.is_deep_equal(new_children_begin_date__primary_final, state.children_bcd_ranges.from_primaryⵧfinal.begin)
			&& BetterDateLib.is_deep_equal(new_children_end_date__primary_final, state.children_bcd_ranges.from_primaryⵧfinal.end)) {
			// no change
		} else {
			logger.verbose(
				`${ LIB } updating folder’s children's "primary final" date range`,
				{
					id: state.id,
					file_bcd__primary_final: get_debug_representation(file_bcd__primary_final),
					new_children_begin_date__primary_final: get_debug_representation(new_children_begin_date__primary_final),
					new_children_end_date__primary_final: get_debug_representation(new_children_end_date__primary_final),
				}
			)

			state = {
				...state,
				children_bcd_ranges: {
					...state.children_bcd_ranges,
					from_primaryⵧfinal: {
						begin: new_children_begin_date__primary_final,
						end: new_children_end_date__primary_final,
					},
				}
			}
		}
	}

	//////////// consolidate: event date range
	if (state.type === Type.event) {
		if (file_meta_bcd.confidence !== 'primary') {
			// low confidence = don't act on that
		}
		else {
			const file_bcd = file_meta_bcd.candidate
			const event_begin_from_folder_basename = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)

			const new_event_begin_date = event_begin_from_folder_basename
				? event_begin_from_folder_basename // always have priority if present
				: state.event_range.begin
					? BetterDateLib.min(state.event_range.begin, file_bcd)
					: file_bcd
			let new_event_end_date = state.event_range.end
				? BetterDateLib.max(state.event_range.end, file_bcd)
				: file_bcd

			const capped_end_date = BetterDateLib.add_days(new_event_begin_date, PARAMS.max_event_durationⳇₓday)
			const is_range_too_big = BetterDateLib.compare_utc(new_event_end_date, capped_end_date) > 0
			new_event_end_date = BetterDateLib.min(new_event_end_date, capped_end_date)

			if (BetterDateLib.is_deep_equal(new_event_begin_date, state.event_range.begin)
				&& BetterDateLib.is_deep_equal(new_event_end_date, state.event_range.end)) {
				// no change
			} else {
				if (is_range_too_big && !is_current_basename_intentful_of_event_start(state)) {
					logger.info(
						`${LIB} folder: date range too big, most likely not an event, demoting...`, {
							id: state.id,
							file_id: file_state.id,
							file_bcd: get_debug_representation(file_bcd),
							new_event_begin_date: get_debug_representation(new_event_begin_date),
							new_event_end_date: get_debug_representation(new_event_end_date),
							capped_end_date: get_debug_representation(capped_end_date),
						})
					state = demote_to_unknown(state, `date range too big`)
				} else {
					if (is_range_too_big) {
						logger.info(
							`${LIB} folder: date range too big but basename is intentful: event end date was capped at +${ PARAMS.max_event_durationⳇₓday }d`, {
								id: state.id,
								file_id: file_state.id,
								file_bcd: get_debug_representation(file_bcd),
								new_event_begin_date: get_debug_representation(new_event_begin_date),
								new_event_end_date: get_debug_representation(new_event_end_date),
								capped_end_date: get_debug_representation(capped_end_date),
							})
					}
					else {
						logger.verbose(
							`${LIB} updating folder’s event date range`,
							{
								id: state.id,
								file_bcd: get_debug_representation(file_bcd),
								new_event_begin_date: get_debug_representation(new_event_begin_date),
								new_event_end_date: get_debug_representation(new_event_end_date),
								was_capped: is_range_too_big,
							}
						)
					}

					state = {
						...state,
						event_range: {
							begin: new_event_begin_date,
							end: new_event_end_date,
						}
					}
				}
			}
		}
	}

	return {
		...state,
		children_pass_2_count: state.children_pass_2_count + 1,
	}
}

export function on_overlap_clarified(state: Immutable<State>, target_end_date‿symd: SimpleYYYYMMDD, PARAMS = get_params()): Immutable<State> {
	logger.trace(`${LIB} on_overlap_clarified(…)`, {
		prev_end_date: state.event_range.end,
		new_end_date‿symd: target_end_date‿symd,
	})

	assert(state.type === Type.event, `on_overlap_clarified() should be called on an event`)
	assert(state.event_range.begin, `on_overlap_clarified() should be called on a dated event`)

	const end_date = BetterDateLib.create_better_date_from_symd(target_end_date‿symd, 'tz:auto')
	const capped_end_date = BetterDateLib.add_days(state.event_range.begin, PARAMS.max_event_durationⳇₓday)
	assert(BetterDateLib.compare_utc(end_date, capped_end_date) <= 0, `on_overlap_clarified() target event range should be acceptable`)

	return {
		...state,
		event_range: {
			...state.event_range,
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
		event_range: {
			begin: undefined,
			end: undefined,
		},
	}
}

/*
export function on_moved(state: Immutable<State>, new_id: RelativePath): Immutable<State> {
	logger.trace(`${LIB} on_moved(…)`, { new_id })

	return {
		...state,
		id: new_id,
		cached: {
			...state.cached,
			base: path.basename(new_id),
		},
	}
}*/

// TODO on subfile deleted / moved
