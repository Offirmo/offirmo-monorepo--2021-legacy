import path from 'path'
import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { DIGIT_PROTECTION_SEPARATOR } from '../../consts'
import { Basename, RelativePath, SimpleYYYYMMDD } from '../../types'
import { is_year, is_digit } from '../../services/matchers'
import { parse_folder_basename, ParseResult, pathㆍparse_memoized, is_folder_basename__matching_a_processed_event_format } from '../../services/name_parser'
import * as BetterDateLib from '../../services/better-date'
import { BetterDate, get_compact_date } from '../../services/better-date'
import { FsReliability, NeighborHints } from '../file'

import {
	LIB,
	SPECIAL_FOLDER__INBOX__BASENAME,
	SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME,
	SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME,
} from './consts'
import {
	FolderId,
	Type,
	State,
} from './types'

////////////////////////////////////

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

export function is_data_gathering_pass_1_done(state: Immutable<State>): boolean {
	return state.children_pass_1_count === state.children_count
}
export function is_data_gathering_pass_2_done(state: Immutable<State>): boolean {
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
export function get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state: Immutable<State>): null | Immutable<BetterDate> {
	const current_basename = get_basename(state)

	if (current_basename.length < 12) {
		// must be big enough, just a year won't do
		return null
	}

	const parsed = get_current_basename‿parsed(state)
	if (!parsed.date)
		return null

	// TODO review: should we return null if range too big?

	// reminder: a dated folder can indicate either
	// - the date of an EVENT = date of the beginning of the file range
	// - the date of a BACKUP = date of the END of the file range
	// we need extra info to discriminate between the two options

	// try to cross-reference with the children date range = best source of info
	const { begin, end } = (() => {
		assert(is_data_gathering_pass_1_done(state), `get_event_start_from_basename() at least pass 1 should be complete`)

		if (is_data_gathering_pass_2_done(state) && state.children_bcd_ranges.from_primary_final.begin) {
			return state.children_bcd_ranges.from_primary_final
		}

		return state.children_bcd_ranges.from_primary_current
	})()
	if (!!begin && !!end) {
		// we have a range, let's cross-reference…
		const date__from_basename‿symd = BetterDateLib.get_compact_date(parsed.date, 'tz:embedded')

		// TODO use the best available data?
		const date_range_begin‿symd = BetterDateLib.get_compact_date(begin, 'tz:embedded')
		const date_range_end‿symd = BetterDateLib.get_compact_date(end, 'tz:embedded')

		if (date__from_basename‿symd <= date_range_begin‿symd) {
			// clearly a beginning date
			return parsed.date
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
	if (parsed.meaningful_part.toLowerCase().includes('backup')) {
		// clearly not an event
		return null
	}

	if (is_folder_basename__matching_a_processed_event_format(current_basename)) {
		// this looks very very much like an event
		// TODO check parent is year as well?
		return parsed.date
	}

	// can't really tell...
	console.error({
		current_basename,
		ip: is_folder_basename__matching_a_processed_event_format(current_basename),
		pmp: parsed.meaningful_part,
	})
	throw new Error('get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources() NIMP2')
}

export function is_current_basename_intentful_of_event_start(state: Immutable<State>): boolean {
	return get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state) !== null
}

export function get_neighbor_primary_hints(state: Immutable<State>): Immutable<NeighborHints> {
	assert(is_data_gathering_pass_1_done(state), `get_neighbor_primary_hints() pass 1 should be complete`)

	return {
		parent_folder_bcd: get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state),
		fs_bcd_assessed_reliability: _get_children_fs_reliability(state),
	}
}

export function is_matching_event‿symd(state: Immutable<State>, date_symd: SimpleYYYYMMDD): boolean {
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
		const { begin: event_begin_date, end: event_end_date } = state.event_range
		str += ` 📅 ${BetterDateLib.get_human_readable_timestamp_days(event_begin_date!, 'tz:embedded')} → ${BetterDateLib.get_human_readable_timestamp_days(event_end_date!, 'tz:embedded')}`
	}
	else if (state.reason_for_demotion_from_event) {
		str += ` (demoted due to: ${state.reason_for_demotion_from_event})`
	}

	return str
}
