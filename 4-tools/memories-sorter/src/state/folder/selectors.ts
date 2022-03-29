import path from 'path'
import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'
import micro_memoize from 'micro-memoize'

import { DIGIT_PROTECTION_SEPARATOR } from '../../consts'
import { Basename, RelativePath, SimpleYYYYMMDD, TimeZone } from '../../types'
import logger from '../../services/logger'
import { is_digit } from '../../services/matchers'
import {
	parse_folder_basename,
	ParseResult,
	pathㆍparse_memoized,
	is_folder_basename__matching_a_processed_event_format,
} from '../../services/name_parser'
import * as BetterDateLib from '../../services/better-date'
import { BetterDate, compare_utc, DateRange } from '../../services/better-date'
import { FsReliability, NeighborHints } from '../file'
import * as FileLib from '../file'

import {
	LIB,
} from './consts'
import {
	Type,
	State,
} from './types'
import { get_default_timezone, get_params, Params } from '../../params'

////////////////////////////////////

export const ERROR__RANGE_TOO_BIG = `Folder: range is too big!`

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

export function get_current_basename‿parsed(state: Immutable<State>): Immutable<ParseResult> {
	return parse_folder_basename(get_current_basename(state))
}

export function get_depth(data: Immutable<State> | Immutable<path.ParsedPath>): number {
	const pathㆍparsed = (data as any).base
		? (data as Immutable<path.ParsedPath>)
		: get_current_path‿pparsed(data as Immutable<State>)

	return pathㆍparsed.dir
		? pathㆍparsed.dir.split(path.sep).length
		: 0
}

export function is_pass_1_data_available_for_all_children(state: Immutable<State>): boolean {
	//assert(state.media_children_pass_1_count === state.media_children_count, `is_data_gathering_pass_1_done() child# should equal p1#`)
	return state.media_children_pass_1_count === state.media_children_count
}
export function is_pass_2_data_available_for_all_children(state: Immutable<State>): boolean {
	//assert(state.media_children_pass_2_count === state.media_children_count, `is_data_gathering_pass_2_done() should p2# should equal child#`)
	return state.media_children_pass_2_count === state.media_children_count
}

function _get_children_fs_reliability(state: Immutable<State>): FsReliability {
	assert(is_pass_1_data_available_for_all_children(state), `${LIB} _get_children_fs_reliability() pass 1 should be fully done`)
	assert(
		state.media_children_count === 0
			+ state.media_children_fs_reliability_count['unknown']
			+ state.media_children_fs_reliability_count['unreliable']
			+ state.media_children_fs_reliability_count['reliable'],
		`${LIB} _get_children_fs_reliability() mismatching counts`
	)

	if (state.media_children_fs_reliability_count['unreliable'] > 0)
		return 'unreliable'

	if (state.media_children_fs_reliability_count['reliable'] > 0)
		return 'reliable'

	return 'unknown'
}

export function _get_current_best_children_range(state: Immutable<State>): undefined | Immutable<DateRange> {
	assert(is_pass_1_data_available_for_all_children(state), `_get_current_best_children_range() at least pass 1 should be complete`)

	if (is_pass_2_data_available_for_all_children(state) && state.media_children_bcd_ranges.from_primaryⵧfinal) {
		return state.media_children_bcd_ranges.from_primaryⵧfinal
	}

	if (is_pass_1_data_available_for_all_children(state) && state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1) {
		return state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1
	}

	if (state.media_children_bcd_ranges.from_fsⵧcurrent) {
		// this range is suspicious, let's check it
		const is_fs_valuable = _get_children_fs_reliability(state) !== 'unreliable'
		if (is_fs_valuable) {
			return {
				begin: BetterDateLib.create_better_date_from_utc_tms(state.media_children_bcd_ranges.from_fsⵧcurrent.begin, get_tz(state, 'fallback:none') || 'tz:auto'),
				end: BetterDateLib.create_better_date_from_utc_tms(state.media_children_bcd_ranges.from_fsⵧcurrent.end, get_tz(state, 'fallback:none') || 'tz:auto'),
			}
		}
	}

	return undefined
}

