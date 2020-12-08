import path from 'path'
import { Enum } from 'typescript-string-enums'

import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Immutable } from '@offirmo-private/ts-types'

import { is_year, get_normalized_dirname, is_compact_date } from '../services/matchers'
import { parse as parse_basename, ParseResult } from '../services/name_parser'
import { Basename, RelativePath, SimpleYYYYMMDD } from '../types'
import * as MediaFile from './file'
import logger from '../services/logger'
import { get_compact_date, add_days_to_simple_date } from '../services/better-date'

////////////////////////////////////

const LIB = '📂'
export const INBOX_BASENAME = 'inbox'
export const CANTSORT_BASENAME = 'cantsort'

export const Type = Enum(
	'root',
	'inbox',
	'cantsort',
	'year',
	'event', // by default
	'unknown', // anything else that can't be an event
)
export type Type = Enum<typeof Type> // eslint-disable-line no-redeclare

export type FolderId = RelativePath
export interface State {
	id: FolderId
	type: Type

	//child_count: number TODO
	begin_date: undefined | SimpleYYYYMMDD
	end_date: undefined | SimpleYYYYMMDD

	cached: {
		pathㆍparsed: path.ParsedPath,
		nameㆍparsed: ParseResult,
	}
}

///////////////////// ACCESSORS /////////////////////

function _infer_initial_folder_type(id: FolderId, pathㆍparsed: path.ParsedPath): Type {
	assert(id, '_infer_initial_folder_type() id')
	if (id === '.') return Type.root

	const depth = pathㆍparsed.dir.split(path.sep).length - 1

	if (depth === 0 && get_normalized_dirname(pathㆍparsed.base) === INBOX_BASENAME) return Type.inbox
	if (depth === 0 && get_normalized_dirname(pathㆍparsed.base) === CANTSORT_BASENAME) return Type.cantsort
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

export function get_ideal_basename(state: Immutable<State>): Basename {
	const current_basename = get_basename(state)

	if (state.type !== Type.event)
		return current_basename

	assert(state.begin_date, 'get_ideal_basename() start date')

	return String(state.begin_date + ' - ' + state.cached.nameㆍparsed.meaningful_part)
}

export function is_current_name_intentful(state: Immutable<State>): boolean {
	const current_basename = get_basename(state)
	return current_basename.length > 11
		&& current_basename.slice(8, 11) === ' - '
		&& is_compact_date(current_basename.slice(0, 8))
}
/*
export function is_canonical(state: Immutable<State>): boolean {
	const current_basename = get_basename(state)
	const ideal_basename = get_ideal_basename(state)
	return current_basename === ideal_basename
}
*/
///////////////////// REDUCERS /////////////////////

export function create(id: RelativePath): Immutable<State> {
	logger.trace(`[${LIB}] create(…)`, { id })

	const pathㆍparsed = path.parse(id)
	const base = pathㆍparsed.base
	const type = _infer_initial_folder_type(id, pathㆍparsed)
	const nameㆍparsed = parse_basename(base)
	const date = _infer_start_date(nameㆍparsed)

	return {
		id,
		type,
		begin_date: date, // so far
		end_date: date, // so far

		cached: {
			pathㆍparsed,
			nameㆍparsed,
		},
	}
}

export function on_subfile_found(state: Immutable<State>, file_state: Immutable<MediaFile.State>): Immutable<State> {
	logger.trace(`[${LIB}] on_subfile_found(…)`, { file_id: file_state.id })

	if (state.type == Type.event) {
		const file_compact_date = MediaFile.get_best_creation_date_compact(file_state)
		const { end_date: previous_end_date } = state
		const new_start_date = state.begin_date
			? is_current_name_intentful(state)
				? state.begin_date // no change, the dir name is clear thus has precedence
				: Math.min(state.begin_date, file_compact_date)
			: file_compact_date
		let new_end_date = state.end_date
			? Math.max(state.end_date, file_compact_date)
			: file_compact_date

		if (new_end_date - new_start_date > 28) {
			// range too big, unlikely to be an event
			if (!is_current_name_intentful(state)) {
				logger.info(
					`[${LIB}] demoting folder: most likely not an event (date range too big)`, {
						id: state.id,
						file_id: file_state.id,
						file_compact_date,
						begin_date: new_start_date,
						end_date: new_end_date,
					})
				state = demote_to_unknown(state, `[${LIB}] demoting folder: most likely not an event (date range too big)`)
			}
			else {
				new_end_date = add_days_to_simple_date(new_start_date, 28)
				logger.info(
					`[${LIB}] folder: date range too big but intentful: capping end_date at +28`, {
						id: state.id,
						file_id: file_state.id,
						file_compact_date,
						begin_date: new_start_date,
						end_date: new_end_date,
					})
				if (new_end_date !== previous_end_date) {
					state = {
						...state,
						begin_date: new_start_date,
						end_date: new_end_date,
					}
				}
			}
		}
		else {
			logger.verbose(
				`[${LIB}] updating folder’s date range`,
				{
					id: state.id,
					file_compact_date,
					begin_date: new_start_date,
					end_date: new_end_date,
				})
			state = {
				...state,
				begin_date: new_start_date,
				end_date: new_end_date,
			}
		}
	}

	return state
}

export function on_overlap_clarified(state: Immutable<State>, end_date: SimpleYYYYMMDD): Immutable<State> {
	logger.trace(`[${LIB}] on_overlap_clarified(…)`, {
		prev_end_date: state.end_date,
		new_end_date: end_date,
	})

	return {
		...state,
		end_date,
	}
}

export function demote_to_unknown(state: Immutable<State>, reason: string): Immutable<State> {
	logger.trace(`[${LIB}] demote_to_unknown(…)`, { })

	assert(state.type === Type.event, 'demote_to_unknown(): should be demote-able')

	return {
		...state,
		type: Type.unknown,
	}
}

/*
export function on_moved(state: Immutable<State>, new_id: RelativePath): Immutable<State> {
	logger.trace(`[${LIB}] on_moved(…)`, { new_id })

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
	const { id, type, begin_date, end_date } = state

	let str = `📓  [${String(type).padStart(8)}]`
	switch(type) {
		case Type.inbox:
		case Type.cantsort:
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

	if (begin_date !== -1 || end_date !== -1) {
		str += ` ${begin_date} → ${end_date}`
	}

	return str
}
