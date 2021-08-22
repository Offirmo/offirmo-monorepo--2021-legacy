import path from 'path'
import { Enum } from 'typescript-string-enums'
import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { DIGIT_PROTECTION_SEPARATOR } from '../../consts'
import { Basename, RelativePath, SimpleYYYYMMDD } from '../../types'
import { get_params, Params } from '../../params'
import { is_year, is_compact_date, is_digit } from '../../services/matchers'
import { parse_folder_basename, ParseResult, pathㆍparse_memoized, is_processed_event_folder_basename } from '../../services/name_parser'
import logger from '../../services/logger'
import * as BetterDateLib from '../../services/better-date'
import {
	add_days_to_simple_date,
	BetterDate,
	get_compact_date,
	get_debug_representation,
} from '../../services/better-date'
import * as File from '../file'
import { FsReliability, NeighborHints } from '../file'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

////////////////////////////////////

const LIB = '📂'

export const Type = Enum(
	'root',
	'inbox',

	'year',
	'event', // by default

	'overlapping_event', // used to be an event but other folders are overlapping it (or duplicate)
	'cant_recognize',
	'cant_autosort',
	'unknown', // anything else that can't be an event
)
export type Type = Enum<typeof Type> // eslint-disable-line no-redeclare

function _get_special_folder_final_base(type: Type): Basename {
	return `- ${type}`
}
export const SPECIAL_FOLDER__INBOX__BASENAME = _get_special_folder_final_base(Type.inbox)
export const SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME = _get_special_folder_final_base(Type.cant_autosort)
export const SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME = _get_special_folder_final_base(Type.cant_recognize)
export const SPECIAL_FOLDERS__BASENAMES = [
	SPECIAL_FOLDER__INBOX__BASENAME,
	SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME,
	SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME,
]

export type FolderId = RelativePath

export interface State {
	id: FolderId
	type: Type
	reason_for_demotion_from_event: null | string

	// XXX data loop by having the files using the folder then the folder using the files??

	// Date ranges from children
	children_date_ranges: {
		// ALL can be null if no children TODO review

		// needed to assess whether the fs data looks reliable in this folder
		from_fs_current: {
			begin: undefined | TimestampUTCMs
			end: undefined | TimestampUTCMs
		},

		// after 1st pass
		// EARLY/BASIC/PRIMARY range of the RELIABLE media files currently in this folder (without hints or notes)
		// This is used to hint the files and help them confirm their FS birthtime
		// needed to discriminate whether an hypothetical basename date is an event or a backup
		from_primary_current: {
			begin: undefined | BetterDate
			end: undefined | BetterDate
		},

		// after 2nd pass
		// FINAL range of the media files currently in this folder
		// This happens after the files got the hints + notes restored
		from_primary_final: {
			begin: undefined | BetterDate
			end: undefined | BetterDate
		},
	}

	// if this folder is an event, what is the range assigned to it? (may be arbitrarily set)
	event_range: {
		begin: undefined | BetterDate
		end: undefined | BetterDate
	}

	children_fs_reliability_count: {
		'unknown': number,
		'unreliable': number,
		'reliable': number,
	}

	// intermediate data for internal assertions
	children_count: number,
	children_pass_1_count: number,
	children_pass_2_count: number,
}

///////////////////// ACCESSORS /////////////////////

export function get_current_relative_path(state: Immutable<State>): RelativePath {
	return state.id
}

export function get_current_path‿pparsed(state: Immutable<State>): Immutable<path.ParsedPath> {
	return pathㆍparse_memoized(get_current_relative_path(state))
}

export function get_basename(state: Immutable<State>): Basename {
	return get_current_path‿pparsed(state).base
}

export function get_depth(data: Immutable<State> | Immutable<path.ParsedPath>): number {
	const pathㆍparsed = (data as any).base
		? (data as Immutable<path.ParsedPath>)
		: get_current_path‿pparsed(data as Immutable<State>)

	return pathㆍparsed.dir
		? pathㆍparsed.dir.split(path.sep).length
		: 0
}

export function get_current_basename‿parsed(state: Immutable<State>): Immutable<ParseResult> {
	return parse_folder_basename(get_basename(state))
}

