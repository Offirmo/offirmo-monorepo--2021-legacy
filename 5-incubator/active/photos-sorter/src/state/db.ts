import path from 'path'
import fs from 'fs'

import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Tags } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'

import logger from '../services/logger'
import { Basename, AbsolutePath, RelativePath, SimpleYYYYMMDD } from '../types'
import * as Folder from './folder'
import * as File from './file'
import * as Notes from './notes'
import {
	Action,
	create_action_explore_folder,
	create_action_query_fs_stats,
	create_action_query_exif,
	create_action_hash,
	create_action_normalize_file,
	create_action_ensure_folder,
	//create_action_move_folder,
	create_action_move_file,
} from './actions'


/////////////////////

const LIB = '🗄'

/////////////////////

export interface State {
	root: AbsolutePath

	notes: Notes.State,
	folders: { [id: string]: Folder.State }
	files: { [id: string]: File.State }

	queue: Action[],
}

///////////////////// ACCESSORS /////////////////////

export function get_absolute_path(state: Immutable<State>, id: RelativePath): AbsolutePath {
	return path.join(state.root, id)
}

export function get_final_base(base: Basename): Basename {
	return `- ${base}`
}

export function has_pending_actions(state: Immutable<State>): boolean {
	return state.queue.length > 0
}

export function get_first_pending_action(state: Immutable<State>): Action {
	if (!has_pending_actions(state))
		throw new Error('No more pending actions!')

	return state.queue[0]
}

export function get_all_folder_ids(state: Immutable<State>): string[] {
	return Object.keys(state.folders)
		.sort()
}

export function get_all_event_folder_ids(state: Immutable<State>): string[] {
	return Object.keys(state.folders)
		.filter(k => state.folders[k].type === Folder.Type.event)
		//.sort((a, b) => state.folders[a].begin_date! - state.folders[b].begin_date!)
}

export function get_all_file_ids(state: Immutable<State>): string[] {
	return Object.keys(state.files)
		.sort()
}

export function get_all_media_file_ids(state: Immutable<State>): string[] {
	return get_all_file_ids(state)
		.filter(k => File.is_media_file(state.files[k]))
}

export function is_existing(state: Immutable<State>, id: RelativePath): boolean {
	return state.files.hasOwnProperty(id) || is_folder_existing(state, id)
}

export function is_folder_existing(state: Immutable<State>, id: RelativePath): boolean {
	return state.folders.hasOwnProperty(id)
}

export function get_ideal_file_relative_path(state: Immutable<State>, id: RelativePath): RelativePath {
	const file_state = state.files[id]
	const highest_parent = file_state.memoized.get_parsed_path(file_state).dir.split(path.sep)[0]
	const cantsort_segment = get_final_base(Folder.CANTSORT_BASENAME)

	if (!File.is_media_file(file_state)) {
		if (highest_parent === cantsort_segment)
			return id // no change
		else
			return path.join(cantsort_segment, id)
	}

	const ideal_basename = File.get_ideal_basename(file_state)
	const year = String(File.get_best_creation_year(file_state))
	/*const event_folder = ((): string => {
		const compact_date = File.get_best_creation_date_compact(file_state)
		const all_events_folder_ids = get_all_event_folder_ids(state)
		let compatible_event_folder_id = all_events_folder_ids.find(fid => _event_folder_matches(state.folders[fid], compact_date))
		if (!compatible_event_folder_id) {
			// need to create a new event folder!
			// note: we group weekends together
			compatible_event_folder_id = (() => {
				const timestamp = File.get_best_creation_date(file_state)
				let date = new Date(timestamp) // XXX TODO use Date everywhere!

				if (date.getDay() === 0) {
					// sunday is coalesced to sat = start of weekend
					const timestamp_one_day_before = timestamp - (1000 * 3600 * 24)
					date = new Date(timestamp_one_day_before)
				}

				const radix = get_human_readable_UTC_timestamp_days(date)

				return path.join(year, radix + ' - ' + (date.getDay() === 6 ? 'weekend' : 'life'))
			})()

			state = _register_folder(state, compatible_event_folder_id, false)
			actions.push(create_action_ensure_folder(compatible_event_folder_id))
			all_events_folder_ids.push(compatible_event_folder_id)
		}
	})()*/

	throw new Error('NIMP')
	//return path.join(year, event_folder, ideal_basename)
}

///////////////////// REDUCERS /////////////////////

export function create(root: AbsolutePath): Immutable<State> {
	logger.trace(`[${LIB}] create(…)`, { root })

	let state: State = {
		root,
		notes: Notes.create(),
		folders: {},
		files: {},
		queue: [],
	}

	return state
}

function _enqueue_action(state: Immutable<State>, action: Action): Immutable<State> {
	logger.trace(`[${LIB}] enqueue_action(…)`, action)

	return {
		...state,
		queue: [ ...state.queue, action ],
	}
}

