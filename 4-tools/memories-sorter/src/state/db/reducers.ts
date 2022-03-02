import path from 'path'

import assert from 'tiny-invariant'
import { Tags } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { get_base_loose } from '@offirmo-private/state-utils'

import { AbsolutePath, RelativePath, SimpleYYYYMMDD } from '../../types'
import { Action, ActionType } from '../actions'
import * as Actions from '../actions'
import { FileHash } from '../../services/hash'
import { FsStatsSubset } from '../../services/fs_stats'
import logger from '../../services/logger'
import { add_days_to_simple_date } from '../../services/better-date'

import * as Folder from '../folder'
import * as File from '../file'
import * as Notes from '../notes'
import { SPECIAL_FOLDERⵧCANT_RECOGNIZE__BASENAME } from '../folder'
import { FileId, PersistedNotes } from '../file'

import { LIB } from './consts'
import {	State } from './types'
import {
	get_all_files_except_meta,
	get_all_folders,
	get_all_media_files,
	get_file_ids_by_hash,
	get_all_files,
	get_all_event_folder_ids,
	get_all_file_ids,
	get_ideal_file_relative_path,
	get_all_folder_ids,
} from './selectors'
import { NOTES_BASENAME_SUFFIX_LC } from '../../consts'

///////////////////// REDUCERS /////////////////////

export function create(root: AbsolutePath): Immutable<State> {
	logger.trace(`${LIB} create(…)`, { root })

	let state: State = {
		root,
		extra_notes: Notes.create('DB.create'),
		folders: {},
		files: {},

		encountered_hash_count: {},

		queue: [],
	}

	return state
}

////////

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

export function discard_last_pending_action(state: Immutable<State>, expected_type: ActionType): Immutable<State> {
	logger.trace(`${LIB} discard_last_pending_action(…)`, { action: state.queue.slice(-1)[0] })
	assert(state.queue.slice(-1)[0].type === expected_type, `discard_last_pending_action() should have expected type`)

	return {
		...state,
		queue: state.queue.slice(0, -1),
	}
}