function _get_starting_folder_type_from_path(id: FolderId, pathㆍparsed: path.ParsedPath): Type {
	assert(id, '_get_starting_folder_type_from_path() id')

	if (id === '.') return Type.root

	const depth = get_depth(pathㆍparsed)

	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDER__INBOX__BASENAME) return Type.inbox
	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME) return Type.cant_autosort
	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME) return Type.cant_recognize
	if (depth === 0 && is_year(pathㆍparsed.base)) return Type.year

	return Type.event // for starter, may be demoted later
}

function is_pass_1_done(state: Immutable<State>): boolean {
	return state.children_pass_1_count === state.children_count
}
function is_pass_2_done(state: Immutable<State>): boolean {
	return state.children_pass_2_count === state.children_count
}

/*
export function get_reliable_children_range(state: Immutable<State>): null | [ SimpleYYYYMMDD, SimpleYYYYMMDD ] {
	const { children_begin_date, children_end_date } = state
	if (!children_begin_date || !children_end_date_symd) return null
	return [ children_begin_date_symd, children_end_date_symd ]
}
*/
function _get_children_fs_reliability(state: Immutable<State>): FsReliability {
	assert(is_pass_1_done(state), `${LIB} _get_children_fs_reliability() pass 1 should be done`)
	assert(
		state.children_count === 0
			+ state.children_fs_reliability_count['unknown']
			+ state.children_fs_reliability_count['unreliable']
			+ state.children_fs_reliability_count['reliable'],
		`${LIB} _get_children_fs_reliability() mismatching counts`
	)

	if (state.children_fs_reliability_count['unreliable'] > 0)
		return 'unreliable'

	if (state.children_fs_reliability_count['reliable'] > 0)
		return 'reliable'

	return 'unknown'
}

export function get_event_begin_date(state: Immutable<State>): Immutable<BetterDate> {
	assert(state.type === Type.event || state.type === Type.overlapping_event, `${LIB} get_starting_date() should be an ~event`)
	assert(state.event_range.begin, `${LIB} get_starting_date() should have a start date`)

	return state.event_range.begin
}
export function get_event_end_date(state: Immutable<State>): Immutable<BetterDate> {
	assert(state.type === Type.event || state.type === Type.overlapping_event, `${LIB} get_event_end_date() should be an ~event`)
	assert(state.event_range.end, `${LIB} get_event_end_date() should have a end date`)

	return state.event_range.end
}

export function get_event_begin_year(state: Immutable<State>): number | undefined {
	return BetterDateLib.get_year(get_event_begin_date(state))
}

export function get_event_begin_date‿symd(state: Immutable<State>): SimpleYYYYMMDD {
	return BetterDateLib.get_compact_date(get_event_begin_date(state), 'tz:embedded')
}
export function get_event_end_date‿symd(state: Immutable<State>): SimpleYYYYMMDD {
	return BetterDateLib.get_compact_date(get_event_end_date(state), 'tz:embedded')
}

export function get_ideal_basename(state: Immutable<State>): Basename {
	const current_basename = get_basename(state)

	if (state.type !== Type.event)
		return NORMALIZERS.trim(NORMALIZERS.normalize_unicode(current_basename))

	assert(state.event_range.begin, 'get_ideal_basename() event range should have a start')

	let meaningful_part = get_current_basename‿parsed(state).meaningful_part
	if (is_digit(meaningful_part[0])) {
		// protection to prevent future executions to parse the meaningful part as DD/HH/MM/SS
		meaningful_part = DIGIT_PROTECTION_SEPARATOR + meaningful_part
	}

	return NORMALIZERS.trim(
		NORMALIZERS.normalize_unicode(
			String(get_compact_date(state.event_range.begin, 'tz:embedded'))
			+ ' - '
			+ meaningful_part
		)
	)
}