export function discard_first_pending_action(state: Immutable<State>): Immutable<State> {
	logger.trace(`[${LIB}] discard_first_pending_action(…)`, { action: state.queue[0] })

	return {
		...state,
		queue: state.queue.slice(1),
	}
}

function _register_folder(state: Immutable<State>, id: RelativePath, exists: boolean): Immutable<State> {
	const folder_state = Folder.create(id)

	state = {
		...state,
		folders: {
			...state.folders,
			[id]: folder_state,
		},
	}

	logger.verbose(`[${LIB}] folder ${exists ? 'found' : 'registered'}`, {id, type: folder_state.type })

	return state
}

export function on_folder_found(state: Immutable<State>, parent_id: RelativePath, sub_id: RelativePath): Immutable<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`[${LIB}] on_folder_found(…)`, { id })

	state = _register_folder(state, id, true) // TODO remove exists
	const folder_state = state.folders[id]

	//if (folder_state.type !== Folder.Type.cantsort)
	state = _enqueue_action(state, create_action_explore_folder(id))

	return state
}

export function on_file_found(state: Immutable<State>, parent_id: RelativePath, sub_id: RelativePath): Immutable<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`[${LIB}] on_file_found(…)`, { id })

	const file_state = File.create(id)

	state = {
		...state,
		files: {
			...state.files,
			[id]: file_state,
		},
	}

	// always, for dedupe
	state = _enqueue_action(state, create_action_hash(id))

	if (File.is_media_file(file_state)) {
		logger.verbose(`[${LIB}] media file found`, { id })

		state = _enqueue_action(state, create_action_query_fs_stats(id))
		state = _enqueue_action(state, create_action_query_exif(id))
	}
	else {
		logger.verbose(`[${LIB}] non-media file found`, { id })
	}

	return state
}

