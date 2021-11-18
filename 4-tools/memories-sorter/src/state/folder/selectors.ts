import path from 'path'
import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { DIGIT_PROTECTION_SEPARATOR } from '../../consts'
import { Basename, RelativePath, SimpleYYYYMMDD } from '../../types'
import logger from '../../services/logger'
import { is_digit } from '../../services/matchers'
import { parse_folder_basename, ParseResult, pathㆍparse_memoized, is_folder_basename__matching_a_processed_event_format } from '../../services/name_parser'
import * as BetterDateLib from '../../services/better-date'
import {
	BetterDate,
	create_better_date_from_utc_tms,
	DateRange,
	get_compact_date,
	get_debug_representation,
} from '../../services/better-date'
import { FsReliability, NeighborHints } from '../file'
import * as FileLib from '../file'

import {
	LIB,
} from './consts'
import {
	Type,
	State,
} from './types'
import { get_params, Params } from '../../params'

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

export function is_data_gathering_pass_1_done(state: Immutable<State>): boolean {
	return state.children_pass_1_count === state.children_count
}
export function has_data_gathering_pass_2_started(state: Immutable<State>): boolean {
	return state.children_pass_2_count > 0
}
export function is_data_gathering_pass_2_done(state: Immutable<State>): boolean {
	return state.children_pass_2_count === state.children_count
}

function _get_children_fs_reliability(state: Immutable<State>): FsReliability {
	assert(is_data_gathering_pass_1_done(state), `${LIB} _get_children_fs_reliability() pass 1 should be done`)
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

export function _get_current_best_children_range(state: Immutable<State>): undefined | null | Immutable<DateRange> {
	assert(is_data_gathering_pass_1_done(state), `_get_current_best_children_range() at least pass 1 should be complete`)

	if (is_data_gathering_pass_2_done(state) && state.children_bcd_ranges.from_primaryⵧfinal) {
		return state.children_bcd_ranges.from_primaryⵧfinal
	}

	return state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1 ?? (
		state.children_bcd_ranges.from_fsⵧcurrent
			? {
				begin: create_better_date_from_utc_tms(state.children_bcd_ranges.from_fsⵧcurrent.begin, 'tz:auto'),
				end: create_better_date_from_utc_tms(state.children_bcd_ranges.from_fsⵧcurrent.end, 'tz:auto'),
			}
			: state.children_bcd_ranges.from_fsⵧcurrent // as undef or null
	)
}

export function get_event_range(state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): DateRange | null | undefined {
	if (state.type !== Type.event && state.type !== Type.overlapping_event)
		return null

	if (!!state.forced_event_range)
		return state.forced_event_range

	if (is_looking_like_a_backup(state))
		return null

	const event_beginⵧfrom_folder_basename = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)

	const children_range = _get_current_best_children_range(state)

	const event_begin_date = event_beginⵧfrom_folder_basename // always have priority if present
		?? children_range?.begin

	if (!event_begin_date) {
		// TODO review
		return (event_beginⵧfrom_folder_basename === null || children_range === null)
			? null
			: undefined
	}

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
		logger.info(
			`${LIB} folder: date range too big but basename is intentful: event end date will be capped at +${PARAMS.max_event_durationⳇₓday}d`, {
				id: state.id,
				new_event_begin_date: BetterDateLib.get_debug_representation(event_begin_date),
				new_event_end_date: BetterDateLib.get_debug_representation(event_end_date),
				capped_end_date: BetterDateLib.get_debug_representation(capped_end_date),
			})
	}

	event_end_date = BetterDateLib.min(event_end_date, capped_end_date)

	return {
			begin: event_begin_date,
			end: event_end_date,
		}
}
export function get_event_begin_date(state: Immutable<State>): Immutable<BetterDate> {
	assert(state.type === Type.event || state.type === Type.overlapping_event, `${LIB} get_event_begin_date() should be an ~event`)
	const range = get_event_range(state)
	assert(range, `${LIB} get_event_begin_date() should have a date range!`)

	return range.begin
}
export function get_event_end_date(state: Immutable<State>): Immutable<BetterDate> {
	assert(state.type === Type.event || state.type === Type.overlapping_event, `${LIB} get_event_end_date() should be an ~event`)
	const range = get_event_range(state)
	assert(range, `${LIB} get_event_end_date() should have a date range!`)

	return range.end
}