export function discard_all_pending_actions(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} discard_all_pending_action(…)`, { action_count: state.queue.length })

	return {
		...state,
		queue: [],
	}
}

////////

function _register_folder(state: Immutable<State>, id: Folder.FolderId, just_created: boolean = false): Immutable<State> {
	assert(!state.folders[id], `_register_folder("${id}"): should not be already registered!`)

	let folder_state = Folder.create(id)

	if (just_created && id.split(path.sep)[0] === SPECIAL_FOLDERⵧCANT_RECOGNIZE__BASENAME && folder_state.type === Folder.Type.event) {
		// important, immediately demote this folder from being an event (default state) to prevent bugs when looking for suitable event folders
		// Should only do this if we know we just created this empty folder,
		// hence it can't be an error from the user having moved valid events in the "cant sort" folder
		folder_state = Folder.demote_to_unknown(folder_state, 'cantsort')
	}

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

export function on_folder_found(state: Immutable<State>, parent_id: RelativePath, sub_id: RelativePath, just_created: boolean = false): Immutable<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`${LIB} on_folder_found(…)`, { parent_id, sub_id, id })
	logger.verbose(`${LIB} found a folder`, { id })

	state = _register_folder(state, id, just_created)

	if (!just_created) {
		state = _enqueue_action(state, Actions.create_action_explore_folder(id))
	}

	return state
}

export function on_file_found(state: Immutable<State>, parent_id: RelativePath, sub_id: RelativePath, called_from_notes_write: boolean = false): Immutable<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`${LIB} on_file_found(…)`, { parent_id, sub_id, id })
	assert(!state.files[id], `on_file_found("${id}"): should not be already registered!`)

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
		if (called_from_notes_write) {
			// no new info, we just wrote an up to date file
		}
		else {
			state = _enqueue_action(state, Actions.create_action_load_notes(path.join(parent_id, sub_id)))
			logger.verbose(`${ LIB } found notes from a previous execution of this tool`, {id})
		}
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

// REM: called by Actions.create_action_load_notes initiated by on_file_found
export function on_note_file_found(state: Immutable<State>, raw_data: any): Immutable<State> {
	logger.trace(`${LIB} on_notes_found(…)`, { base: get_base_loose(raw_data) })
	logger.verbose(`${LIB} found previous notes, processing them…`)

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
	logger.trace(`${LIB} on_hash_computed(…)`, { file_id, hash })

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

	// TODO inc/dec folders

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

	// propagate in sub-states

	// 1. file itself
	let file_state = state.files[id]
	assert(file_state, 'on_file_deleted() file state')
	let files = { ...state.files }
	delete files[id]

	// 2. parent folder (note: useless for now but never mind)
	let folder_state = state.folders[File.get_current_parent_folder_id(file_state)]
	assert(folder_state, 'on_file_deleted() folder state')
	let folders = { ...state.folders }
	folders[folder_state.id] = Folder.on_subfile_removed(folders[folder_state.id])

	// 3. derived state
	let encountered_hash_count = {
		...state.encountered_hash_count,
	}
	if (file_state.current_hash) {
		const previous_duplicate_count = state.encountered_hash_count[file_state.current_hash!]
		assert(previous_duplicate_count >= 1, `on_file_deleted() not last item`)
		encountered_hash_count[file_state.current_hash!] = previous_duplicate_count - 1

		// 4. notes
		// if this file is not a duplicate, we want to keep the notes in "extra notes"
		const is_last_known_file_with_this_hash = previous_duplicate_count === 1
		if (is_last_known_file_with_this_hash) {
			// we deleted the last instance
			// this should never happen as we only delete duplicates
			throw new Error('NIMP last duplicate!')
		}
	}

	return {
		...state,
		files,
		folders,
		encountered_hash_count,
	}
}

export function on_folder_deleted(state: Immutable<State>, id: Folder.FolderId): Immutable<State> {
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

export function backup_notes(state: Immutable<State>, mode: 'mode:intermediate' | 'mode:final'): Immutable<State> {
	state = _enqueue_action(state, Actions.create_action_persist_notes('.'))

	if (mode === 'mode:final') {
		const year_folder_states = get_all_folders(state).filter(fstate => fstate.type === Folder.Type.year)
		year_folder_states.forEach(fstate => {
			state = _enqueue_action(state, Actions.create_action_persist_notes(fstate.id))
		})
	}

	state = {
		...state,
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
	get_all_folders(state).forEach((folder_state) => {
		folders[folder_state.id] = Folder.on_fs_exploration_done(folder_state)
	})
	state = { ...state, folders }

	// folders now have consolidated infos and can generate neighbor hints
	// debug
	get_all_folders(state).forEach(folder_state => {
		if (folder_state.media_children_count === 0) return

		const consolidated_neighbor_hints = Folder.get_neighbor_primary_hints(folder_state)
		logger.trace(
			`Folder "${folder_state.id}" neighbor hints have been consolidated`,
			File.NeighborHintsLib.get_debug_representation(consolidated_neighbor_hints)
		)

		const reliability = File.NeighborHintsLib.get_neighbors_fs_reliability(consolidated_neighbor_hints)
		/*const log_func = (reliability === 'unreliable')
			? logger.error
			: (reliability === 'unknown')
				? logger.warn
				: logger.info*/
		logger.debug(`Folder "${folder_state.id}" fs reliability has been estimated as ${String(reliability).toUpperCase()}`, {
			stats: folder_state.media_children_fs_reliability_count,
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
// merge notes recovered from notes bkp, notes (re)generated) from fs, across all duplicates if any
function _consolidate_notes_between_persisted_regenerated_and_duplicates(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _consolidate_notes_between_persisted_regenerated_and_duplicates()…`)

	const all_media_hashes = get_all_media_files(state).reduce((acc, file_state) => {
		const { current_hash } = file_state
		assert(current_hash, `_consolidate_notes_between_persisted_regenerated_and_duplicates: should have current hash`)
		acc.add(current_hash)
		return acc
	}, new Set<FileHash>())
	const file_ids_by_hash = get_file_ids_by_hash(state)

	all_media_hashes.forEach(hash => {
		logger.trace(`_consolidate_notes_between_persisted_regenerated_and_duplicates…() processing ${hash}`)

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
			// must be called even if consolidated notes === existing
			// for we record the recovery happened
			state = _on_file_notes_recovered(state, id, recovered_consolidated_notes)
		})

		// can only clean after all duplicates are restored
		if (hash_has_restored_notes) {
			// clean
			state = {
				...state,
				extra_notes: Notes.on_file_notes_recovered_into_active_file_state(state.extra_notes, hash)
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
	}
}
function _consolidate_folders_by_demoting_and_de_overlapping(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _consolidate_folders_by_demoting_and_de_overlapping()…`)

	// files are now fully informed:
	// 1. primary, current data
	// 2. current neighbor hints
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
	get_all_folders(state).forEach((folder_state) => {
		folders[folder_state.id] = Folder.on_all_infos_gathered(folder_state)
	})
	state = { ...state, folders }

	logger.debug(`${LIB} _consolidate_folders_by_demoting_and_de_overlapping()… intermediate 1 =\n`
		+ get_all_folder_ids(state).map(id => Folder.to_string(folders[id])).join('\n')
	)

	// demote event folders with no dates
	folders = { ...state.folders }
	let all_event_folder_ids = get_all_event_folder_ids(state)
	all_event_folder_ids.forEach(id => {
		const folder = folders[id]
		if (!Folder.get_event_range(folder)) {
			folders[id] = Folder.demote_to_unknown(
					folder,
					Folder.is_looking_like_a_backup(folder)
						? 'looks like a backup'
						: 'no [definitive] event range',
				)
		}
	})
	state = { ...state, folders }

	logger.debug(`${LIB} _consolidate_folders_by_demoting_and_de_overlapping()… intermediate 2 =\n`
		+ get_all_folder_ids(state).map(id => Folder.to_string(folders[id])).join('\n')
	)

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
			const existing_range_size = Folder.get_event_end_date‿symd(existing_folder_state) - start_date‿symd
			const candidate_range_size = Folder.get_event_end_date‿symd(candidate_folder_state) - start_date‿symd
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
			if (next_start_date‿symd <= Folder.get_event_end_date‿symd(folder_state))
				folders[folder_state.id] = Folder.on_overlap_clarified(
					folder_state,
					add_days_to_simple_date(next_start_date‿symd, - 1)
				)
		}
	})

	return state
}
function _refresh_debug_infos(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} _refresh_debug_infos()…`)

	// files are now fully informed (cf. _consolidate_folders_by_demoting_and_de_overlapping())

	// iterate over ALL files to refresh their debug infos
	let files = { ...state.files }
	get_all_files(state).forEach((file_state) => {
		files[file_state.id] = File.on_consolidated(file_state)
	})
	state = { ...state, files }

	return state
}
export function on_fs_exploration_done_consolidate_data_and_backup_originals(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} on_fs_exploration_done_consolidate_data_and_backup_originals()…`)
	logger.verbose(`${LIB} Exploration of the file system done, now processing this data with handcrafted AI…`)

	// order is important

	state = _consolidate_and_propagate_neighbor_hints(state)
	state = _consolidate_notes_between_persisted_regenerated_and_duplicates(state)
	state = _consolidate_folders_by_demoting_and_de_overlapping(state)
	state = _refresh_debug_infos(state)

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

	return state
}

// we even normalize non-media files, cleaning spaces and extension is still good
export function normalize_files_in_place(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} normalize_files_in_place()…`)
	logger.verbose(`${LIB} Normalizing files in-place…`)

	const all_files = get_all_files_except_meta(state)
	all_files.forEach(file_state => {
		state = _enqueue_action(state, Actions.create_action_normalize_file(file_state.id))
	})

	return {
		...state,
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
		state = _enqueue_action(state, Actions.create_action_ensure_folder(String(y)))
	}

	return state
}