// TODO memoize
export function get_event_start_from_basename(state: Immutable<State>): null | Immutable<BetterDate> {
	const current_basename = get_basename(state)

	if (current_basename.length < 12) {
		// must be big enough, just a year won't do
		return null
	}

	const parsed = get_current_basename‿parsed(state)
	if (!parsed.date)
		return null

	// TODO review: should we return null if range too big?

	// a dated folder can indicate either
	// - the date of an event = date of the beginning of the file range
	// - the date of a backup = date of the END of the file range

	// attempt to cross check with the children date range
	assert(is_pass_1_done(state), `get_event_start_from_basename() at least pass 1 should be complete`)
	const { begin, end } = (() => {
		if (state.children_date_ranges.from_primary_final.begin && is_pass_2_done(state)) {
			return state.children_date_ranges.from_primary_final
		}

		return state.children_date_ranges.from_primary_current
	})()
	if (!!begin && !!end) {
		const date__from_basename‿symd = BetterDateLib.get_compact_date(parsed.date, 'tz:embedded')

		// TODO use the best available data?
		const date_range_begin‿symd = BetterDateLib.get_compact_date(begin, 'tz:embedded')
		const date_range_end‿symd = BetterDateLib.get_compact_date(end, 'tz:embedded')

		if (date__from_basename‿symd <= date_range_begin‿symd) {
			// clearly a beginning date
			return parsed.date
		}
		else if (date__from_basename‿symd >= date_range_end‿symd) {
			// clearly a backup date
			return null
		}
		else {
			// strange situation, let's investigate...
			throw new Error('get_event_start_from_basename() NIMP1')
		}
	}

	if (is_processed_event_folder_basename(current_basename)) {
		// this looks very very much like an event
		// TODO check parent is year as well?
		return parsed.date
	}

	if (parsed.meaningful_part.toLowerCase().includes('backup')) {
		// clear message
		return null
	}

	// can't really tell...
	console.error({
		current_basename,
		ip: is_processed_event_folder_basename(current_basename),
		pmp: parsed.meaningful_part,
	})
	throw new Error('get_event_start_from_basename() NIMP2')
}

export function is_current_basename_intentful_of_event_start(state: Immutable<State>): boolean {
	return get_event_start_from_basename(state) !== null
}

export function get_neighbor_primary_hints(state: Immutable<State>): Immutable<NeighborHints> {
	assert(is_pass_1_done(state), `get_neighbor_primary_hints() pass 1 should be complete`)

	return {
		parent_folder_bcd: get_event_start_from_basename(state),
		fs_bcd_assessed_reliability: _get_children_fs_reliability(state),
	}
}

export function is_matching_event‿symd(state: Immutable<State>, date_symd: SimpleYYYYMMDD): boolean {
	assert(state.type === Type.event, `${LIB} is_matching_event‿symd() should be an event`)

	const begin_date‿symd = get_event_begin_date‿symd(state)
	const end_date‿symd = get_event_end_date‿symd(state)

	return date_symd >= begin_date‿symd && date_symd <= end_date‿symd
}