export function get_event_begin_date‿symd(state: Immutable<State>): SimpleYYYYMMDD {
	return BetterDateLib.get_compact_date(get_event_begin_date(state), 'tz:embedded')
}
export function get_event_end_date‿symd(state: Immutable<State>): SimpleYYYYMMDD {
	return BetterDateLib.get_compact_date(get_event_end_date(state), 'tz:embedded')
}

export function get_event_begin_year(state: Immutable<State>): number | undefined {
	return BetterDateLib.get_year(get_event_begin_date(state))
}

export function get_ideal_basename(state: Immutable<State>): Basename {
	const current_basename = get_current_basename(state)

	if (state.type !== Type.event)
		return NORMALIZERS.trim(NORMALIZERS.normalize_unicode(current_basename))

	assert(get_event_begin_date(state), 'get_ideal_basename() event range should have a start')

	let meaningful_part = get_current_basename‿parsed(state).meaningful_part
	if (is_digit(meaningful_part[0])) {
		// protection to prevent future executions to parse the meaningful part as DD/HH/MM/SS
		meaningful_part = DIGIT_PROTECTION_SEPARATOR + meaningful_part
	}

	return NORMALIZERS.trim(
		NORMALIZERS.normalize_unicode(
			String(get_compact_date(get_event_begin_date(state), 'tz:embedded'))
			+ ' - '
			+ meaningful_part
		)
	)
}


export function _is_basename_hinting_at_backup(state: Immutable<State>): boolean {
	const current_basename = get_current_basename(state)
	const basename‿parsed = get_current_basename‿parsed(state)
	const lc = basename‿parsed.meaningful_part.toLowerCase()
	return lc.includes('backup')
		|| lc.includes('save')
		|| lc.includes('import')
		|| lc.includes('sauvegarde')
}

// TODO review + memoize
// Note: this is logically and semantically different from get_expected_bcd_range_from_parent_path()
export function get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state: Immutable<State>): null | Immutable<BetterDate> {
	const current_basename = get_current_basename(state)
	const basename‿parsed = get_current_basename‿parsed(state)

	if ((basename‿parsed.date_digits?.length ?? 0) < 6) {
		// must be big enough, need precision up to month
		return null
	}

	if (!basename‿parsed.date)
		return null

	// reminder: a dated folder can indicate
	// - the date of an EVENT = date of the beginning of the file range
	// - the date of a BACKUP = date of the END of the file range
	// - anything TBH ;)
	// we need extra info to discriminate between those cases

	// try to cross-reference with the children date range = best source of info
	const { begin, end } = _get_current_best_children_range(state) || {}
	/*console.log('DEBUG', {
		begin: get_debug_representation(begin),
		end: get_debug_representation(end),
		state,
	})*/
	if (!!begin && !!end) {
		// we have a range, let's cross-reference…
		const date__from_basename‿symd = BetterDateLib.get_compact_date(basename‿parsed.date, 'tz:embedded')

		// TODO use the best available data?
		const date_range_begin‿symd = BetterDateLib.get_compact_date(begin, 'tz:embedded')
		const date_range_end‿symd = BetterDateLib.get_compact_date(end, 'tz:embedded')
		/*console.log('DEBUG', {
			begin: date_range_begin‿symd, //get_debug_representation(begin),
			end: date_range_end‿symd, //get_debug_representation(end),
			date__from_basename‿symd,
		})*/

		if (date__from_basename‿symd <= date_range_begin‿symd) {
			// clearly a beginning date
			return basename‿parsed.date
		}
		else if (date__from_basename‿symd >= date_range_end‿symd) {
			// clearly a backup date, ignore it
			return null
		}
		else {
			// folder's date is between the children range (not included)
			// this looks unreliable...
			return null
		}
	}

	// we have no range, let's try something else…
	if (_is_basename_hinting_at_backup(state)) {
		// clearly not an event
		return null
	}

	if (is_folder_basename__matching_a_processed_event_format(current_basename)) {
		// this looks very very much like an event
		return basename‿parsed.date
	}

	// can't really tell... (the folder must be empty OR contains a mix of older and newer files)
	// let's assume it's a start date
	return basename‿parsed.date
}

