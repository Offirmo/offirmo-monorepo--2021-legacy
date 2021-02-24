import path from 'path'

import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Tags } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { prettify_json } from '@offirmo-private/prettify-any'
import { get_base_loose, enforce_immutability } from '@offirmo-private/state-utils'

import { NOTES_BASENAME_SUFFIX, LIB as APP } from '../consts'
import { AbsolutePath, RelativePath, SimpleYYYYMMDD } from '../types'
import { Action } from './actions'
import * as Actions from './actions'
import { FileHash } from '../services/hash'
import { FsStatsSubset } from '../services/fs_stats'
import { get_file_basename_without_copy_index } from '../services/name_parser'
import {
	get_compact_date,
	get_day_of_week_index,
	add_days,
} from '../services/better-date'
import logger from '../services/logger'

import * as Folder from './folder'
import * as File from './file'
import * as Notes from './notes'
import { FolderId } from './folder'
import { FileId, PersistedNotes } from './file'
import { get_params } from '../params'


/////////////////////

const LIB = '🗄 ' // iTerm has the wrong width 2020/12/15

/////////////////////

export interface State {
	root: AbsolutePath

	extra_notes: Notes.State,
	folders: { [id: string /* FolderId */]: Folder.State }
	files: { [id: string /* FileId */]: File.State }

	encountered_hash_count: {
		[hash: string /* FileHash */]: number
	}

	queue: Action[],
	notes_save_required: boolean // TODO finish implementation

	_optim: {
	}
}

///////////////////// ACCESSORS /////////////////////

export function get_absolute_path(state: Immutable<State>, id: RelativePath): AbsolutePath {
	return path.join(state.root, id)
}

export function has_pending_actions(state: Immutable<State>): boolean {
	return state.queue.length > 0
}

export function get_first_pending_action(state: Immutable<State>): Action {
	if (!has_pending_actions(state))
		throw new Error('No more pending actions!')

	return state.queue[0]
}

export function get_pending_actions(state: Immutable<State>): Immutable<Action>[] {
	return [...state.queue]
}

function get_all_folders(state: Immutable<State>): Immutable<Folder.State>[] {
	return Object.values(state.folders)
}

export function get_max_folder_depth(state: Immutable<State>): number {
	return get_all_folders(state).reduce((acc, folder_state) => {
		const depth = Folder.get_depth(folder_state)
		return Math.max(acc, depth)
	}, 0)
}

export function get_all_folder_ids(state: Immutable<State>): string[] {
	return Object.keys(state.folders)
		.sort()
}

export function get_all_event_folder_ids(state: Immutable<State>): string[] {
	return get_all_folder_ids(state)
		.filter(k => state.folders[k].type === Folder.Type.event)
		//.sort((a, b) => state.folders[a].begin_date_symd! - state.folders[b].begin_date_symd!)
}

function get_all_files(state: Immutable<State>): Immutable<File.State>[] {
	return Object.values(state.files)
}

export function get_all_file_ids(state: Immutable<State>): string[] {
	return Object.keys(state.files)
		.sort()
}

export function get_all_files_except_notes(state: Immutable<State>): Immutable<File.State>[] {
	return get_all_files(state)
		.filter(state => !File.is_notes(state))
}

export function get_all_media_files(state: Immutable<State>): Immutable<File.State>[] {
	return get_all_files(state)
		.filter(s => File.is_media_file(s))
}

export function get_all_media_file_ids(state: Immutable<State>): string[] {
	return get_all_media_files(state)
		.map(s => s.id)
}

export function is_file_existing(state: Immutable<State>, id: FileId): boolean {
	return state.files.hasOwnProperty(id)
}

// beware of unknown OS path normalization!
export function is_folder_existing(state: Immutable<State>, id: FolderId): boolean {
	return state.folders.hasOwnProperty(id)
}

function _event_folder_matches(folder_state: Immutable<Folder.State>, compact_date: SimpleYYYYMMDD): boolean {
	return true
		&& !!folder_state.event_begin_date_symd
		&& !!folder_state.event_end_date_symd
		&& compact_date >= folder_state.event_begin_date_symd
		&& compact_date <= folder_state.event_end_date_symd
}