function _on_file_info_read(state: Immutable<State>, file_id: RelativePath): Immutable<State> {
	const file_state = state.files[file_id]

	if (File.is_media_file(file_state) && File.has_all_infos_for_extracting_the_creation_date(file_state)) {
		// update folder date range
		const folder_id = File.get_current_parent_folder_id(file_state)
		const old_folder_state = state.folders[folder_id]
		assert(old_folder_state, `folder state for "${folder_id}" - "${file_id}"!`)
		const new_folder_state = Folder.on_subfile_found(old_folder_state, file_state)
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

export function on_fs_stats_read(state: Immutable<State>, file_id: RelativePath, stats: Immutable<fs.Stats>): Immutable<State> {
	logger.trace(`[${LIB}] on_fs_stats_read(…)`, { file_id })

	const new_file_state = File.on_fs_stats_read(state.files[file_id], stats)

	state = {
		...state,
		files: {
			...state.files,
			[file_id]: new_file_state,
		},
	}

	return _on_file_info_read(state, file_id)
}

export function on_exif_read(state: Immutable<State>, file_id: RelativePath, exif_data: Immutable<Tags>): Immutable<State> {
	logger.trace(`[${LIB}] on_exif_read(…)`, { file_id })

	const new_file_state = File.on_exif_read(state.files[file_id], exif_data)

	state = {
		...state,
		files: {
			...state.files,
			[file_id]: new_file_state,
		},
	}

	return _on_file_info_read(state, file_id)
}

export function on_hash_computed(state: Immutable<State>, file_id: RelativePath, hash: string): Immutable<State> {
	logger.trace(`[${LIB}] on_hash_computed(…)`, { file_id })

	let new_file_state = File.on_hash_computed(state.files[file_id], hash)

	state = {
		...state,
		files: {
			...state.files,
			[file_id]: new_file_state,
		},
	}

	return _on_file_info_read(state, file_id)
}

/*
export function on_folder_moved(state: Immutable<State>, id: RelativePath, target_id: RelativePath): Immutable<State> {
	logger.trace(`[${LIB}] on_folder_moved(…)`, { })

	assert(!state.folders[target_id])

	// TODO immu
	let folder_state = state.folders[id]
	folder_state = Folder.on_moved(folder_state, target_id)
	delete state.folders[id]
	state.folders[target_id] = folder_state

	get_all_file_ids(state).forEach(fid => {
		const file_state = state.files[fid]
		if (File.get_current_parent_folder_id(file_state) !== id) return

		const new_file_id = path.join(target_id, File.get_current_basename(file_state))
		state = on_file_moved(state, fid, new_file_id)
	})

	return state
}*/

export function on_file_moved(state: Immutable<State>, id: RelativePath, target_id: RelativePath): Immutable<State> {
	logger.trace(`[${LIB}] on_file_moved(…)`, { })

	assert(!state.files[target_id], 'on_file_moved() file state')

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

/*
export function merge_folder(state: Immutable<State>, id: RelativePath, target_id: RelativePath): Immutable<State> {
	logger.info(`merging folders: "${id}" into "${target_id}"`)

	assert(id !== target_id)

	const folder_state = state.folders[id]
	const target_folder_state = state.folders[target_id]

	assert(folder_state.type === Folder.Type.event, 'NIMP merging folder from non-event!')
	assert(target_folder_state.type === Folder.Type.event, 'NIMP merging folder into non-event target!')

	// merge the dates
	// TODO reducer action ?
	// TODO can dates be -1 at this point ?? (can they even be -1 at all?)
	if (target_folder_state.begin_date === -1)
		target_folder_state.begin_date = folder_state.begin_date
	if (target_folder_state.end_date === -1)
		target_folder_state.end_date = folder_state.end_date
	if (folder_state.begin_date !== -1)
		target_folder_state.begin_date = Math.min(target_folder_state.begin_date, folder_state.begin_date)
	if (folder_state.end_date !== -1)
		target_folder_state.end_date = Math.min(target_folder_state.end_date, folder_state.end_date)

	// merge the names
	if (Folder.get_current_basename(target_folder_state) !== Folder.get_current_basename(folder_state)) {
		throw new Error('TODO merge folders: merge basenames')
	}

	// move all img files to target (merge as well if needed)


	// mark the src folder as no longer event

	// clean it / move it away if needed

	throw new Error('NIMP merging folders')
}
*/

///////////////////// ACTIONS /////////////////////

export function explore_fs_recursively(state: Immutable<State>): Immutable<State> {
	logger.verbose('explore_fs_recursively()…')
	return on_folder_found(state, '', '.')
}

export function on_fs_exploration_done(_state: Immutable<State>): Immutable<State> {
	logger.verbose('on_fs_exploration_done()…')

	console.warn('on_exploration_done() TODO fix Immu ')
	let state: State = _state as any as State
	let { notes } = state
	let folders: { [id: string]: Immutable<Folder.State> } = { ...state.folders }
	let files: { [id: string]: Immutable<File.State> } = { ...state.files }

	// demote event folders with no dates
	let all_event_folder_ids = get_all_event_folder_ids(state)
	all_event_folder_ids.forEach(id => {
		folders[id] = Folder.demote_to_unknown(folders[id])
	})
	state = {
		...state,
		folders,
	}

	// demote non-canonical or overlapping folder events but create the canonical ones
	all_event_folder_ids = get_all_event_folder_ids(state)
	all_event_folder_ids.forEach(id => {
		//const folder_state = state.folders[id]
		throw new Error('NIMP')
	})

	// consolidate all data
	const all_media_files: Immutable<File.State>[] = Object.values(get_all_media_file_ids(state)).map(id => files[id])
	notes = Notes.on_exploration_done(notes, all_media_files)

	all_media_files.forEach(file_state => {
		const { id, current_hash } = file_state
		files[id] = File.on_notes_unpersisted(
				file_state,
				Notes.get_file_notes_from_hash(state.notes, current_hash!)
			)
	})

	return {
		...state,
		files,
		folders,
		notes,
	}
}

export function normalize_medias_in_place(state: Immutable<State>): Immutable<State> {
	const all_file_ids = get_all_media_file_ids(state)
	all_file_ids.forEach(id => {
		state = _enqueue_action(state, create_action_normalize_file(id))
	})

	return state
}

export function ensure_structural_dirs_are_present(state: Immutable<State>): Immutable<State> {
	state = _enqueue_action(state, create_action_ensure_folder(get_final_base(Folder.INBOX_BASENAME)))
	state = _enqueue_action(state, create_action_ensure_folder(get_final_base(Folder.CANTSORT_BASENAME)))

	const years = new Set<number>()
	const all_file_ids = get_all_media_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.files[id]
		years.add(File.get_best_creation_year(file_state))
	})
	for(const y of years) {
		//state = _register_folder(state, String(y), false)
		state = _enqueue_action(state, create_action_ensure_folder(String(y)))
	}

	return state
}

export function move_all_files_to_their_ideal_location_incl_deduping(state: Immutable<State>): Immutable<State> {
	const all_file_ids = get_all_media_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.files[id]

	})
	throw new Error('NIMP move_all_files_to_their_ideal_location_incl_deduping')
}