export const get_event_range = micro_memoize(function _get_event_range(state: Immutable<State>, ): DateRange | null | undefined {
	if (state.type !== Type.event && state.type !== Type.overlapping_event)
		return null

	if (state.forced_event_range) {
		return state.forced_event_range
	}

	assert(is_pass_1_data_available_for_all_children(state), `get_event_range() should not be called too early for fear of incomplete results! ("${state.id}")`)

	if (is_looking_like_a_backup(state))
		return null

	const event_beginⵧfrom_folder_basename = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)

	const children_range = _get_current_best_children_range(state)

	let event_begin_date = event_beginⵧfrom_folder_basename // always have priority if present
		?? children_range?.begin

	if (!event_begin_date) {
		// refine the return value (TODO review)
		return (event_beginⵧfrom_folder_basename === null || children_range === null)
			? null
			: undefined
	}

	// TODO REVIEW (done elsewhere, needed here?)
	/*if (!event_beginⵧfrom_folder_basename) {
		if (get_day_of_week_index(event_begin_date) === 0) {
			// sunday is coalesced to sat = start of weekend
			event_begin_date = add_days(event_begin_date, -1)
		}
	}*/

	const PARAMS = get_params()
	const capped_end_date = BetterDateLib.add_days(event_begin_date, PARAMS.max_event_durationⳇₓday)

	let event_end_date = children_range?.end ?? capped_end_date // for now

	const is_range_too_big = BetterDateLib.compare_utc(event_end_date, capped_end_date) > 0

	if (is_range_too_big && !is_current_basename_intentful_of_event_start(state)) {
		logger.info(
			`${LIB} folder: date range too big, most likely not an event, should demote...`, {
				id: state.id,
				tentative_event_begin_date: BetterDateLib.get_debug_representation(event_begin_date),
				tentative_event_end_date: BetterDateLib.get_debug_representation(event_end_date),
			})
		throw new Error(ERROR__RANGE_TOO_BIG) // should be caught by caller
	}

	if (is_range_too_big) {
		logger.debug(
			`${LIB} folder: date range too big but basename is intentful: event end date will be capped at +${PARAMS.max_event_durationⳇₓday}d`, {
				id: state.id,
				new_event_begin_date: BetterDateLib.get_debug_representation(event_begin_date),
				new_event_end_date: BetterDateLib.get_debug_representation(event_end_date),
				new_event_end_date__capped: BetterDateLib.get_debug_representation(capped_end_date),
			})
	}

	event_end_date = BetterDateLib.min(event_end_date, capped_end_date)

	return {
			begin: event_begin_date,
			end: event_end_date,
		}
})

export function get_event_begin_date(state: Immutable<State>): Immutable<BetterDate> {
	assert(state.type === Type.event || state.type === Type.overlapping_event, `${LIB} get_event_begin_date() should be called on an ~event`)
	const range = get_event_range(state)
	assert(range, `${LIB} get_event_begin_date([event]"${state.id}") should have a date range!`)

	return range.begin
}
export function get_event_end_date(state: Immutable<State>): Immutable<BetterDate> {
	assert(state.type === Type.event || state.type === Type.overlapping_event, `${LIB} get_event_end_date() should be called on an ~event`)
	const range = get_event_range(state)
	assert(range, `${LIB} get_event_end_date() should have a date range!`)

	return range.end
}