export function get_ideal_file_relative_folder(state: Immutable<State>, id: FileId): RelativePath {
	logger.trace(`get_ideal_file_relative_folder()`, { id })
	const DEBUG = true

	if (id === NOTES_BASENAME_SUFFIX) // todo use selector
		return '' // TODO improve. Should this even be called?

	const file_state = state.files[id]
	const current_parent_folder_id: FolderId = File.get_current_parent_folder_id(file_state)
	assert(is_folder_existing(state, current_parent_folder_id), `get_ideal_file_relative_folder() current parent folder exists "${current_parent_folder_id}"`)
	const top_parent_id: FolderId = File.get_current_top_parent_folder_id(file_state)
	const is_top_parent_special = Folder.SPECIAL_FOLDERS__BASENAMES.includes(top_parent_id)
	const current_parent_folder_state = state.folders[current_parent_folder_id]

	logger.trace(`get_ideal_file_relative_folder() processing…`, {
		top_parent: top_parent_id,
		is_top_parent_special,
		parent_folder_type: current_parent_folder_state.type,
		is_media_file: File.is_media_file(file_state),
	})

	// whatever the file, is it already in an event folder? (= already sorted)
	switch(current_parent_folder_state.type) {
		case Folder.Type.event: {
			// if it's in an event folder
			// we assume it's sorted already and keep it that way
			const event_folder_base = Folder.get_ideal_basename(current_parent_folder_state)
			const year = String(Folder.get_event_begin_year(current_parent_folder_state))

			DEBUG && console.log(`✴️ ${id} already in event`)
			return path.join(year, event_folder_base)
		}

		case Folder.Type.overlapping_event: {
			// if it was in an event folder
			// we keep it into the corresponding event folder
			// UNLESS the file date doesn't match the current folder (happens with force-dated folders with big ranges = ex. a 6 month iphone import)
			const date_for_finding_suitable_event: SimpleYYYYMMDD = (() => {
				if (File.is_confident_in_date(file_state, 'secondary'))
					return File.get_best_creation_date_compact(file_state)

				return Folder.get_event_begin_date(current_parent_folder_state)
			})()

			let compatible_event_folder_id = get_all_event_folder_ids(state)
				.find(fid => _event_folder_matches(state.folders[fid], date_for_finding_suitable_event))
			if (!compatible_event_folder_id) {
				// can happen if the folder is force-dated
				// but the file date is reliable and don't match
				logger.warn(`File was in an overlapped event but couldn't find a matching event`, {
					id,
					parent_folder_type: current_parent_folder_state.type,
					date_for_finding_suitable_event,
				})
			}
			else {
				const event_folder_base = Folder.get_ideal_basename(state.folders[compatible_event_folder_id])

				const year = String(Folder.get_event_begin_year(state.folders[compatible_event_folder_id]))

				DEBUG && console.log(`✴️ ${id} in overlapping`, {
					confidence: File.is_confident_in_date(file_state, 'secondary'),
					file_date: File.get_best_creation_date_compact(file_state),
					date_for_finding_suitable_event,
				})
				return path.join(year, event_folder_base)
			}
			break
		}

		default:
			break
	}

	if (!File.is_media_file(file_state)) {
		let target_split_path = File.get_current_relative_path(file_state).split(path.sep).slice(0, -1)
		if (is_top_parent_special)
			target_split_path[0] = Folder.SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME
		else
			target_split_path.unshift(Folder.SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME)
		logger.warn(`Unfortunately can't manage to recognize a file :-(`, {
			id,
			parent_folder_type: current_parent_folder_state.type,
			//current_parent_folder_state,
		})
		DEBUG && console.log(`✴️ ${id} can't sort`)
		return path.join(target_split_path.join(path.sep))
	}

	// file is a media
	if (!File.is_confident_in_date(file_state, 'secondary')) {
		let target_split_path = File.get_current_relative_path(file_state).split(path.sep).slice(0, -1)
		if (is_top_parent_special)
			target_split_path[0] = Folder.SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME
		else
			target_split_path.unshift(Folder.SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME)
		DEBUG && console.log(`✴️ ${id} really not confident`)
		logger.warn(`Unfortunately really not confident about the date of a file :-(`, {
			id,
			parent_folder_type: current_parent_folder_state.type,
		})
		return target_split_path.join(path.sep)
	}

	// file is a media + we have reasonable confidence
	const year = String(File.get_best_creation_year(file_state))
	const event_folder_base = ((): string => {
		const compact_date = File.get_best_creation_date_compact(file_state)
		const all_events_folder_ids = get_all_event_folder_ids(state)
		let compatible_event_folder_id = all_events_folder_ids.find(fid => _event_folder_matches(state.folders[fid], compact_date))
		if (compatible_event_folder_id)
			return Folder.get_ideal_basename(state.folders[compatible_event_folder_id])

		// need to create a new event folder!
		// We don't group too much, split day / wek-end
		let folder_date = File.get_best_creation_date(file_state)
		if (get_day_of_week_index(folder_date) === 0) {
			// sunday is coalesced to sat = start of weekend
			folder_date = add_days(folder_date, -1)
		}

		// TODO use the existing parent folder as a base hint anyway

		return String(get_compact_date(folder_date, 'tz:embedded')) + ' - ' + (get_day_of_week_index(folder_date) === 6 ? 'weekend' : 'life')
	})()

	DEBUG && console.log(`✴️ ${id} found event`)
	return path.join(year, event_folder_base)
}

