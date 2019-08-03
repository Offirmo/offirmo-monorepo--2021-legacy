import path from 'path'
import { Enum } from 'typescript-string-enums'

import { get_UTC_timestamp_ms } from "@offirmo-private/timestamps"

import { get_compact_date_from_UTC_ts } from '../services/utils'
import { is_year, get_normalized_dirname, is_compact_date } from "../services/matching"
import {Basename, RelativePath, SimpleYYYYMMDD} from '../types'
import * as MediaFile from './media-file'
import logger from "../services/logger";

////////////////////////////////////

export const INBOX_BASENAME = 'inbox'
export const CANTSORT_BASENAME = 'cantsort'

export const Type = Enum(
	'root',
	'inbox',
	'cantsort',
	'year',
	'event', // by default
	'unknown', // the date range is too big, can't be an event
)
export type Type = Enum<typeof Type> // eslint-disable-line no-redeclare

export interface State {
	id: RelativePath
	type: Type

	start_date: SimpleYYYYMMDD
	end_date: SimpleYYYYMMDD
}

const now_ms = get_UTC_timestamp_ms()
const now_simple = get_compact_date_from_UTC_ts(now_ms)

////////////////////////////////////

function _infer_folder_type(id: RelativePath): Type {
	if (!id) return Type.root

	const parsed = path.parse(id)
	let depth = parsed.dir.split(path.sep).length - 1
	//console.log('_infer_folder_type', { dir: parsed.dir, depth })
	if (depth > 0) return Type.event

	if (is_year(parsed.base)) return Type.year

	if (get_normalized_dirname(parsed.base) === INBOX_BASENAME) return Type.inbox
	if (get_normalized_dirname(parsed.base) === CANTSORT_BASENAME) return Type.cantsort

	if (is_compact_date(parsed.base.slice(0, 8))) return Type.event

	return Type.event
}

function _infer_start_date(base: Basename, now = now_simple): SimpleYYYYMMDD {
	// TODO infer from the name!
	return now_simple
}
////////////////////////////////////

export function create(id: RelativePath): Readonly<State> {
	const type = _infer_folder_type(id)
	const start_date = type === Type.event ? _infer_start_date(path.basename(id)) : -1
	return {
		id,
		type: _infer_folder_type(id),
		start_date: start_date,
		end_date: start_date,
	}
}

export function on_subfile_found(state: Readonly<State>, file_state: Readonly<MediaFile.State>): Readonly<State> {
	if (state.type == Type.event) {
		const compact_date = MediaFile.get_best_compact_date(file_state)
		const start_date = Math.min(state.start_date, compact_date)
		const end_date = Math.max(state.start_date, compact_date)

		if (end_date - start_date > 28) {
			// range too big, can't be an event
			logger.verbose('demoting folder: most likely not an event', { id: state.id, start_date, end_date })
			state = {
				...state,
				type: Type.unknown,
			}
		}
		else {
			logger.verbose('updating folder’s date range', { id: state.id, start_date, end_date })
			state = {
				...state,
				start_date: Math.min(state.start_date, compact_date),
				end_date: Math.max(state.start_date, compact_date),
			}
		}
	}

	return state
}

export function rename() {

}

export function move() {

}