// get the best folder tz we know
// can be called at any time, should not cause infinite loops.
// Because a tz can't always be computed, fallback instructions should be provided
export function get_tz(state: Immutable<State>, fallback: 'fallback:none' | 'fallback:resolved_auto', date_for_auto?: Immutable<BetterDate>): TimeZone | undefined {
	const tz = state.media_children_aggregated_tz
	assert(tz !== 'tz:embedded', `aggregated tz should never = tz:embedded!`)
	if (tz && tz !== 'tz:auto')
		return tz

	assert(tz === undefined || tz === 'tz:auto', `get_intermediate_tz() expecting undef/auto here! "${tz}"`)

	switch (fallback) {
		case 'fallback:none':
			return undefined

		case 'fallback:resolved_auto': {
			if (!date_for_auto) {
				assert(is_pass_1_data_available_for_all_children(state), `get_intermediate_tz('fallback:resolved_auto') pass 1 should be done!`)
				date_for_auto = get_event_begin_date(state)
			}

			return get_default_timezone(BetterDateLib.get_timestamp_utc_ms_from(date_for_auto))
		}

		default:
			throw new Error(`get_intermediate_tz() unknown fallback "${fallback}"!`)
	}
}


export function get_event_begin_date‿symd(state: Immutable<State>): SimpleYYYYMMDD {
	return BetterDateLib.get_compact_date(get_event_begin_date(state), get_tz(state, 'fallback:resolved_auto')!)
}
export function get_event_end_date‿symd(state: Immutable<State>): SimpleYYYYMMDD {
	return BetterDateLib.get_compact_date(get_event_end_date(state), get_tz(state, 'fallback:resolved_auto')!)
}

export function get_event_begin_year(state: Immutable<State>): number | undefined {
	return BetterDateLib.get_year(get_event_begin_date(state), get_tz(state, 'fallback:resolved_auto')!)
}

export function get_ideal_basename(state: Immutable<State>): Basename {
	const current_basename = get_current_basename(state)

	if (state.type !== Type.event)
		return NORMALIZERS.trim(NORMALIZERS.normalize_unicode(current_basename))

	assert(get_event_begin_date(state), 'get_ideal_basename() event range should have a start')

	logger.trace(`${LIB}: get_ideal_basename(…)`, get_current_basename‿parsed(state))

	let meaningful_part = get_current_basename‿parsed(state).meaningful_part
	if (is_digit(meaningful_part[0])) {
		// protection to prevent future executions to parse the meaningful part as DD/HH/MM/SS
		meaningful_part = DIGIT_PROTECTION_SEPARATOR + meaningful_part
	}

	return NORMALIZERS.trim(
		NORMALIZERS.normalize_unicode(
			String(BetterDateLib.get_compact_date(get_event_begin_date(state), get_tz(state, 'fallback:resolved_auto')!))
			+ ' - '
			+ meaningful_part
		)
	)
}

export function _is_basename_hinting_at_backup(state: Immutable<State>): boolean {
	const basename‿parsed = get_current_basename‿parsed(state)
	const lc = basename‿parsed.meaningful_part.toLowerCase()
	return lc.includes('backup')
		|| lc.includes('save')
		|| lc.includes('import')
		|| lc.includes('sauvegarde')
}

function _get_event_begin_from_basename_if_present(state: Immutable<State>): undefined | null | Immutable<BetterDate> {
	const basename‿parsed = get_current_basename‿parsed(state)

	if ((basename‿parsed.date_digits?.length ?? 0) < 6) {
		// must be big enough, need precision up to month
		return null
	}

	if (!basename‿parsed.date)
		return basename‿parsed.date

	// the basename has no tz info. the parser uses "auto" but we should switch to "folder tz" without changing the members
	const folder_tz = get_tz(state, 'fallback:none')
	if (folder_tz) {
		return BetterDateLib.reinterpret_with_different_tz(basename‿parsed.date, folder_tz)
	}

	return basename‿parsed.date
}