export function get_ideal_file_relative_path(state: Immutable<State>, id: FileId): RelativePath {
	logger.trace(`get_ideal_file_relative_path()`, { id })

	if (id === NOTES_BASENAME_SUFFIX) // todo use selector
		return id // todo should this even be called?

	const file_state = state.files[id]

	let ideal_basename = File.get_ideal_basename(file_state)
	if (!get_params().dry_run) {
		const current_basename = File.get_current_basename(file_state)
		const current_basename_cleaned = get_file_basename_without_copy_index(current_basename)
		assert(current_basename_cleaned === ideal_basename, `get_ideal_file_relative_path() file should already have been normalized in place! ideal="${ideal_basename}" vs current(no copy index)="${current_basename_cleaned}" from "${current_basename}"`)
	}

	return path.join(get_ideal_file_relative_folder(state, id), ideal_basename)
}

export function get_past_and_present_notes(state: Immutable<State>, folder_path?: RelativePath): Immutable<Notes.State> {
	assert(!folder_path, `get_past_and_present_notes() by folder = NIMP!`)

	let result = enforce_immutability(Notes.create('for persisting', state.extra_notes))

	const encountered_files = {
		...result.encountered_files,
	}

	get_all_media_files(state)
		.forEach(file_state => {
			assert(file_state.current_hash, `get_past_and_present_notes() should happen on hashed files`)
			// check the original, no the one we're refilling. 2x files may have the same hash
			assert(!state.extra_notes.encountered_files[file_state.current_hash], `get_past_and_present_notes() no redundant data ` + file_state.current_hash)
			encountered_files[file_state.current_hash] = file_state.notes
		})

	result = {
		...result,
		encountered_files,
	}

	//logger.info(`get_past_and_present_notes(): ` + Notes.to_string(result))
	return result
}

export function get_file_ids_by_hash(state: Immutable<State>): { [hash: string]: FileId[] } {
	/*const duplicated_hashes: Set<FileHash> = new Set<FileHash>(
		Object.entries(state.encountered_hash_count)
			.filter(([ hash, count ]) => count > 1)
			.map(([ hash ]) => hash)
	)*/

	const file_ids_by_hash = get_all_file_ids(state)
		.reduce((acc, file_id) => {
			const file_state = state.files[file_id]
			const hash = File.get_hash(file_state)

			if (!hash) {
				// happens for some special files such as notes. TODO clarify
			}
			else {
				acc[hash] ??= []
				acc[hash].push(file_id)
			}
			return acc
		}, {} as { [hash: string]: FileId[] })

	/*const duplicate_original_basenames_by_hash: { [hash: string]: FileId[] } = get_all_file_ids(state)
		.reduce((acc, file_id) => {
			const file_state = state.files[file_id]
			const hash = File.get_hash(file_state)
			if (hash && duplicated_hashes.has(hash)) {
				acc[hash] ??= []
				acc[hash].push(file_state.extra_notes.original.basename)
			}
			return acc
		}, {} as { [hash: string]: string[] })

	console.log({ duplicate_file_ids_by_hash, duplicate_original_basenames_by_hash })*/

	return file_ids_by_hash
}

///////////////////// REDUCERS /////////////////////

export function create(root: AbsolutePath): Immutable<State> {
	logger.trace(`${LIB} create(…)`, { root })

	let state: State = {
		root,
		extra_notes: Notes.create('substate'),
		folders: {},
		files: {},

		encountered_hash_count: {},

		queue: [],
		notes_save_required: false,

		_optim: {
		}
	}

	return state
}

function _enqueue_action(state: Immutable<State>, action: Action): Immutable<State> {
	logger.trace(`${LIB} _enqueue_action(…)`, action)

	return {
		...state,
		queue: [
			...state.queue,
			action,
		],
	}
}

