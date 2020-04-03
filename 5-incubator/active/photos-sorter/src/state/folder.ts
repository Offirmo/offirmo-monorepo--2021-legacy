import path from 'path'
import { Enum } from 'typescript-string-enums'

import assert from 'tiny-invariant'
import stylize_string from 'chalk'

import { is_year, get_normalized_dirname, is_compact_date } from '../services/matchers'
import { parse as parse_basename, extract_compact_date } from '../services/name_parser'
import { Basename, RelativePath, SimpleYYYYMMDD } from '../types'
import * as MediaFile from './file'
import logger from '../services/logger'

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
	'unknown', // anything that can't be an event
)
export type Type = Enum<typeof Type> // eslint-disable-line no-redeclare

export interface State {
	id: RelativePath
	type: Type

	start_date: undefined | SimpleYYYYMMDD
	end_date: undefined | SimpleYYYYMMDD

	cached: {
		parsed: path.ParsedPath,
	}
}

///////////////////// ACCESSORS /////////////////////

function _infer_folder_type(id: RelativePath, parsed: path.ParsedPath): Type {
	assert(id, '_infer_folder_type() id')
	if (id === '.') return Type.root

	const depth = parsed.dir.split(path.sep).length - 1

	if (depth === 0 && get_normalized_dirname(parsed.base) === INBOX_BASENAME) return Type.inbox
	if (depth === 0 && get_normalized_dirname(parsed.base) === CANTSORT_BASENAME) return Type.cantsort
	if (depth === 0 && is_year(parsed.base)) return Type.year

	return Type.event // so far
}

function _infer_start_date(base: Basename): undefined | SimpleYYYYMMDD {
	const compact_date_from_basename = extract_compact_date(base)
	return compact_date_from_basename || undefined
}

export function get_basename(state: Readonly<State>): Basename {
	return state.cached.parsed.base
}

export function get_ideal_basename(state: Readonly<State>): Basename {
	const current_basename = get_basename(state)

	if (state.type !== Type.event)
		return current_basename

	assert(state.start_date, 'get_ideal_basename() start date')
	const parsed = parse_basename(current_basename)

	return String(state.start_date + ' - ' + parsed.meaningful_part)
}
/*
export function get_best_creation_year(state: Readonly<State>) {
	assert(state.start_date)
	return Math.trunc(state.start_date / 10000)
}
*/
///////////////////// REDUCERS /////////////////////

export function create(id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] create(…)`, { id })

	const parsed = path.parse(id)
	const type = _infer_folder_type(id, parsed)
	const base = parsed.base
	const date = _infer_start_date(base)
	return {
		id,
		type,
		start_date: date,
		end_date: date,

		cached: {
			parsed,
		},
	}
}

export function on_subfile_found(state: Readonly<State>, file_state: Readonly<MediaFile.State>): Readonly<State> {
	logger.trace(`[${LIB}] on_subfile_found(…)`, { })

	if (state.type == Type.event) {
		const file_compact_date = MediaFile.get_best_creation_date_compact(file_state)
		const new_start_date = state.start_date
			? Math.min(state.start_date, file_compact_date)
			: file_compact_date
		const new_end_date = state.end_date
			? Math.max(state.end_date, file_compact_date)
			: file_compact_date

		if (new_end_date - new_start_date > 28) {
			// range too big, can't be an event
			logger.verbose(
				`[${LIB}] demoting folder: most likely not an event (date range too big)`, {
					id: state.id,
					file_id: file_state.id,
					file_compact_date,
					start_date: new_start_date,
					end_date: new_end_date,
				})
			state = {
				...state,
				type: Type.unknown,
			}
		}
		else {
			logger.verbose(
				`[${LIB}] updating folder’s date range`,
				{
					id: state.id,
					file_compact_date,
					start_date: new_start_date,
					end_date: new_end_date,
				})
			state = {
				...state,
				start_date: new_start_date,
				end_date: new_end_date,
			}
		}
	}

	return state
}

export function demote_to_unknown(state: Readonly<State>): Readonly<State> {
	logger.trace(`[${LIB}] demote_to_unknown(…)`, { })

	assert(state.type === Type.event, 'demote_to_unknown precond')

	return {
		...state,
		type: Type.unknown,
	}
}

/*
export function on_moved(state: Readonly<State>, new_id: RelativePath): Readonly<State> {
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

export function to_string(state: Readonly<State>) {
	const { id, type, start_date, end_date } = state

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

	if (start_date !== -1 || end_date !== -1) {
		str += ` ${start_date} → ${end_date}`
	}

	return str
}
