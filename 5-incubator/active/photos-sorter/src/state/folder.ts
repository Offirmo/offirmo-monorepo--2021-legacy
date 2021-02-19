import path from 'path'
import { Enum } from 'typescript-string-enums'
import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { DIGIT_PROTECTION_SEPARATOR } from '../consts'
import { Basename, RelativePath, SimpleYYYYMMDD } from '../types'
import { get_params, Params } from '../params'
import { is_year, is_compact_date, is_digit } from '../services/matchers'
import { parse as parse_basename, ParseResult } from '../services/name_parser'
import logger from '../services/logger'
import { get_compact_date, add_days_to_simple_date } from '../services/better-date'
import * as File from './file'

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

	// range of the RELIABLE media files currently in this folder
	// TODO review, it's redundant
	// TODO review precision?
	children_begin_date_symd: undefined | SimpleYYYYMMDD
	children_end_date_symd: undefined | SimpleYYYYMMDD

	// if this folder is an event, what is the range assigned to it? (may be arbitrarily set)
	event_begin_date_symd: undefined | SimpleYYYYMMDD
	event_end_date_symd: undefined | SimpleYYYYMMDD

	children_count: number,
	children_fs_reliability_count: {
		'undefined': number,
		'true': number,
		'false': number,
	}

	cached: {
		pathㆍparsed: path.ParsedPath,
		nameㆍparsed: ParseResult,
	}
}

///////////////////// ACCESSORS /////////////////////

export function get_depth(data: Immutable<State> | Immutable<path.ParsedPath>): number {
	const pathㆍparsed = (data as any).base
		? (data as Immutable<path.ParsedPath>)
		: (data as Immutable<State>).cached.pathㆍparsed
	//console.log({data})
	//console.log({pathㆍparsed})
	return pathㆍparsed.dir
		? pathㆍparsed.dir.split(path.sep).length
		: 0
}

function _infer_initial_folder_type(id: FolderId, pathㆍparsed: path.ParsedPath): Type {
	assert(id, '_infer_initial_folder_type() id')

	if (id === '.') return Type.root

	const depth = get_depth(pathㆍparsed)

	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDER__INBOX__BASENAME) return Type.inbox
	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME) return Type.cant_autosort
	if (depth === 0 && pathㆍparsed.base === SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME) return Type.cant_recognize
	if (depth === 0 && is_year(pathㆍparsed.base)) return Type.year

	return Type.event // so far
}

function _infer_start_date(parsed: ParseResult): undefined | SimpleYYYYMMDD {
	return parsed.date
		? get_compact_date(parsed.date, 'tz:embedded')
		: undefined
}

export function get_basename(state: Immutable<State>): Basename {
	return state.cached.pathㆍparsed.base
}

export function get_event_begin_date(state: Immutable<State>): SimpleYYYYMMDD {
	assert(state.type === Type.event || state.type === Type.overlapping_event, `${LIB} get_starting_date() should be an ~event`)
	assert(state.event_begin_date_symd, `${LIB} get_starting_date() should have a start date`)

	return state.event_begin_date_symd
}

export function get_event_begin_year(state: Immutable<State>): number | undefined {
	assert(state.type === Type.event, `${LIB} get_starting_year() should be an event`)

	if (!state.event_begin_date_symd) return undefined

	return Math.trunc(state.event_begin_date_symd / 10000)
}

export function get_ideal_basename(state: Immutable<State>): Basename {
	const current_basename = get_basename(state)

	if (state.type !== Type.event)
		return NORMALIZERS.trim(NORMALIZERS.normalize_unicode(current_basename))

	assert(state.event_begin_date_symd, 'get_ideal_basename() (event) should have a start date')

	let meaningful_part = state.cached.nameㆍparsed.meaningful_part
	if (is_digit(meaningful_part[0])) {
		// protection to prevent future executions to parse the meaningful part as DD/HH/MM/SS
		meaningful_part = DIGIT_PROTECTION_SEPARATOR + meaningful_part
	}

	return NORMALIZERS.trim(
		NORMALIZERS.normalize_unicode(
			String(state.event_begin_date_symd + ' - ' + meaningful_part)
		)
	)
}

export function is_current_basename_intentful(state: Immutable<State>): boolean {
	const current_basename = get_basename(state)
	return current_basename.length > 11 // must be big enough, just a year won't do
		&& current_basename.slice(8, 11) === ' - '
		&& is_compact_date(current_basename.slice(0, 8))
}

export function get_reliable_children_range(state: Immutable<State>): null | [ SimpleYYYYMMDD, SimpleYYYYMMDD ] {
	const { children_begin_date_symd, children_end_date_symd } = state
	if (!children_begin_date_symd || !children_end_date_symd) return null
	return [ children_begin_date_symd, children_end_date_symd ]
}

export function are_children_fs_reliable(state: Immutable<State>): undefined | boolean {
	assert(
		state.children_count === 0
		+ state.children_fs_reliability_count['undefined']
		+ state.children_fs_reliability_count['false']
		+ state.children_fs_reliability_count['true'],
		`${LIB} are_children_fs_reliable() mismatching counts`
	)

	if (state.children_fs_reliability_count['false'] > 0)
		return false

	if (state.children_fs_reliability_count['true'] > 0)
		return true

	return undefined
}

///////////////////// REDUCERS /////////////////////