export function discard_first_pending_action(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} discard_first_pending_action(…)`, { action: state.queue[0] })

	return {
		...state,
		queue: state.queue.slice(1),
	}
}

export function discard_all_pending_actions(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} discard_all_pending_action(…)`, { action_count: state.queue.length })

	return {
		...state,
		queue: [],
	}
}

function _register_folder(state: Immutable<State>, id: FolderId): Immutable<State> {
	assert(!state.folders[id], `_register_folder("${id}"): should not already exist`)

	const folder_state = Folder.create(id)

	state = {
		...state,
		folders: {
			...state.folders,
			[id]: folder_state,
		},
	}

	logger.trace(`${LIB} _register_folder()`, { id, type: folder_state.type })

	return state
}

export function on_folder_found(state: Immutable<State>, parent_id: RelativePath, sub_id: RelativePath): Immutable<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`${LIB} on_folder_found(…)`, { parent_id, sub_id, id })
	logger.verbose(`${LIB} found a folder`, { id })

	state = _register_folder(state, id)

	state = _enqueue_action(state, Actions.create_action_explore_folder(id))

	return state
}

export function on_file_found(state: Immutable<State>, parent_id: RelativePath, sub_id: RelativePath): Immutable<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`${LIB} on_file_found(…)`, { parent_id, sub_id, id })

	const file_state = File.create(id)
	const folder_id = File.get_current_parent_folder_id(file_state)
	const old_folder_state = state.folders[folder_id]
	const new_folder_state = Folder.on_subfile_found(old_folder_state, file_state)

	state = {
		...state,
		files: {
			...state.files,
			[id]: file_state,
		},
		folders: {
			...state.folders,
			[folder_id]: new_folder_state,
		},
	}

	const is_notes = sub_id === NOTES_BASENAME_SUFFIX // todo use selector
	const is_media_file = File.is_media_file(file_state)

	if (is_notes) {
		state = _enqueue_action(state, Actions.create_action_load_notes(path.join(parent_id, sub_id)))
		logger.verbose(`${ LIB } found notes from a previous sorting`, {id})
	}
	else {
		// always, for dedupe (fs used to identify the earliest copy)
		state = _enqueue_action(state, Actions.create_action_hash(id))
		state = _enqueue_action(state, Actions.create_action_query_fs_stats(id))

		if (is_media_file) {
			logger.verbose(`${ LIB } found a media file`, {id})

			if(File.is_exif_powered_media_file(file_state))
				state = _enqueue_action(state, Actions.create_action_query_exif(id))

			// did we already recover notes for this file?
			// can't tell yet, we need the hash for that!
		} else {
			logger.verbose(`${ LIB } found a NON media file`, {id})
		}
	}

	return state
}

// called by Actions.create_action_load_notes initiated by on_file_found
export function on_notes_found(state: Immutable<State>, raw_data: any): Immutable<State> {
	logger.trace(`${LIB} on_notes_found(…)`, get_base_loose(raw_data))
	logger.verbose(`${LIB} found previous notes about the files`)

	const recovered_data = Notes.migrate_to_latest(raw_data)

	return {
		...state,
		extra_notes: Notes.on_previous_notes_found(state.extra_notes, recovered_data),
	}
}

function _on_any_file_info_read(state: Immutable<State>, file_id: FileId): Immutable<State> {
	const file_state = state.files[file_id]

	if (File.is_media_file(file_state) && File.has_all_infos_for_extracting_the_creation_date(file_state, { should_log: false, require_neighbors_hints: false })) {
		// update folder date range
		const folder_id = File.get_current_parent_folder_id(file_state)
		const old_folder_state = state.folders[folder_id]
		assert(old_folder_state, `folder state for "${folder_id}" - "${file_id}"!`)
		const new_folder_state = Folder.on_dated_subfile_found(old_folder_state, file_state)
		state = {
			...state,
			folders: {
				...state.folders,
				[folder_id]: new_folder_state,
			},
		}
	}

	return state
}

export function on_fs_stats_read(state: Immutable<State>, file_id: FileId, stats: Immutable<FsStatsSubset>): Immutable<State> {
	logger.trace(`${LIB} on_fs_stats_read(…)`, { file_id })

	const new_file_state = File.on_info_read__fs_stats(state.files[file_id], stats)

	state = {
		...state,
		files: {
			...state.files,
			[file_id]: new_file_state,
		},
	}

	return _on_any_file_info_read(state, file_id)
}