// Note: this is logically and semantically different from get_expected_bcd_range_from_parent_path()
// Note: even if the basename contains a date, this function will only return it if it looks like an EVENT
export function get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state: Immutable<State>): null | Immutable<BetterDate> {
	const basename_date = _get_event_begin_from_basename_if_present(state)
	if (!basename_date)
		return null

	// reminder: a dated folder can indicate
	// - the date of an EVENT = date of the BEGINNING of the file range
	// - the date of a BACKUP = date of the END of the file range
	// - anything TBH ;)
	// we need extra info to discriminate between those cases

	// try to cross-reference with the children date range = best source of info
	const children_range = _get_current_best_children_range(state)
	/*console.log('get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources() DEBUG', {
		begin: BetterDateLib.get_debug_representation(children_range?.begin),
		end: BetterDateLib.get_debug_representation(children_range?.end),
		state,
	})*/
	if (children_range) {
		// we have a range, let's cross-reference…
		const date__from_basename‿symd = BetterDateLib.get_compact_date(basename_date, 'tz:embedded') // should always use tz:embedded for this one

		// TODO use the best available data?
		const tz = get_tz(state, 'fallback:none') || 'tz:auto'
		const date_range_begin‿symd = BetterDateLib.get_compact_date(children_range.begin, tz)
		const date_range_end‿symd = BetterDateLib.get_compact_date(children_range.end, tz)
		/*console.log('get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources() DEBUG', {
			begin: date_range_begin‿symd, //get_debug_representation(begin),
			end: date_range_end‿symd, //get_debug_representation(end),
			date__from_basename‿symd,
		})*/

		if (date__from_basename‿symd <= date_range_begin‿symd) {
			// clearly a beginning date
			return basename_date
		}
		else if (date__from_basename‿symd >= date_range_end‿symd) {
			// clearly a backup date, ignore it
			return null
		}
		else if ((date__from_basename‿symd - 1) <= date_range_begin‿symd) {
			// we allow 1 day margin to account for timezones errors
			// -> accepted as a beginning date
			return basename_date
		}
		else {
			// folder's date is between the children range (not included)
			// However we don't want to lose information
			// and a folder with a date surely means something
			return basename_date
		}
	}

	// we have no range, let's try something else…
	if (_is_basename_hinting_at_backup(state)) {
		// clearly not an event
		return null
	}

	if (is_folder_basename__matching_a_processed_event_format(get_current_basename(state))) {
		// this looks very very much like an event
		return basename_date
	}

	// can't really tell... (the folder must be empty OR contains a mix of older and newer files)
	// let's assume it's a start date
	return basename_date
}

export function is_current_basename_intentful_of_event_start(state: Immutable<State>): boolean {
	return get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state) !== null
}

// TODO improve, saw a lot of "slightly" mismatched event folders, ex. with only 1 intruder.
// We may want to be a little bit more tolerant OR salvage the folder name
export function is_looking_like_a_backup(state: Immutable<State>): boolean {
	const basename‿parsed = get_current_basename‿parsed(state)

	// if a date is present in the basename, try to cross-reference with the children date range = best source of info
	if (basename‿parsed.date) {
		const children_date_range = _get_current_best_children_range(state)
		/*console.log('is_looking_like_a_backup() DEBUG', {
			begin: BetterDateLib.get_debug_representation(children_date_range?.begin),
			end: BetterDateLib.get_debug_representation(children_date_range?.end),
			state,
		})*/
		if (children_date_range) {
			// we have a range, let's cross-reference…
			const date__from_basename‿symd = BetterDateLib.get_compact_date(basename‿parsed.date, 'tz:embedded') // should always use embedded tz here

			// TODO use the best available data?
			const children_range_begin‿symd = BetterDateLib.get_compact_date(children_date_range.begin, get_tz(state, 'fallback:resolved_auto', children_date_range.begin)!)
			const children_range_end‿symd = BetterDateLib.get_compact_date(children_date_range.end, get_tz(state, 'fallback:resolved_auto', children_date_range.begin)!)
			/*console.log('is_looking_like_a_backup() DEBUG', {
				begin: children_range_begin‿symd, //get_debug_representation(begin),
				end: children_range_end‿symd, //get_debug_representation(end),
				date__from_basename‿symd,
			})*/

			if (date__from_basename‿symd <= children_range_begin‿symd) {
				// clearly a beginning date, this doesn't look like a backup (more like an event)
				return false
			}
			else if (date__from_basename‿symd >= children_range_end‿symd) {
				// clearly a backup date
				return true
			}
			else {
				// fallthrough
			}
		}
	}

	// we have no clear cross-referencing
	return _is_basename_hinting_at_backup(state)
}