///////////////////// REDUCERS /////////////////////

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

		children_date_ranges: {

			from_fs_current: {
				begin: undefined,
				end: undefined,
			},

			from_primary_current: {
				begin: undefined,
				end: undefined,
			},

			from_primary_final: {
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
	const fs_bcd_reliability = File.get_current_fs_date_reliability_according_to_other_trustable_current_primary_date_sources(file_state)

	const fs_reliability = File.get_current_fs_date_reliability_according_to_other_trustable_current_primary_date_sources(file_state)
	if (fs_reliability === 'unreliable') {
		logger.warn(`⚠️ File "${file_state.id}" fs reliability has been estimated as UNRELIABLE`)
	}

	const key: keyof State['children_fs_reliability_count'] = String(fs_bcd_reliability) as any
	state = {
		...state,
		children_fs_reliability_count: {
			...state.children_fs_reliability_count,
			[key]: state.children_fs_reliability_count[key] + 1,
		},
	}

	//////////// consolidate: date range -- fs current
	const file_bcd__from_fs_current = File.get_creation_date__from_fs_stats__current‿tms(file_state)

	const new_children_begin_date__fs_current = state.children_date_ranges.from_fs_current.begin
		? Math.min(state.children_date_ranges.from_fs_current.begin, file_bcd__from_fs_current)
		: file_bcd__from_fs_current
	const new_children_end_date__fs_current = state.children_date_ranges.from_fs_current.end
		? Math.max(state.children_date_ranges.from_fs_current.end, file_bcd__from_fs_current)
		: file_bcd__from_fs_current

	if (new_children_begin_date__fs_current === state.children_date_ranges.from_fs_current.begin
		&& new_children_end_date__fs_current === state.children_date_ranges.from_fs_current.end) {
		// no change
	} else {
		logger.verbose(
			`${ LIB } updating folder’s children's "fs current" date range`,
			{
				id: state.id,
				file_bcd__from_fs_current,
				new_children_begin_date__fs_current,
				new_children_end_date__fs_current,
			}
		)

		state = {
			...state,

			children_date_ranges: {
				...state.children_date_ranges,
				from_fs_current: {
					begin: new_children_begin_date__fs_current,
					end: new_children_end_date__fs_current,
				},
			}
		}
	}

	//////////// consolidate: date range -- primary current
	const file_meta_bcd__from_primary_current = File.get_best_creation_date_meta__from_current_data(file_state)
	if (file_meta_bcd__from_primary_current.confidence !== 'primary') {
		// low confidence = don't act on that
	}
	else {
		const file_bcd__from_primary_current = file_meta_bcd__from_primary_current.candidate

		const new_children_begin_date__primary_current = state.children_date_ranges.from_primary_current.begin
			? BetterDateLib.min(state.children_date_ranges.from_primary_current.begin, file_bcd__from_primary_current)
			: file_bcd__from_primary_current
		const new_children_end_date__primary_current = state.children_date_ranges.from_primary_current.end
			? BetterDateLib.max(state.children_date_ranges.from_primary_current.end, file_bcd__from_primary_current)
			: file_bcd__from_primary_current

		if (BetterDateLib.is_deep_equal(new_children_begin_date__primary_current, state.children_date_ranges.from_primary_current.begin)
			&& BetterDateLib.is_deep_equal(new_children_end_date__primary_current, state.children_date_ranges.from_primary_current.end)) {
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

				children_date_ranges: {
					...state.children_date_ranges,
					from_primary_current: {
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

	if (is_pass_1_done(state)) {
		// auto-init
		const event_begin_from_folder_basename = get_event_start_from_basename(state)
		if (event_begin_from_folder_basename) {
			state = {
				...state,
				event_range: {
					begin: event_begin_from_folder_basename,
					end: event_begin_from_folder_basename,
				}
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
	const file_meta_bcd = File.get_best_creation_date_meta(file_state)
	if (file_meta_bcd.confidence !== 'primary') {
		// low confidence = don't act on that
	}
	else {
		const file_bcd__primary_final = file_meta_bcd.candidate

		const new_children_begin_date__primary_final = state.children_date_ranges.from_primary_final.begin
			? BetterDateLib.min(state.children_date_ranges.from_primary_final.begin, file_bcd__primary_final)
			: file_bcd__primary_final
		const new_children_end_date__primary_final = state.children_date_ranges.from_primary_final.end
			? BetterDateLib.max(state.children_date_ranges.from_primary_final.end, file_bcd__primary_final)
			: file_bcd__primary_final

		if (BetterDateLib.is_deep_equal(new_children_begin_date__primary_final, state.children_date_ranges.from_primary_final.begin)
			&& BetterDateLib.is_deep_equal(new_children_end_date__primary_final, state.children_date_ranges.from_primary_final.end)) {
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
				children_date_ranges: {
					...state.children_date_ranges,
					from_primary_final: {
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
			const event_begin_from_folder_basename = get_event_start_from_basename(state)

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

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { id, type } = state

	let str = `📓  [${String(type).padStart('cant_recognize'.length)}]`
	switch(type) {
		case Type.inbox:
		case Type.cant_autosort:
		case Type.cant_recognize:
			str = stylize_string.blue(str)
			break
		case Type.year:
			str = stylize_string.yellow(str)
			break
		case Type.event:
			str = stylize_string.green(str)
			break
		default:
			str = stylize_string.red(str)
			break
	}

	str += stylize_string.yellow.bold(` "${id}"`)

	if (type === Type.event || type === Type.overlapping_event) {
		const { begin: event_begin_date, end: event_end_date } = state.event_range
		str += ` 📅 ${BetterDateLib.get_human_readable_timestamp_days(event_begin_date!, 'tz:embedded')} → ${BetterDateLib.get_human_readable_timestamp_days(event_end_date!, 'tz:embedded')}`
	}
	else if (state.reason_for_demotion_from_event) {
		str += ` (demoted due to: ${state.reason_for_demotion_from_event})`
	}

	return str
}