export function create(id: RelativePath): Immutable<State> {
	logger.trace(`${LIB} create(…)`, { id })

	const pathㆍparsed = path.parse(id)
	const base = pathㆍparsed.base
	const type = _infer_initial_folder_type(id, pathㆍparsed)
	// TODO remove prema optim? Or skip if special folder?
	const nameㆍparsed = parse_basename(base, { type: 'folder' })
	const date = _infer_start_date(nameㆍparsed)

	return {
		id,
		type,
		children_begin_date_symd: undefined, // so far
		children_end_date_symd: undefined, // so far
		event_begin_date_symd: type === Type.event ? date : undefined, // so far
		event_end_date_symd: type === Type.event ? date : undefined, // so far

		children_count: 0,
		children_fs_reliability_count: {
			'undefined': 0,
			'true': 0,
			'false': 0,
		},

		cached: {
			pathㆍparsed,
			nameㆍparsed,
		},
	}
}

export function on_subfile_found(state: Immutable<State>, file_state: Immutable<File.State>): Immutable<State> {
	logger.trace(`${LIB} on_subfile_found(…)`, { file_id: file_state.id })

	return {
		...state,
		children_count: state.children_count + 1,
	}
}

export function on_dated_subfile_found(state: Immutable<State>, file_state: Immutable<File.State>, PARAMS: Immutable<Params> = get_params()): Immutable<State> {
	logger.trace(`${LIB} on_dated_subfile_found(…)`, { file_id: file_state.id })

	if (!File.is_confident_in_date(file_state)) {
		// low confidence = don't act on that
		return state
	}

	const file_date_symd = File.get_best_creation_date_compact(file_state)

	//////////// 1. children
	const { children_end_date_symd: previous_children_end_date } = state

	const new_children_begin_date_symd = state.children_begin_date_symd
		? Math.min(state.children_begin_date_symd, file_date_symd)
		: file_date_symd
	const new_children_end_date_symd = state.children_end_date_symd
		? Math.max(state.children_end_date_symd, file_date_symd)
		: file_date_symd

	if (new_children_begin_date_symd === state.children_begin_date_symd && new_children_end_date_symd === state.children_end_date_symd) {
		// no change
		return state
	}

	logger.verbose(
		`${LIB} updating folder’s children's date range`,
		{
			id: state.id,
			file_date_symd,
			new_children_begin_date_symd,
			new_children_end_date_symd,
		}
	)

	state = {
		...state,
		children_begin_date_symd: new_children_begin_date_symd,
		children_end_date_symd: new_children_end_date_symd,
	}


	//////////// 2. event
	if (state.type !== Type.event)
		return state

	//const { event_end_date_symd: previous_event_end_date } = state

	const new_event_begin_date_symd = state.event_begin_date_symd
		? is_current_basename_intentful(state)
			? state.event_begin_date_symd // no change, the dir name is clear thus has precedence
			: Math.min(state.event_begin_date_symd, file_date_symd)
		: file_date_symd
	let new_event_end_date_symd = state.event_end_date_symd
		? Math.max(state.event_end_date_symd, file_date_symd)
		: file_date_symd

	const capped_end_date = add_days_to_simple_date(new_event_begin_date_symd, PARAMS.max_event_duration_in_days)
	const is_range_too_big = new_event_end_date_symd > capped_end_date
	new_event_end_date_symd = Math.min(new_event_end_date_symd, capped_end_date)

	if (new_event_begin_date_symd === state.event_begin_date_symd && new_event_end_date_symd === state.event_end_date_symd) {
		// no change
		return state
	}

	if (is_range_too_big) {
		// unlikely to be an event

		if (is_current_basename_intentful(state)) {
			logger.info(
				`${LIB} folder: date range too big but basename is intentful: event end date will be capped at +${PARAMS.max_event_duration_in_days}d`, {
					id: state.id,
					file_id: file_state.id,
					file_date_symd,
					new_event_begin_date_symd,
					new_event_end_date_symd,
					capped_end_date,
				})
		}
		else {
			logger.info(
				`${LIB} folder: date range too big, most likely not an event, demoting...`, {
					id: state.id,
					file_id: file_state.id,
					file_date_symd,
					new_event_begin_date_symd,
					new_event_end_date_symd,
					capped_end_date,
				})
			state = demote_to_unknown(state, `date range too big`)
			return state
		}
	}

	state = {
		...state,
		event_begin_date_symd: new_event_begin_date_symd,
		event_end_date_symd: new_event_end_date_symd,
	}

	return state
}

export function on_subfile_fs_reliability_assessed(state: Immutable<State>, fs_birthtime_reliability: undefined | boolean): Immutable<State> {
	logger.trace(`${LIB} on_subfile_fs_reliability_assessed(…)`)

	const key: keyof State['children_fs_reliability_count'] = String(fs_birthtime_reliability) as any
	state = {
		...state,
		children_fs_reliability_count: {
			...state.children_fs_reliability_count,
			[key]: state.children_fs_reliability_count[key] + 1,
		}
	}

	return state
}

export function on_overlap_clarified(state: Immutable<State>, end_date_symd: SimpleYYYYMMDD, PARAMS = get_params()): Immutable<State> {
	logger.trace(`${LIB} on_overlap_clarified(…)`, {
		prev_end_date: state.event_end_date_symd,
		new_end_date: end_date_symd,
	})

	assert(state.type === Type.event, `on_overlap_clarified() called on a non-event`)
	assert(state.event_begin_date_symd, `on_overlap_clarified() called on a non-dated event`)
	const capped_end_date_symd = add_days_to_simple_date(state.event_begin_date_symd, PARAMS.max_event_duration_in_days)
	assert(end_date_symd <= capped_end_date_symd, `on_overlap_clarified() target event range too big`)

	return {
		...state,
		event_end_date_symd: end_date_symd,
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
		event_begin_date_symd: undefined,
		event_end_date_symd: undefined,
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
		const { event_begin_date_symd, event_end_date_symd } = state
		str += ` 📅 ${event_begin_date_symd} → ${event_end_date_symd}`
	}

	return str
}