export function delete_empty_folders_recursively(state: Immutable<State>): Immutable<State> {
	throw new Error('NIMP')
}
/*
export function ensure_existing_event_folders_are_organized(state: Immutable<State>): Immutable<State> {

	// first re-qualify some event folders
	Object.keys(state.folders).forEach(id => {
		const folder_state = state.folders[id]
		if (folder_state.type !== Folder.Type.event) return

		// TODO ensure the picture's dates spread is coherent with a single event
	})

	get_all_event_folder_ids(state).forEach(id => {
		const folder_state = state.folders[id]
		if (folder_state.type !== Folder.Type.event) return

		const ideal_basename = Folder.get_ideal_basename(folder_state)
		const year = Folder.get_best_creation_year(folder_state)

		const ideal_id = path.join(String(year), ideal_basename)
		if (id === ideal_id) return // nothing to do

		if (state.folders[ideal_id]) {
			// conflict...
			// TODO reducer action ?
			logger.info(`deduping folders: "${id}" vs. "${ideal_id}"`)
			const target_folder_state = state.folders[ideal_id]

			if (target_folder_state.type !== Folder.Type.event) {
				// shouldn't be here, move to inbox

			}

			// merge the dates
			// TODO reducer action ?
			// TODO can dates be -1 at this point ?? (can they even be -1 at all?)
			if (target_folder_state.begin_date === -1)
				target_folder_state.begin_date = folder_state.begin_date
			if (target_folder_state.end_date === -1)
				target_folder_state.end_date = folder_state.end_date
			if (folder_state.begin_date !== -1)
				target_folder_state.begin_date = Math.min(target_folder_state.begin_date, folder_state.begin_date)
			if (folder_state.end_date !== -1)
				target_folder_state.end_date = Math.min(target_folder_state.end_date, folder_state.end_date)

			// merge the names
			if (Folder.get_basename(target_folder_state) !== Folder.get_basename(folder_state)) {
				throw new Error('TODO dedupe folders: merge basenames')
			}

			// move all non-event files to inbox


			throw new Error('TODO dedupe folders')
		}
		else {
			assert(false, 'todo reimplement')
			//state = _enqueue_action(state, create_action_move_folder(id, ideal_id))
		}
	})

	return state
}
*/


function _event_folder_matches(folder_state: Immutable<Folder.State>, compact_date: SimpleYYYYMMDD): boolean {
	return true
		&& !!folder_state.begin_date
		&& !!folder_state.end_date
		&& compact_date >= folder_state.begin_date
		&& compact_date <= folder_state.end_date
}
/*
export function ensure_all_needed_events_folders_are_present_and_move_files_in_them(state: Immutable<State>): Immutable<State> {
	const actions: Action[] = []

	const all_events_folder_ids = get_all_event_folder_ids(state)

	const all_file_ids = get_all_media_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.files[id]
		const current_parent_id = File.get_current_parent_folder_id(file_state)
		const compact_date = File.get_best_creation_date_compact(file_state)
		if (all_events_folder_ids.includes(current_parent_id) && _event_folder_matches(state.folders[current_parent_id], compact_date))
			return // all good

		let compatible_event_folder_id = all_events_folder_ids.find(fid => _event_folder_matches(state.folders[fid], compact_date))
		if (!compatible_event_folder_id) {
			// need to create a new event folder!
			// note: we group weekends together
			compatible_event_folder_id = (() => {
				const timestamp = File.get_best_creation_date(file_state)
				let date = new Date(timestamp)

				if (date.getDay() === 0) {
					// sunday is coalesced to sat = start of weekend
					const timestamp_one_day_before = timestamp - (1000 * 3600 * 24)
					date = new Date(timestamp_one_day_before)
				}

				const radix = get_human_readable_timestamp_days(date)

				return path.join(String(File.get_best_creation_year(file_state)), radix + ' - ' + (date.getDay() === 6 ? 'weekend' : 'life'))
			})()

			state = _register_folder(state, compatible_event_folder_id, false)
			actions.push(create_action_ensure_folder(compatible_event_folder_id))
			all_events_folder_ids.push(compatible_event_folder_id)
		}

		// now move the file there
		const new_file_id = path.join(compatible_event_folder_id, File.get_ideal_basename(file_state))
		if (state.files[new_file_id]) {
			// conflict, TODO
			throw new Error('NIMP file conflict!')
		}
		actions.push(create_action_move_file(id, new_file_id))
	})

	return {
		...state,
		queue: [ ...state.queue, ...actions ],
	}
}

// TODO move non-event folders to cantsort, or delete them if empty

export function ensure_all_eligible_files_are_correctly_named(state: Immutable<State>): Immutable<State> {
	const actions: Action[] = []

	const all_file_ids = get_all_media_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.files[id]
		const current_basename = File.get_current_basename(file_state)
		const ideal_basename = File.get_ideal_basename(file_state)
		if (current_basename !== ideal_basename) {
			actions.push(create_action_move_file(id, path.join(File.get_current_parent_folder_id(file_state), ideal_basename)))
		}
	})

	return {
		...state,
		queue: [ ...state.queue, ...actions ],
	}}
*/

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { root, files, folders } = state

	let str = `
${stylize_string.blue.bold('####### Photo sorter’s DB #######')}
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

	return str
}
