import path from 'path'
import fs from 'fs'

import assert from 'tiny-invariant'
import { Tags, ExifDateTime } from 'exiftool-vendored'
import { TimestampUTCMs, get_UTC_timestamp_ms } from "@offirmo-private/timestamps"

import {Basename, RelativePath, SimpleYYYYMMDD} from '../types'
import { get_compact_date_from_UTC_ts } from '../services/utils'
import logger from "../services/logger";

type TimestampsHash = { [k: string]: TimestampUTCMs }

export interface State {
	id: RelativePath
	is_eligible: boolean

	cached: {
//		base: Basename
		dir: RelativePath
	}

	exif_data: undefined | Tags | null
	fs_stats: undefined | fs.Stats | null

	original_base: Basename
}

/** ☆☆☆☆ ✔ Example: 1 */
//TimeZoneOffset?: number;
/** ★★★★ ✔ Example: 2218-09-22T02:32:14.000 */
//CreateDate?: ExifDateTime;
/** ★★★★ ✔ Example: 2218-09-22T02:32:14.000 */
//DateTimeOriginal?: ExifDateTime;
/** ☆☆☆☆ ✔ Example: 2020-07-08 */
//GPSDateStamp?: ExifDate;
/** ☆☆☆☆   Example: 2006-12-19 */
//DateCreated?: ExifDate;
/** ☆☆☆☆ ✔ Example: 2019-07-20T19:21:25.000-07:00 */
//DateTimeCreated?: ExifDateTime;
/** ☆☆☆☆ ✔ Example: 2019-05-25 */
//DigitalCreationDate?: ExifDate;
/** ☆☆☆☆ ✔ Example: 13:39:28 */
//DigitalCreationTime?: ExifTime;
/** ☆☆☆☆   Example: 2013-03-12T16:31:26.000 */
//DateTimeGenerated?: ExifDateTime;
/** ☆☆☆☆ ✔ Example: 2017-02-12T10:28:20.000 */
	//MediaCreateDate?: ExifDateTime;
const exif_date_fields: string[] = [
	'CreateDate',
	'DateTimeOriginal',
	//'GPSDateStamp',
	//'DateCreated',
	//'DateTimeCreated',
	//'DigitalCreationDate',
	//'DigitalCreationTime',
	'DateTimeGenerated',
	'MediaCreateDate'
]

////////////////////////////////////


const ALLOWED_MEDIA_FILE_EXTENSIONS = [
	'.gif',
	'.jpg',
	'.jpeg',
	'.png',
	'.mov',
	'.mp4',
]
export function is_eligible_media_file(id: RelativePath, parsed: path.ParsedPath = path.parse(id)): boolean {
	//logger.trace(`is_eligible_media_file...`, { id })

	if (parsed.base.startsWith('.')) return false
	if (!ALLOWED_MEDIA_FILE_EXTENSIONS.includes(parsed.ext.toLowerCase())) return false
	if (parsed.base.startsWith('Capture')) return false // TODO handle? Uniformize?
	if (parsed.base.startsWith('Screen')) return false

	/*
	.filter(f => f[0] !== '.')
			.filter(f => !(f.startsWith('IMG_20') && f.length >= DATE_TS_LENGTH + 4 + 4))
			.filter(f => !(f.startsWith('VID_20') && f.length >= DATE_TS_LENGTH + 4 + 4))
			.filter(f => !(f.startsWith('20') && f.length >= DATE_TS_LENGTH + 4))

		*/

	return true
}

export function is_equal(state_l: Readonly<State>, state_r: Readonly<State>): boolean {
	// TODO compare exif size and data
	throw new Error('NIMP!')
}

export function has_all_infos(state: Readonly<State>): boolean {
	return state.exif_data !== undefined && state.fs_stats !== undefined
}

export function has_error(state: Readonly<State>): boolean {
	return !(state.exif_data && state.fs_stats)
}

export function get_parent_folder_id(state: Readonly<State>): RelativePath {
	return state.cached.dir
}


function _get_creation_date_from_name(state: Readonly<State>): TimestampUTCMs | null {
	// TODO match regexp!
	return null
}
function _get_creation_date_from_fs_stats({ fs_stats }: Readonly<State>): TimestampUTCMs {
	assert(fs_stats !== undefined, 'fs stats read ✔')
	assert(fs_stats, 'fs stats ok ✔')

	return fs_stats!.birthtimeMs
}
function _get_creation_date_from_exif({ id, exif_data }: Readonly<State>): TimestampUTCMs | null {
	assert(exif_data !== undefined, 'exif data read ✔')
	if (!exif_data) return null

	try {
		const now = get_UTC_timestamp_ms()
		let min_date_ms = now
		let max_date_ms = now
		const candidate_dates_ms: TimestampsHash = exif_date_fields.reduce((acc: TimestampsHash, field: string) => {
			const date_object: undefined | ExifDateTime  = (exif_data as any)[field]
			if (date_object && date_object.millis)  {
				//console.log(field, date_object)
				const tms = date_object.millis
				acc[field] = tms
				min_date_ms = Math.min(min_date_ms, tms)
				max_date_ms = Math.max(max_date_ms, tms)
			}
			return acc
		}, {} as TimestampsHash)

		if (!Object.keys(candidate_dates_ms).length) return null

		console.log({ min_date_ms, max_date_ms })
		assert(min_date_ms === max_date_ms, 'coherent dates (1)')
		assert(min_date_ms !== now, 'coherent dates (2)')

		return min_date_ms
	}
	catch (err) {
		logger.fatal(`error extracting date from exif for "${id}"!`, exif_data)
		throw err
	}
}

export function get_best_creation_date(state: Readonly<State>): TimestampUTCMs {
	const from_name = _get_creation_date_from_name(state)
	if (from_name) return from_name

	const from_exif = _get_creation_date_from_exif(state)
	if (from_exif) return from_exif

	return _get_creation_date_from_fs_stats(state)
}

export function get_best_compact_date(state: Readonly<State>) {
	return get_compact_date_from_UTC_ts(get_best_creation_date(state))
}

////////////////////////////////////

export function create(id: RelativePath): Readonly<State> {
	const parsed = path.parse(id)
	const state = {
		id,
		is_eligible: is_eligible_media_file(id, parsed),

		cached: {
			//base: parsed.base,
			dir: parsed.dir,
		},

		exif_data: undefined,
		fs_stats: undefined,

		original_base: parsed.base,
	}

	// TODO extract date from name?

	return state
}

export function on_fs_stats_read(state: Readonly<State>, fs_stats: State['fs_stats']): Readonly<State> {
	return {
		...state,
		fs_stats,
	}
}

export function on_exif_read(state: Readonly<State>, exif_data: State['exif_data']): Readonly<State> {
	if (exif_data && exif_data.errors && exif_data.errors.length) {
		logger.error(`Error reading exif datas for "${state.id}"!`, { errors: exif_data.errors })
		exif_data = null
	}

	return {
		...state,
		exif_data,
	}
}
