import util from 'util'
import path from 'path'
import fs from 'fs'

import { Immutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'
import { expect } from 'chai'
import assert from 'tiny-invariant'
import { Tags as EXIFTags, exiftool } from 'exiftool-vendored'
import hasha from 'hasha'

import {
	BetterDate,
	_get_exif_datetime,
	create_better_date,
	get_compact_date,
	get_human_readable_timestamp_auto,
	get_timestamp_utc_ms_from,
} from '../services/better-date'
import {
	PersistedNotes,
	FsReliability, NeighborHints,
} from '../state/file'
import * as File from '../state/file'
import * as DB from '../state/db'
import * as Notes from '../state/notes'
import { Basename } from '../types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { FsStatsSubset } from '../services/fs_stats'


export async function load_real_media_file(
	abs_path: string,
	state: Immutable<File.State> = File.create(path.parse(abs_path).base),
): Promise<Immutable<File.State>> {
	expect(File.is_media_file(state)).to.be.true
	expect(File.is_exif_powered_media_file(state)).to.be.true

	await Promise.all([
		hasha.fromFile(abs_path, {algorithm: 'sha256'})
			.then(hash => {
				expect(File.has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 1').to.be.false
				assert(hash, 'should have hash')
				state = File.on_info_read__hash(state, hash)
			}),
		util.promisify(fs.stat)(abs_path)
			.then(stats => {
				expect(File.has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 2').to.be.false
				state = File.on_info_read__fs_stats(state, stats)
			}),
		exiftool.read(abs_path)
			.then(exif_data => {
				expect(File.has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 3').to.be.false
				state = File.on_info_read__exif(state, exif_data)
			})
	])

	expect(File.has_all_infos_for_extracting_the_creation_date(state, {
		require_neighbors_hints: false,
		require_notes: false,
	})).to.be.true

	return enforce_immutability(state)
}

const REAL_CREATION_DATE = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
export const REAL_CREATION_DATE‿HRTS = get_human_readable_timestamp_auto(REAL_CREATION_DATE, 'tz:embedded')
assert(REAL_CREATION_DATE‿HRTS === '2017-10-20_05h01m44s625', 'REAL_CREATION_DATE‿HRTS should be correct')
export const REAL_CREATION_DATE‿TMS = get_timestamp_utc_ms_from(REAL_CREATION_DATE)
const REAL_CREATION_DATE‿LEGACY = new Date(REAL_CREATION_DATE‿TMS)
export const REAL_CREATION_DATE‿EXIF = _get_exif_datetime(REAL_CREATION_DATE)

// must be OLDER yet we won't pick it
const BAD_CREATION_DATE_CANDIDATE = create_better_date('tz:auto', 2016, 11, 21, 9, 8, 7, 654)
const BAD_CREATION_DATE_CANDIDATE‿HRTS = get_human_readable_timestamp_auto(BAD_CREATION_DATE_CANDIDATE, 'tz:embedded')
assert(BAD_CREATION_DATE_CANDIDATE‿HRTS === '2016-11-21_09h08m07s654', 'BAD_CREATION_DATE_CANDIDATE‿HRTS should be correct')
export const BAD_CREATION_DATE_CANDIDATE‿TMS = get_timestamp_utc_ms_from(BAD_CREATION_DATE_CANDIDATE)
const BAD_CREATION_DATE_CANDIDATE‿LEGACY = new Date(BAD_CREATION_DATE_CANDIDATE‿TMS)
const BAD_CREATION_DATE_CANDIDATE‿EXIF = _get_exif_datetime(BAD_CREATION_DATE_CANDIDATE)
const BAD_CREATION_DATE_CANDIDATE‿SYMD = get_compact_date(BAD_CREATION_DATE_CANDIDATE, 'tz:embedded')
/*console.log({
	dtz: get_default_timezone(BAD_CREATION_DATE_CANDIDATE‿TMS),
	BAD_CREATION_DATE_CANDIDATE,
	bcd_tz: get_embedded_timezone(BAD_CREATION_DATE_CANDIDATE),
	tt: create_better_date_from_utc_tms(BAD_CREATION_DATE_CANDIDATE‿TMS, 'tz:auto'),
	tt_tz: get_embedded_timezone(create_better_date_from_utc_tms(BAD_CREATION_DATE_CANDIDATE‿TMS, 'tz:auto')),
})*/

const DEFAULT_FILE_INPUTS = {
	// everything bad / undated by default, so that the tests must override those
	parent_relpath__current: 'foo',
	basename__current: 'bar.jpg',

	date__fs_ms__current: BAD_CREATION_DATE_CANDIDATE‿TMS, // always exist
	date__exif: BAD_CREATION_DATE_CANDIDATE‿EXIF as null | typeof REAL_CREATION_DATE‿EXIF,
	hash__current: 'hash01',
	hints_from_reliable_neighbors__current__fs_reliability: 'unknown' as FsReliability,
	hints_from_reliable_neighbors__current__parent_folder_bcd: null as null | BetterDate,

	notes: null as null | 'auto' | Immutable<PersistedNotes>,
	// won't be used unless notes = auto
	autoǃbasename__historical: undefined as Basename | undefined,
	autoǃdate__fs_ms__historical: undefined as TimestampUTCMs | undefined,
	// TODO one day other historical fields (hints)
}

function _get_file_id(inputs: typeof DEFAULT_FILE_INPUTS): File.FileId {
	return path.join(...[
			//...inputs.parent_relpath__current.split('/'),
			inputs.parent_relpath__current,
			inputs.basename__current,
		].filter(x => !!x) as string[])
}
function _get_auto_notes(inputs: typeof DEFAULT_FILE_INPUTS): PersistedNotes {
	return {
		currently_known_as: 'whatever, write-only.xyz',
		renaming_source: undefined,

		// TODO one day: test that
		deleted: undefined,
		starred: undefined,
		manual_date: undefined,

		best_date_afawk_symd: undefined, // TODO?

		historical: {
			basename: inputs.autoǃbasename__historical ?? 'original' + path.parse(inputs.basename__current).ext, // extensions should match,
			parent_path: 'original_parent_path',
			fs_bcd_tms: inputs.autoǃdate__fs_ms__historical ?? BAD_CREATION_DATE_CANDIDATE‿TMS,
			neighbor_hints: {
				parent_folder_bcd: undefined,
				fs_bcd_assessed_reliability: 'unknown',
			},
		},
	}
}
function _get_auto_fs_stats(inputs: typeof DEFAULT_FILE_INPUTS): FsStatsSubset {
	return {
		birthtimeMs: inputs.date__fs_ms__current,
		atimeMs:     inputs.date__fs_ms__current + 10000,
		mtimeMs:     inputs.date__fs_ms__current + 10000,
		ctimeMs:     inputs.date__fs_ms__current + 10000,
	}
}
function _get_auto_exif_data(inputs: typeof DEFAULT_FILE_INPUTS): EXIFTags {
	const exif_data = {
		SourceFile: _get_file_id(inputs),
		...(inputs.date__exif && {
			// may be exif powered without the info we need
			'CreateDate': inputs.date__exif,
			//'DateTimeOriginal': inputs.date__exif,
			//'DateTimeGenerated': inputs.date__exif,
			//'MediaCreateDate': inputs.date__exif,
		} as EXIFTags),
	}
	//console.log('_get_auto_exif_data() EXIFTags', exif_data)
	return exif_data
}

export function get_test_single_file_state_generator() {
	const inputs = {
		...DEFAULT_FILE_INPUTS,
	}

	function reset() {
		Object.keys(DEFAULT_FILE_INPUTS).forEach(k => {
			;(inputs as any)[k] = (DEFAULT_FILE_INPUTS as any)[k]
		})
	}

	function create_test_file_state(): Immutable<File.State> {
		//console.log('create_test_file_state()', inputs)
		const id = _get_file_id(inputs)
		let state = File.create(id)

		state = File.on_info_read__fs_stats(state, _get_auto_fs_stats(inputs))
		if (File.is_exif_powered_media_file(state)) {
			state = File.on_info_read__exif(state, _get_auto_exif_data(inputs))
		}
		state = File.on_info_read__hash(state, inputs.hash__current)

		// simulate consolidation
		state = File.on_info_read__current_neighbors_primary_hints(state, {
			// TODO fix
			//parent_folder_bcd: inputs.hints_from_reliable_neighbors__current__parent_folder_bcd,
			fs_bcd_assessed_reliability: inputs.hints_from_reliable_neighbors__current__fs_reliability,
		})

		let notes: null | Immutable<PersistedNotes> = inputs.notes === 'auto'
			? _get_auto_notes(inputs)
			: inputs.notes
		state = File.on_notes_recovered(state, notes)

		return state
	}

	return {
		DEFAULT_INPUTS: DEFAULT_FILE_INPUTS,
		inputs,
		reset,
		create_state: create_test_file_state,
	}
}

export function get_test_single_file_DB_state_generator() {
	const DEFAULT_INPUTS = {
		extra_parent: null as null | Basename,
		file: DEFAULT_FILE_INPUTS,
	}
	const inputs = {
		...DEFAULT_INPUTS,
	}

	function reset() {
		Object.keys(DEFAULT_INPUTS).forEach(k => {
			;(inputs as any)[k] = (DEFAULT_INPUTS as any)[k]
		})
		inputs.file = { ...DEFAULT_FILE_INPUTS }
	}

	function get_file_id(): File.FileId {
		return _get_file_id(inputs.file)
	}

	function create_test_db_state(): Immutable<DB.State> {
		const file_id = get_file_id()

		let state = DB.create('root')

		function _get_file_state(): Immutable<File.State> {
			return state.files[file_id]
		}

		state = DB.on_folder_found(state, '', '.')
		const parent_splitted = inputs.file.parent_relpath__current.split('/')
		for (let i = 0; i < parent_splitted.length; ++i) {
			const parent_subpath = path.join(...parent_splitted.slice(0, i))
			const basename = path.join(...parent_splitted.slice(i, i+1))
			state = DB.on_folder_found(state, parent_subpath, basename)
		}

		state = DB.on_file_found(state, '.', file_id)

		state = DB.on_hash_computed(state, file_id, inputs.file.hash__current)
		state = DB.on_fs_stats_read(state, file_id, _get_auto_fs_stats(inputs.file))
		if (File.is_exif_powered_media_file(_get_file_state())) {
			state = DB.on_exif_read(state, file_id, _get_auto_exif_data(inputs.file))
		}

		let notes = null as null | Immutable<Notes.State>
		if (inputs.file.notes === 'auto') {
			notes = Notes.create('test')
			notes = {
				...notes,
				encountered_files: {
					...notes.encountered_files,
					[inputs.file.hash__current]: _get_auto_notes(inputs.file),
				}
			}
			state = DB.on_note_file_found(state, notes)
		}

		state = DB.on_fs_exploration_done_consolidate_data_and_backup_originals(state)
		state = DB.discard_all_pending_actions(state)

		return state
	}

	return {
		DEFAULT_INPUTS: DEFAULT_FILE_INPUTS,
		inputs,
		reset,
		create_state: create_test_db_state,
		get_file_id,
	}
}