export function get_neighbor_primary_hints(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): Immutable<NeighborHints> {
	assert(is_pass_1_data_available_for_all_children(state), `get_neighbor_primary_hints() pass 1 should be complete`)

	let hints = FileLib.NeighborHintsLib.create()

	// NOTE this data is used to inform OTHER children. If there's only one, it's just echo!
	// EXCEPT when asserting unreliable which has other ways

	hints.bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1 = _get_children_fs_reliability(state)
	if (state.media_children_count === 1 && hints.bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1 !== 'unreliable') {
		hints.bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1 = 'unknown'
	}

	////// expected bcd ranges
	// from basename
	const basename_date = _get_event_begin_from_basename_if_present(state)
	if (basename_date) {
		if (is_looking_like_a_backup(state)) {
			hints.expected_bcd_ranges.push({
				begin: BetterDateLib.add_days(basename_date, -6*30),
				end: basename_date,
			})
		}
		else {
			hints.expected_bcd_ranges.push({
				begin: basename_date,
				end: BetterDateLib.add_days(basename_date, PARAMS.max_event_durationⳇₓday),
			})
		}
	}
	// from children
	const children_range_from_non_fs = state.media_children_bcd_ranges.from_primaryⵧfinal ?? state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1
	if (children_range_from_non_fs && state.media_children_count > 1) {
		// enlarge it by a percentage
		const begin_symd = BetterDateLib.get_compact_date(children_range_from_non_fs.begin, get_tz(state, 'fallback:resolved_auto', children_range_from_non_fs.begin)!)
		const end_symd = BetterDateLib.get_compact_date(children_range_from_non_fs.end, get_tz(state, 'fallback:resolved_auto', children_range_from_non_fs.begin)!)
		if (end_symd < begin_symd) {
			console.log('ERROR imminent', {
				id: state.id,
				state,
				ffc: BetterDateLib.get_range_debug_representation(state.media_children_bcd_ranges.from_fsⵧcurrent),
				fpcp1: BetterDateLib.get_range_debug_representation(state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1),
			})
		}
		const range_size‿ₓdays = BetterDateLib.get_elapsed_days_between_ordered_simple_dates(begin_symd, end_symd)
		const margin‿ₓdays = Math.ceil(Math.max(1, range_size‿ₓdays) * 0.2)
		hints.expected_bcd_ranges.push({
			begin: BetterDateLib.add_days(children_range_from_non_fs.begin, -margin‿ₓdays),
			end: BetterDateLib.add_days(children_range_from_non_fs.end, margin‿ₓdays),
		})
	}

	hints.fallback_junk_bcd = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
		?? _get_current_best_children_range(state)?.begin

	hints.tz = get_tz(state, 'fallback:none')

	return hints
}

export function is_date_matching_this_event(state: Immutable<State>, date: Immutable<BetterDate>): boolean {
	assert(state.type === Type.event, `${LIB} is_date_matching_this_event() should be an event`)

	const begin_date = get_event_begin_date(state)
	const end_date = get_event_end_date(state)

	return BetterDateLib.compare_utc(begin_date, date) <= 0
		&& BetterDateLib.compare_utc(date, end_date) <= 0
}

/*
export function is_date_matching_this_event‿symd(state: Immutable<State>, date‿symd: SimpleYYYYMMDD): boolean {
	assert(state.type === Type.event, `${LIB} is_matching_event‿symd() should be an event`)

	const begin_date‿symd = get_event_begin_date‿symd(state)
	const end_date‿symd = get_event_end_date‿symd(state)

	return date‿symd >= begin_date‿symd && date‿symd <= end_date‿symd
}
*/

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
		if (!is_pass_1_data_available_for_all_children(state)) { // TODO review
			str += ' (fs in progress)'
		}
		else {
			str += ` 📅 ${BetterDateLib.get_range_debug_representation(get_event_range(state))}`
		}
	}
	else if (state.reason_for_demotion_from_event) {
		str += ` (demoted due to: ${state.reason_for_demotion_from_event})`
	}

	return str
}