export function move_all_files_to_their_ideal_location(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} move_all_files_to_their_ideal_location()…`)

	const all_file_ids = get_all_file_ids(state)

	all_file_ids.forEach(id => {
		if (File.is_notes(state.files[id])) {
			logger.silly(`- DB.MTIL: "${id}" = is notes`)
			return
		}

		const target_id = get_ideal_file_relative_path(state, id)
		assert(target_id.includes(path.sep), `move_all_files_to_their_ideal_location() unexpected ${id}`)
		if (id === target_id) {
			logger.silly(`- DB.MTIL: "${id}" = is already in ideal location`)
			return
		}

		logger.silly(`- DB.MTIL: "${id}": is scheduled to move to "${target_id}"`)

		state = _enqueue_action(state, Actions.create_action_move_file_to_ideal_location(id))
	})

	return state
}

export function clean_non_canonical_notes(state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} clean_misplaced_notes()…`)

	const notes_states = get_all_files(state)
		.filter(state => File.is_notes(state))

	notes_states.forEach(notes_state => {
		const is_canonical = (() => {
			const basename = File.get_current_basename(notes_state)
			if (basename !== NOTES_BASENAME_SUFFIX_LC)
				return false

			const parent_folder_id = File.get_current_parent_folder_id(notes_state)
			const folder_state = state.folders[parent_folder_id]
			if (folder_state.type !== Folder.Type.root && folder_state.type !== Folder.Type.year)
				return false

			return true
		})()

		if (!is_canonical) {
			state = _enqueue_action(state, Actions.create_action_delete_file(notes_state.id))
		}
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