export function on_exif_read(state: Immutable<State>, file_id: FileId, exif_data: Immutable<Tags>): Immutable<State> {
	logger.trace(`${LIB} on_exif_read(…)`, { file_id })

	const new_file_state = File.on_info_read__exif(state.files[file_id], exif_data)

	state = {
		...state,
		files: {
			...state.files,
			[file_id]: new_file_state,
		},
	}

	return _on_any_file_info_read(state, file_id)
}

export function on_hash_computed(state: Immutable<State>, file_id: FileId, hash: FileHash): Immutable<State> {
	logger.trace(`${LIB} on_hash_computed(…)`, { file_id })

	let new_file_state = File.on_info_read__hash(state.files[file_id], hash)

	if (File.is_media_file(new_file_state)) {
		// since we now have the hash, we can recover notes if any
		// NO we could have several notes files, let's wait until consolidation
	}

	state = {
		...state,
		encountered_hash_count: {
			...state.encountered_hash_count,
			[hash]: (state.encountered_hash_count[hash] ?? 0) + 1,
		},
		files: {
			...state.files,
			[file_id]: new_file_state,
		},
	}

	return _on_any_file_info_read(state, file_id)
}


export function on_file_moved(state: Immutable<State>, id: RelativePath, target_id: RelativePath): Immutable<State> {
	logger.trace(`${LIB} on_file_moved(…)`, { id, target_id })

	assert(id !== target_id, 'on_file_moved(): should be an actual move!')
	assert(state.files[id], 'on_file_moved() file state: src should exist')
	assert(!state.files[target_id], 'on_file_moved() file state: target should no already exist')

	// todo inc/dec folders

	let file_state = state.files[id]
	file_state = File.on_moved(file_state, target_id)

	let files: { [id: string]: Immutable<File.State> } = {
		...state.files
	}
	delete files[id]
	files[target_id] = file_state

	state = {
		...state,
		files,
	}

	return state
}

export function on_file_deleted(state: Immutable<State>, id: FileId): Immutable<State> {
	logger.trace(`${LIB} on_file_deleted(…)`, { id })

		// todo dec folders

	let file_state = state.files[id]
	assert(file_state, 'on_file_deleted() file state')

	let files = {
		...state.files
	}
	delete files[id]

	return {
		...state,
		files,
	}
}

export function on_folder_deleted(state: Immutable<State>, id: FolderId): Immutable<State> {
	logger.trace(`${LIB} on_folder_deleted(…)`, { id })

	let folder_state = state.folders[id]
	assert(folder_state, 'on_folder_deleted() target state')

	let folders = {
		...state.folders
	}
	delete folders[id]

	return {
		...state,
		folders,
	}
}

///////////////////// REDUCERS -> ACTIONS /////////////////////

