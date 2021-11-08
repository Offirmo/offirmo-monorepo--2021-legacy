import path from 'path'

import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Tags } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { prettify_json } from '@offirmo-private/prettify-any'
import { get_base_loose, enforce_immutability } from '@offirmo-private/state-utils'

import { LIB as APP } from '../../consts'
import { AbsolutePath, RelativePath, SimpleYYYYMMDD } from '../../types'
import { Action, ActionType } from '../actions'
import * as Actions from '../actions'
import { FileHash } from '../../services/hash'
import { FsStatsSubset } from '../../services/fs_stats'
import { get_file_basename_without_copy_index } from '../../services/name_parser'
import {
	get_compact_date,
	get_day_of_week_index,
	add_days,
	get_debug_representation,
} from '../../services/better-date'
import logger from '../../services/logger'

import * as Folder from '../folder'
import * as File from '../file'
import * as Notes from '../notes'
import { FolderId, get_event_end_date‿symd, get_event_range } from '../folder'
import { FileId, PersistedNotes } from '../file'
import { get_params } from '../../params'

import { LIB } from './consts'
import {	State } from './types'
import {
	get_past_and_present_notes,
	get_all_files_except_meta,
	get_all_folders,
	get_all_media_files,
	get_file_ids_by_hash,
	get_all_files,
	get_all_event_folder_ids,
	get_all_file_ids,
	get_ideal_file_relative_path,
} from './selectors'

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
	logger.trace(`${LIB} _enqueue_action(…)`, action.type === ActionType.persist_notes ? { type: ActionType.persist_notes } : action)

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
	// TODO assert normalized?

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

