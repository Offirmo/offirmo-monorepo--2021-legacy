import util from 'util'
import path from 'path'
import fs from 'fs'

import { Immutable, Mutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'
import { expect } from 'chai'
import assert from 'tiny-invariant'
import { Tags as EXIFTags } from 'exiftool-vendored'
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
	FsReliability,
} from '../state/file'
import * as FileLib from '../state/file'
import * as DB from '../state/db'
import * as Notes from '../state/notes'
import { Basename } from '../types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { FsStatsSubset } from '../services/fs_stats'
import { read_exif_data } from '../services/exif'


export async function load_real_media_file(abs_path: string): Promise<Immutable<FileLib.State>> {
	let state: Immutable<FileLib.State> = FileLib.create(path.parse(abs_path).base)
	expect(FileLib.is_media_file(state)).to.be.true
	expect(FileLib.is_exif_powered_media_file(state)).to.be.true

	await Promise.all([
		hasha.fromFile(abs_path, {algorithm: 'sha256'})
			.then(hash => {
				expect(FileLib.has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 1').to.be.false
				assert(hash, 'should have hash')
				state = FileLib.on_info_read__hash(state, hash)
			}),
		util.promisify(fs.stat)(abs_path)
			.then(stats => {
				expect(FileLib.has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 2').to.be.false
				state = FileLib.on_info_read__fs_stats(state, stats)
			}),
		read_exif_data(abs_path)
			.then(exif_data => {
				expect(FileLib.has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 3').to.be.false
				state = FileLib.on_info_read__exif(state, exif_data)
			})
	])

	expect(FileLib.has_all_infos_for_extracting_the_creation_date(state, {
		require_neighbors_hints: false,
		require_notes: false,
	})).to.be.true

	return enforce_immutability(state)
}

export const REAL_CREATION_DATE = enforce_immutability(create_better_date('tz:auto', 2003, 3, 13, 23, 33, 43, 333))
export const REAL_CREATION_DATE‿HRTS = get_human_readable_timestamp_auto(REAL_CREATION_DATE, 'tz:embedded')
assert(REAL_CREATION_DATE‿HRTS === '2003-03-13_23h33m43s333', 'REAL_CREATION_DATE‿HRTS should be correct')
export const REAL_CREATION_DATE‿TMS = get_timestamp_utc_ms_from(REAL_CREATION_DATE)
const REAL_CREATION_DATE‿LEGACY = new Date(REAL_CREATION_DATE‿TMS)
export const REAL_CREATION_DATE‿EXIF = _get_exif_datetime(REAL_CREATION_DATE)

// must be OLDER yet we won't pick it
const BAD_CREATION_DATE_CANDIDATE = enforce_immutability(create_better_date('tz:auto', 2006, 6, 26, 16, 36, 46, 666))
export const BAD_CREATION_DATE_CANDIDATE‿HRTS = get_human_readable_timestamp_auto(BAD_CREATION_DATE_CANDIDATE, 'tz:embedded')
assert(BAD_CREATION_DATE_CANDIDATE‿HRTS === '2006-06-26_16h36m46s666', 'BAD_CREATION_DATE_CANDIDATE‿HRTS should be correct')
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

function get_DEFAULT_FILE_INPUTS() {
	return {
		// MUST BE FLAT

		// everything bad / undated by default, so that the tests must override those
		parent_pathⵧcurrent‿relative: 'foo' as string,
		basenameⵧcurrent: 'bar.jpg' as string,

		dateⵧfsⵧcurrent‿tms: BAD_CREATION_DATE_CANDIDATE‿TMS, // always exist
		dateⵧexif: null as null | typeof REAL_CREATION_DATE‿EXIF,
		hashⵧcurrent: 'hash01' as string,
		neighbor_hints__fs_reliability_shortcut: 'unknown' as FsReliability,
		neighbor_hints__junk_bcd: undefined as undefined | BetterDate,
		//hints_from_reliable_neighbors__current__fs_reliability: 'unknown' as FsReliability,
		//hints_from_reliable_neighbors__current__parent_folder_bcd: null as null | BetterDate,

		notes: null as null | 'auto' | Immutable<PersistedNotes>,
		// won't be used unless notes = auto
		autoǃbasename__historical: undefined as Basename | undefined,
		autoǃdate__fs_ms__historical: undefined as TimestampUTCMs | undefined,
	}
}
type FileInputs = ReturnType<typeof get_DEFAULT_FILE_INPUTS>

function _get_file_id(inputs: Immutable<FileInputs>): FileLib.FileId {
	return path.join(...[
			//...inputs.parent_pathⵧcurrent‿relative.split(path.sep),
			inputs.parent_pathⵧcurrent‿relative,
			inputs.basenameⵧcurrent,
		].filter(x => !!x) as string[])
}
function _get_auto_notes(inputs: Immutable<FileInputs>): PersistedNotes {
	return {
		_currently_known_as: 'whatever, write-only.xyz',
		_bcd_afawk‿symd: undefined,
		_bcd_source: undefined,

		// TODO one day: test that (when implemented)
		deleted: undefined,
		starred: undefined,
		manual_date: undefined,

		historical: {
			basename: inputs.autoǃbasename__historical ?? 'original' + path.parse(inputs.basenameⵧcurrent).ext, // extensions should match,
			parent_path: 'original_parent_path',
			fs_bcd_tms: inputs.autoǃdate__fs_ms__historical ?? BAD_CREATION_DATE_CANDIDATE‿TMS,
			neighbor_hints: (() => {
				return {
					// empty, happens
				}
			})(),
		},
	}
}
function _get_auto_fs_stats(inputs: Immutable<FileInputs>): FsStatsSubset {
	return {
		birthtimeMs: inputs.dateⵧfsⵧcurrent‿tms,
		atimeMs:     inputs.dateⵧfsⵧcurrent‿tms + 10000,
		mtimeMs:     inputs.dateⵧfsⵧcurrent‿tms + 10000,
		ctimeMs:     inputs.dateⵧfsⵧcurrent‿tms + 10000,
	}
}
function _get_auto_exif_data(inputs: Immutable<FileInputs>): EXIFTags {
	const exif_data = {
		SourceFile: _get_file_id(inputs),
		...(inputs.dateⵧexif && {
			// may be exif powered without the info we need
			'CreateDate': inputs.dateⵧexif,
			//'DateTimeOriginal': inputs.dateⵧexif,
			//'DateTimeGenerated': inputs.dateⵧexif,
			//'MediaCreateDate': inputs.dateⵧexif,
			// TODO exif orientation
		} as EXIFTags),
	}
	//console.log('_get_auto_exif_data() EXIFTags', exif_data)
	return exif_data
}

export function get_test_single_file_state_generator(stategen_to_copy?: Immutable<any>) {
	const DEFAULT_FILE_INPUTS = get_DEFAULT_FILE_INPUTS()
	const inputs: FileInputs = {
		...DEFAULT_FILE_INPUTS,
		...(stategen_to_copy?.inputs),
	}

	function reset() {
		const expected_keys = Object.keys(DEFAULT_FILE_INPUTS)
		//console.log(expected_keys)
		Object.keys(inputs).forEach(k => {
			if (!expected_keys.includes(k))
				throw new Error(`Incorrect key "${k}" stategen input!`)
		})
		Object.keys(DEFAULT_FILE_INPUTS).forEach(k => {
			;(inputs as any)[k] = (DEFAULT_FILE_INPUTS as any)[k]
		})
	}

	function create_test_file_state(up_to: 'phase-1' | 'phase-2' = 'phase-2'): Immutable<FileLib.State> {
		//console.log('create_test_file_state()', inputs)
		const id = _get_file_id(inputs)
		let state = FileLib.create(id)

		state = FileLib.on_info_read__fs_stats(state, _get_auto_fs_stats(inputs))
		if (FileLib.is_exif_powered_media_file(state)) {
			state = FileLib.on_info_read__exif(state, _get_auto_exif_data(inputs))
		}
		state = FileLib.on_info_read__hash(state, inputs.hashⵧcurrent)

		if (up_to == 'phase-2') {
			// simulate consolidation
			state = FileLib.on_info_read__current_neighbors_primary_hints(
				state,
				FileLib.NeighborHintsLib._createⵧfor_ut({
					reliability_shortcut:inputs.neighbor_hints__fs_reliability_shortcut,
					junk_bcd: inputs.neighbor_hints__junk_bcd,
				})
			)

			let notes: null | Immutable<PersistedNotes> = (() => {
				const notes = JSON.parse(JSON.stringify(
					inputs.notes === 'auto'
						? _get_auto_notes(inputs)
						: inputs.notes
				)) as PersistedNotes
				if (notes)
					notes._currently_known_as = inputs.basenameⵧcurrent
				return notes
			})()
			state = FileLib.on_notes_recovered(state, notes)
		}

		return state
	}

	return {
		DEFAULT_INPUTS: DEFAULT_FILE_INPUTS,
		inputs,
		reset,
		create_state: create_test_file_state,
		get_phase1_state: () => create_test_file_state('phase-1'),
		get_phase2_state: create_test_file_state,
	}
}

export function get_test_single_file_DB_state_generator() {
	const DEFAULT_FILE_INPUTS = get_DEFAULT_FILE_INPUTS()
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

	function get_file_id(): FileLib.FileId {
		return _get_file_id(inputs.file)
	}

	function create_test_db_state(): Immutable<DB.State> {
		const file_id = get_file_id()

		let state = DB.create('root')

		function _get_file_state(): Immutable<FileLib.State> {
			return state.files[file_id]
		}

		state = DB.on_folder_found(state, '', '.')
		const parent_splitted = inputs.file.parent_pathⵧcurrent‿relative.split(path.sep)
		for (let i = 0; i < parent_splitted.length; ++i) {
			const parent_subpath = path.join(...parent_splitted.slice(0, i))
			const basename = path.join(...parent_splitted.slice(i, i+1))
			state = DB.on_folder_found(state, parent_subpath, basename)
		}

		state = DB.on_file_found(state, '.', file_id)

		state = DB.on_hash_computed(state, file_id, inputs.file.hashⵧcurrent)
		state = DB.on_fs_stats_read(state, file_id, _get_auto_fs_stats(inputs.file))
		if (FileLib.is_exif_powered_media_file(_get_file_state())) {
			state = DB.on_exif_read(state, file_id, _get_auto_exif_data(inputs.file))
		}

		let notes = null as null | Immutable<Notes.State>
		if (inputs.file.notes === 'auto') {
			notes = Notes.create('test')
			notes = {
				...notes,
				encountered_files: {
					...notes.encountered_files,
					[inputs.file.hashⵧcurrent]: _get_auto_notes(inputs.file),
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