export function explore_fs_recursively(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} explore_fs_recursively()…`)
	logger.verbose(`${LIB} Starting exploration of the file system…`)

	return on_folder_found(state, '', '.')
}

export function backup_notes(state: Immutable<State>): Immutable<State> {
	const folder_path = undefined
	state = _enqueue_action(state, Actions.create_action_persist_notes(get_past_and_present_notes(state, folder_path), folder_path))
	state = {
		...state,
		notes_save_required: false,
	}

	return state
}

// some decisions need to wait for the entire exploration to be done
function _on_file_notes_recovered(state: Immutable<State>, file_id: FileId, recovered_notes: null | Immutable<PersistedNotes>): Immutable<State> {
	logger.trace(`${LIB} _on_file_notes_recovered(…)`, { file_id, has_data: !!recovered_notes })
	//console.log(`${LIB} _on_file_notes_recovered(…)`, { file_id, has_data: !!recovered_notes })

	let new_file_state = File.on_notes_recovered(
		state.files[file_id],
		recovered_notes,
	)

	state = {
		...state,
		files: {
			...state.files,
			[file_id]: new_file_state,
		},
	}

	return _on_any_file_info_read(state, file_id)
}
function _consolidate_notes_between_persisted_regenerated_and_duplicates(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _consolidate_notes_between_persisted_regenerated_and_duplicates()…`)

	// merge notes recovered from notes bkp, notes (re)generated) from fs, across all duplicates if any
	const all_media_hashes = get_all_media_files(state).reduce((acc, file_state) => {
		const { id, current_hash } = file_state
		assert(current_hash)
		acc.add(current_hash)
		return acc
	}, new Set<FileHash>())
	const file_ids_by_hash = get_file_ids_by_hash(state)

	all_media_hashes.forEach(hash => {
		logger.trace(`_consolidate_notes_between…() processing ${hash}`)

		const all_notes_for_this_hash: Array<Immutable<File.PersistedNotes>> = []

		const hash_has_restored_notes = Notes.has_notes_for_hash(state.extra_notes, hash)
		if (hash_has_restored_notes) {
			logger.trace(`- found notes`)
			all_notes_for_this_hash.push(Notes.get_file_notes_for_hash(state.extra_notes, hash)!)
		}

		const has_duplicates = file_ids_by_hash[hash].length > 1
		file_ids_by_hash[hash].forEach((id: FileId) => {
			const file_state = state.files[id]
			all_notes_for_this_hash.push(file_state.notes)
		})

		const recovered_consolidated_notes: null | Immutable<PersistedNotes> =
			(!hash_has_restored_notes && !has_duplicates)
				? null // nothing new
				: all_notes_for_this_hash.length === 1
					? all_notes_for_this_hash[0]
					: File.merge_notes(...all_notes_for_this_hash)

		file_ids_by_hash[hash].forEach((id: FileId) => {
			//if (!hash_has_restored_notes && deep equal) TODO no change = null
			state = _on_file_notes_recovered(state, id, recovered_consolidated_notes)
		})

		// can only clean after all duplicates are restored
		if (hash_has_restored_notes) {
			// clean
			state = {
				...state,
				extra_notes: Notes.on_file_notes_recovered(state.extra_notes, hash)
			}
		}
	})

	get_all_files_except_notes(state).forEach(file_state => {
		if(!File.is_media_file(file_state)) {
			state = _on_file_notes_recovered(state, file_state.id, null)
		}
	})

	return {
		...state,
		notes_save_required: true,
	}
}
/*
function _consolidate_notes_across_duplicates(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _consolidate_notes_across_duplicates()…`)

	let files: { [id: string]: Immutable<File.State> } = { ...state.files }

	Object.entries(duplicate_file_ids_by_hash).forEach(([hash, duplicates_ids]) => {
		assert(duplicates_ids.length > 1, 'consolidate_and_backup_original_data() sanity check 1')

		//console.log({duplicates_ids})
		const final_file_state = File.merge_duplicates(...duplicates_ids.map(file_id => files[file_id]))
		assert(duplicates_ids.length === state.encountered_hash_count[final_file_state.current_hash!], 'consolidate_and_backup_original_data() sanity check 2')

		// improve the notes for those duplicates
		state = _on_file_notes_recovered(state, final_file_state.id, Notes.get_file_notes_for_hash(state.extra_notes, final_file_state.current_hash!))
		// propagate them immediately across duplicates
		duplicates_ids.forEach(file_id => {
			files[file_id] = {
				...files[file_id],
				notes: cloneDeep(final_file_state.notes)
			}
		})
	})

	return {
		...state,
		files,
	}
}
*/
function _evaluate_and_propagate_reliability_of_fs_by_folders(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _evaluate_and_propagate_reliability_of_fs_by_folders()…`)

	get_all_files(state).forEach((file_state) => {
		const is_fs_reliable = File.is_current_fs_date_reliable__primary(file_state)
		if (is_fs_reliable === false) {
			logger.warn(`File "${file_state.id}" fs reliability has been estimated as FALSE`)
		}

		const parent_folder_id = File.get_current_parent_folder_id(file_state)
		let folder_state = state.folders[parent_folder_id]
		assert(folder_state, `${LIB} _evaluate_and_propagate_reliability_of_fs_by_folders() should have folder state`)

		folder_state = Folder.on_subfile_fs_reliability_assessed(folder_state, is_fs_reliable)

		state = {
			...state,
			folders: {
				...state.folders,
				[parent_folder_id]: folder_state,
			}
		}
	})

	get_all_folders(state).forEach(folder_state => {
		const reliability = Folder.are_children_fs_reliable(folder_state)
		const log_func = (reliability === false)
			? logger.error
			: (reliability === undefined)
				? logger.warn
				: logger.info
		log_func(`Folder "${folder_state.id}" fs reliability has been estimated as ${String(reliability).toUpperCase()}`, {
			stats: folder_state.children_fs_reliability_count,
		})
	})

	get_all_files(state).forEach(file_state => {
		const parent_folder_id = File.get_current_parent_folder_id(file_state)
		let folder_state = state.folders[parent_folder_id]
		const parent_folder_fs_reliability = Folder.are_children_fs_reliable(folder_state)
		file_state = File.on_info_read__current_neighbors_hints(
				file_state,
				Folder.get_reliable_children_range(folder_state),
				Folder.are_children_fs_reliable(folder_state),
			)
		state = {
			...state,
			files: {
				...state.files,
				[file_state.id]: file_state,
			}
		}
	})

	return state
}
function _consolidate_folders_by_demoting_and_de_overlapping(_state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _consolidate_folders_by_demoting_and_de_overlapping()…`)

	let folders: { [id: string]: Immutable<Folder.State> } = { ..._state.folders }

	// demote event folders with no dates
	let all_event_folder_ids = get_all_event_folder_ids(_state)
	all_event_folder_ids.forEach(id => {
		const folder = folders[id]
		if (folder.event_begin_date_symd === folder.event_end_date_symd && folder.event_begin_date_symd === undefined) {
			folders[id] = Folder.demote_to_unknown(folder, 'no date could be inferred')
		}
	})

	let state = {
		..._state,
		folders,
	}

	// demote non-canonical or overlapping folder events but create the canonical ones
	all_event_folder_ids = get_all_event_folder_ids(state)
	// first get all the start dates + demote conflictings
	const event_folders_by_start_date = all_event_folder_ids.reduce((acc, id) => {
		const folder = folders[id]
		const start_date = folder.event_begin_date_symd!
		const existing_conflicting_folder = acc[start_date]
		acc[start_date] = (() => {
			if (!existing_conflicting_folder)
				return folder

			if (Folder.is_current_basename_intentful(existing_conflicting_folder)
				&& !Folder.is_current_basename_intentful(folder)) {
				// demote the non-canonical one
				folders[folder.id] = Folder.demote_to_unknown(folder, 'conflicting: non canonical')
				return existing_conflicting_folder
			}
			if (Folder.is_current_basename_intentful(folder)
				&& !Folder.is_current_basename_intentful(existing_conflicting_folder)) {
				// demote the non-canonical one
				folders[existing_conflicting_folder.id] = Folder.demote_to_unknown(existing_conflicting_folder, 'conflicting: non canonical')
				return folder
			}

			// same canonical status...
			// the shortest one wins
			const existing_range_size = existing_conflicting_folder.event_end_date_symd! - start_date
			const candidate_range_size = folder.event_end_date_symd! - start_date
			if (candidate_range_size === existing_range_size) {
				// demote the competing one
				folders[folder.id] = Folder.demote_to_overlapping(folder)
			}
			return existing_range_size <= candidate_range_size
				? existing_conflicting_folder
				: folder
		})()

		return acc
	}, {} as { [start: number]: Immutable<Folder.State> })

	// then remove overlaps
	const ordered_start_dates: SimpleYYYYMMDD[] = Object.keys(event_folders_by_start_date).map(k => Number(k)).sort()
	ordered_start_dates.forEach((start_date: SimpleYYYYMMDD, index: number) => {
		const folder = event_folders_by_start_date[start_date]
		const next_start_date = ordered_start_dates[index + 1]
		if (next_start_date) {
			if (next_start_date <= folder.event_end_date_symd!)
				folders[folder.id] = Folder.on_overlap_clarified(folder, next_start_date - 1)
		}
	})

	return state
}
export function on_fs_exploration_done_consolidate_data_and_backup_originals(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} on_fs_exploration_done_consolidate_data_and_backup_originals()…`)
	logger.verbose(`${LIB} Exploration of the file system done, now processing this data with handcrafted AI…`)

	// order is important
	state = _consolidate_notes_between_persisted_regenerated_and_duplicates(state)
	state = _evaluate_and_propagate_reliability_of_fs_by_folders(state)
	state = _consolidate_folders_by_demoting_and_de_overlapping(state)
	state = backup_notes(state)

	return state
}

export function clean_up_duplicates(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} clean_up_duplicates()…`)
	logger.verbose(`${LIB} Detecting duplicates and cleaning the lower ranked copies…`)

	const file_ids_by_hash = get_file_ids_by_hash(state)

	const files = {
		...state.files,
	}

	Object.entries(file_ids_by_hash).forEach(([hash, file_ids]) => {
		assert(file_ids.length > 0, 'clean_up_duplicates() sanity check 1')
		if (file_ids.length === 1) return // no duplicates

		logger.verbose(`Detected ${file_ids.length} copies for ${files[file_ids[0]].current_hash}`)

		const final_file_state = File.merge_duplicates(...file_ids.map(file_id => files[file_id]))
		assert(file_ids.length === state.encountered_hash_count[final_file_state.current_hash!], 'clean_up_duplicates() sanity check 2')
		files[final_file_state.id] = final_file_state
		logger.verbose(` ↳ Selected "${final_file_state.id}" as the best to keep`)

		file_ids.forEach(file_id => {
			if (file_id === final_file_state.id) return

			logger.verbose(` ↳ Planning deletion of duplicate "${file_id}"…`)
			state = _enqueue_action(state, Actions.create_action_delete_file(file_id))
			// don't delete from state, the files are not deleted yet!
		})
	})

	state = {
		...state,
		files,
	}

	state = backup_notes(state)

	return state
}