////////

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
	// TODO assert normalized?
	// TODO assert not present?

	const file_state = File.create(id)
	const folder_id = File.get_current_parent_folder_id(file_state)
	const old_folder_state = state.folders[folder_id]
	if (!old_folder_state) {
		console.error('imminent error', state)
	}
	assert(old_folder_state, `on_file_found() should have folder state for "${folder_id}"`)
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

	const is_notes = File.is_notes(file_state)
	const is_media_file = File.is_media_file(file_state)

	if (is_notes) {
		state = _enqueue_action(state, Actions.create_action_load_notes(path.join(parent_id, sub_id)))
		logger.verbose(`${ LIB } found notes from a previous sorting`, {id})
	}
	else {
		// always, for dedupe
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
export function on_note_file_found(state: Immutable<State>, raw_data: any): Immutable<State> {
	logger.trace(`${LIB} on_notes_found(…)`, { base: get_base_loose(raw_data) })
	logger.verbose(`${LIB} found previous notes about the files`)

	const recovered_data = Notes.migrate_to_latest(raw_data)

	return {
		...state,
		extra_notes: Notes.on_previous_notes_found(state.extra_notes, recovered_data),
	}
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

	return state
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

	return state
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

	return state
}

///////

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
function _consolidate_and_propagate_neighbor_hints(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _consolidate_and_propagate_neighbor_hints()…`)

	// iterate over ALL files to consolidate their immediate data into their parent folders
	let folders = { ...state.folders }
	get_all_files_except_meta(state).forEach((file_state) => {
		const parent_folder_id = File.get_current_parent_folder_id(file_state)
		assert(folders[parent_folder_id], `${LIB} _consolidate_and_propagate_neighbor_hints() should have folder state`)

		folders[parent_folder_id] = Folder.on_subfile_primary_infos_gathered(folders[parent_folder_id], file_state)
	})
	state = { ...state, folders }

	// folders now have consolidated hints
	// debug
	get_all_folders(state).forEach(folder_state => {
		const consolidated_neighbor_hints = Folder.get_neighbor_primary_hints(folder_state)
		logger.info(`Folder "${folder_state.id}" neighbor hints have been consolidated`, consolidated_neighbor_hints)

		const reliability = File.NeighborHintsLib.get_neighbors_fs_reliability(consolidated_neighbor_hints)
		const log_func = (reliability === 'unreliable')
			? logger.error
			: (reliability === 'unknown')
				? logger.warn
				: logger.info
		log_func(`Folder "${folder_state.id}" fs reliability has been estimated as ${String(reliability).toUpperCase()}`, {
			stats: folder_state.children_fs_reliability_count,
		})
	})

	// flow the hints back to every files
	let files = { ...state.files }
	get_all_files_except_meta(state).forEach(file_state => {
		const parent_folder_id = File.get_current_parent_folder_id(file_state)

		files[file_state.id] = File.on_info_read__current_neighbors_primary_hints(
			file_state,
			Folder.get_neighbor_primary_hints(folders[parent_folder_id]),
		)
	})
	state = { ...state, files }

	return state
}
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

	return state
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

	get_all_files_except_meta(state).forEach(file_state => {
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
function _consolidate_folders_by_demoting_and_de_overlapping(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _consolidate_folders_by_demoting_and_de_overlapping()…`)

	// files are now fully informed:
	// 1. primary, current data
	// 2. current neighbor hints XXX TODO review!!!
	// 3. historical data from notes
	// Time to flow back the data into the folders to inform the event-ness and the event range

	// iterate over ALL files to consolidate their immediate data into their parent folders
	let folders = { ...state.folders }
	get_all_files(state).forEach((file_state) => {
		const parent_folder_id = File.get_current_parent_folder_id(file_state)
		assert(folders[parent_folder_id], `${LIB} _consolidate_folders_by_demoting_and_de_overlapping() should have folder state`)

		folders[parent_folder_id] = Folder.on_subfile_all_infos_gathered(folders[parent_folder_id], file_state)
	})
	state = { ...state, folders }

	function _on_any_file_info_read(state: Immutable<State>, file_id: FileId): Immutable<State> {
		const file_state = state.files[file_id]

		if (File.is_media_file(file_state) && File.has_all_infos_for_extracting_the_creation_date(file_state, { should_log: false, require_neighbors_hints: false })) {
			// update folder date range
			const folder_id = File.get_current_parent_folder_id(file_state)
			const old_folder_state = state.folders[folder_id]
			assert(old_folder_state, `folder state for "${folder_id}" - "${file_id}"!`)
			const new_folder_state = Folder.on_subfile_primary_infos_gathered(old_folder_state, file_state)
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


	// demote event folders with no dates
	folders = { ...state.folders }
	let all_event_folder_ids = get_all_event_folder_ids(state)
	all_event_folder_ids.forEach(id => {
		const folder = folders[id]
		if (!get_event_range(folder)) {
			folders[id] = Folder.demote_to_unknown(folder, 'no event range')
		}
	})
	state = { ...state, folders }


	// demote non-canonical or overlapping folder events but create the canonical ones
	all_event_folder_ids = get_all_event_folder_ids(state)
	// first get all the start dates + demote conflictings
	const event_folders_by_start_date‿symd = all_event_folder_ids.reduce((acc, id) => {
		const candidate_folder_state = folders[id]
		const start_date = Folder.get_event_begin_date(candidate_folder_state)
		const start_date‿symd = Folder.get_event_begin_date‿symd(candidate_folder_state)
		const existing_folder_state = acc[start_date‿symd]
		acc[start_date‿symd] = (() => {
			if (!existing_folder_state)
				return candidate_folder_state

			const is_existing_intentful = Folder.is_current_basename_intentful_of_event_start(existing_folder_state)
			const is_candidate_intentful = Folder.is_current_basename_intentful_of_event_start(candidate_folder_state)
			if (is_existing_intentful !== is_candidate_intentful) {
				// demote the non-intentful one
				if (!is_candidate_intentful) {
					folders[existing_folder_state.id] = Folder.demote_to_unknown(existing_folder_state, 'conflicting: non canonical')
					return candidate_folder_state
				}

				folders[candidate_folder_state.id] = Folder.demote_to_unknown(candidate_folder_state, 'conflicting: non canonical')
				return existing_folder_state
			}

			// same canonical status...
			// the shortest one wins
			const existing_range_size = get_event_end_date‿symd(existing_folder_state) - start_date‿symd
			const candidate_range_size = get_event_end_date‿symd(candidate_folder_state) - start_date‿symd
			if (candidate_range_size === existing_range_size) {
				// perfect match, demote the competing one
				folders[candidate_folder_state.id] = Folder.demote_to_overlapping(candidate_folder_state)
			}
			return existing_range_size <= candidate_range_size
				? existing_folder_state
				: candidate_folder_state
		})()

		return acc
	}, {} as { [start: number]: Immutable<Folder.State> })

	// then remove overlaps
	const ordered_start_dates‿symd: SimpleYYYYMMDD[] = Object.keys(event_folders_by_start_date‿symd).map(k => Number(k)).sort()
	ordered_start_dates‿symd.forEach((start_date: SimpleYYYYMMDD, index: number) => {
		const folder_state = event_folders_by_start_date‿symd[start_date]
		const next_start_date‿symd = ordered_start_dates‿symd[index + 1]
		if (next_start_date‿symd) {
			if (next_start_date‿symd <= get_event_end_date‿symd(folder_state))
				folders[folder_state.id] = Folder.on_overlap_clarified(folder_state, next_start_date‿symd - 1)
		}
	})

	return state
}
export function on_fs_exploration_done_consolidate_data_and_backup_originals(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} on_fs_exploration_done_consolidate_data_and_backup_originals()…`)
	logger.verbose(`${LIB} Exploration of the file system done, now processing this data with handcrafted AI…`)

	// order is important
	state = _consolidate_and_propagate_neighbor_hints(state)
	state = _consolidate_notes_between_persisted_regenerated_and_duplicates(state)
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

	const all_files = get_all_files_except_meta(state)
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

	state = _enqueue_action(state, Actions.create_action_ensure_folder(Folder.SPECIAL_FOLDERⵧINBOX__BASENAME))
	state = _enqueue_action(state, Actions.create_action_ensure_folder(Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME))
	state = _enqueue_action(state, Actions.create_action_ensure_folder(Folder.SPECIAL_FOLDERⵧCANT_RECOGNIZE__BASENAME))

	const years = new Set<number>()
	get_all_media_files(state).forEach(file_state => {
		const year = File.get_best_creation_date__year(file_state)
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
		if (folder_state.id === Folder.SPECIAL_FOLDERⵧINBOX__BASENAME) return

		state = _enqueue_action(state, Actions.create_action_delete_folder_if_empty(folder_state.id))
	})

	return state
}