export function is_current_basename_intentful_of_event_start(state: Immutable<State>): boolean {
	return get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state) !== null
}

export function is_looking_like_a_backup(state: Immutable<State>): boolean {
	const basename‿parsed = get_current_basename‿parsed(state)

	const is_basename_hinting_at_backup = ((): boolean => {
		const lc = basename‿parsed.meaningful_part.toLowerCase()
		return lc.includes('backup')
			|| lc.includes('save')
			|| lc.includes('import')
			|| lc.includes('sauvegarde')
	})()

	// if a date is present in the basename, try to cross-reference with the children date range = best source of info
	if (basename‿parsed.date) {
		const children_date_range = _get_current_best_children_range(state)
		/*console.log('DEBUG', {
			begin: get_debug_representation(begin),
			end: get_debug_representation(end),
			state,
		})*/
		if (children_date_range) {
			// we have a range, let's cross-reference…
			const date__from_basename‿symd = BetterDateLib.get_compact_date(basename‿parsed.date, 'tz:embedded')

			// TODO use the best available data?
			const date_range_begin‿symd = BetterDateLib.get_compact_date(children_date_range.begin, 'tz:embedded')
			const date_range_end‿symd = BetterDateLib.get_compact_date(children_date_range.end, 'tz:embedded')
			/*console.log('DEBUG', {
				begin: date_range_begin‿symd, //get_debug_representation(begin),
				end: date_range_end‿symd, //get_debug_representation(end),
				date__from_basename‿symd,
			})*/

			if (date__from_basename‿symd <= date_range_begin‿symd) {
				// clearly a beginning date, this is an event
				return false
			}
			else if (date__from_basename‿symd >= date_range_end‿symd) {
				// clearly a backup date
				return true
			}
			else {
				// fallthrough
			}
		}
	}

	// we have no clear cross referencing
	return is_basename_hinting_at_backup
}

export function get_neighbor_primary_hints(state: Immutable<State>): Immutable<NeighborHints> {
	assert(is_data_gathering_pass_1_done(state), `get_neighbor_primary_hints() pass 1 should be complete`)

	let hints = FileLib.NeighborHintsLib.create()

	throw new Error('NIMP get_neighbor_primary_hints!')

/*	return {
		// TODO parent_folder_bcd: get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state),
		fs_bcd_assessed_reliability: _get_children_fs_reliability(state),
	}*/
}

export function is_date_matching_this_event‿symd(state: Immutable<State>, date_symd: SimpleYYYYMMDD): boolean {
	assert(state.type === Type.event, `${LIB} is_matching_event‿symd() should be an event`)

	const begin_date‿symd = get_event_begin_date‿symd(state)
	const end_date‿symd = get_event_end_date‿symd(state)

	return date_symd >= begin_date‿symd && date_symd <= end_date‿symd
}

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
		const { begin: event_begin_date, end: event_end_date } = get_event_range(state) || {}
		str += ` 📅 ${BetterDateLib.get_human_readable_timestamp_days(event_begin_date!, 'tz:embedded')} → ${BetterDateLib.get_human_readable_timestamp_days(event_end_date!, 'tz:embedded')}`
	}
	else if (state.reason_for_demotion_from_event) {
		str += ` (demoted due to: ${state.reason_for_demotion_from_event})`
	}

	return str
}