// we even normalize non-media files, cleaning spaces and extension is still good
// TODO review? If change, review the assertion "should be already normalized"
export function normalize_files_in_place(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} normalize_files_in_place()…`)
	logger.verbose(`${LIB} Normalizing files in-place…`)

	const all_files = get_all_files_except_notes(state)
	all_files.forEach(file_state => {
		state = _enqueue_action(state, Actions.create_action_normalize_file(file_state.id))
	})

	return {
		...state,
		notes_save_required: true,
	}
}

export function ensure_structural_dirs_are_present(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} ensure_structural_dirs_are_present()…`)

	state = _enqueue_action(state, Actions.create_action_ensure_folder(Folder.SPECIAL_FOLDER__INBOX__BASENAME))
	state = _enqueue_action(state, Actions.create_action_ensure_folder(Folder.SPECIAL_FOLDER__CANT_AUTOSORT__BASENAME))
	state = _enqueue_action(state, Actions.create_action_ensure_folder(Folder.SPECIAL_FOLDER__CANT_RECOGNIZE__BASENAME))

	const years = new Set<number>()
	get_all_media_files(state).forEach(file_state => {
		const year = File.get_best_creation_year(file_state)
		years.add(year)
	})
	for(const y of years) {
		//state = _register_folder(state, String(y), false)
		state = _enqueue_action(state, Actions.create_action_ensure_folder(String(y)))
	}

	return state
}

export function move_all_files_to_their_ideal_location(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} move_all_files_to_their_ideal_location()…`)

	const all_file_ids = get_all_file_ids(state)
	all_file_ids.forEach(id => {
		if (File.is_notes(state.files[id])) return

		const target_id = get_ideal_file_relative_path(state, id)
		if (id === target_id) return

		state = _enqueue_action(state, Actions.create_action_move_file_to_ideal_location(id))
	})

	return state
}

export function delete_empty_folders_recursively(state: Immutable<State>, target_depth: number): Immutable<State> {
	logger.trace(`${LIB} delete_empty_folders_recursively(target_depth = ${target_depth})…`)
	logger.verbose(`${LIB} deleting empty folders at depth ${target_depth}…`)

	const folder_states_at_depth: Immutable<Folder.State>[] = get_all_folders(state)
		.filter(folder_state => Folder.get_depth(folder_state) === target_depth)

	folder_states_at_depth.forEach(folder_state => {
		if (folder_state.id === Folder.SPECIAL_FOLDER__INBOX__BASENAME) return

		state = _enqueue_action(state, Actions.create_action_delete_folder_if_empty(folder_state.id))
	})

	return state
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { root, folders, files, extra_notes, queue } = state

	let str = `
${stylize_string.blue.bold(`##################### ${LIB} ${APP}’s DB #####################`)}
Root: "${stylize_string.yellow.bold(root)}"
`

	const all_folder_ids = get_all_folder_ids(state)
	str += stylize_string.bold(
		`\n${stylize_string.blue('' + all_folder_ids.length)} folders:\n`,
	)
	str += all_folder_ids.map(id => Folder.to_string(folders[id])).join('\n')


	//const all_file_ids = get_all_media_file_ids(state)
	const all_file_ids = get_all_file_ids(state)
	str += stylize_string.bold(
		`\n\n${stylize_string.blue(String(all_file_ids.length))} files in ${stylize_string.blue(String(all_folder_ids.length))} folders:\n`,
	)
	str += all_file_ids.map(id => File.to_string(files[id])).join('\n')

	str += stylize_string.bold('\n\nExtra notes:') + ' (on hashes no longer existing we encountered in the past)'
	str += (Notes.to_string(extra_notes) || '\n  (none)')

	str += stylize_string.bold('\n\nAll notes:')
	str += (Notes.to_string(get_past_and_present_notes(state)) || '\n  (none)')

	str += stylize_string.bold('\n\nActions queue:')
	if (queue.length === 0) str += '\n  (empty)'
	queue.forEach(task => {
		const { type, ...details } = task
		str += `\n- pending task "${type}" ${prettify_json(details)}`
	})

	return str
}
