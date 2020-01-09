import path from 'path'

import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { get_human_readable_UTC_timestamp_days } from '@offirmo-private/timestamps'

import logger from '../services/logger'
import * as Match from '../services/matchers'
import { Basename, AbsolutePath, RelativePath, SimpleYYYYMMDD } from '../types'
import * as Folder from './folder'
import * as MediaFile from './media-file'
import {
	Action,
	create_action_explore,
	create_action_query_fs_stats,
	create_action_query_exif,
	create_action_ensure_folder,
	create_action_move_folder,
	create_action_move_file,
} from './actions'


/////////////////////

const LIB = '🗄 '

/////////////////////

export interface State {
	root: AbsolutePath

	// normalized
	folders: { [id: string]: Folder.State }
	media_files: { [id: string]: MediaFile.State }

	queue: Action[],
}

///////////////////// ACCESSORS /////////////////////

export function get_absolute_path(state: Readonly<State>, id: RelativePath): AbsolutePath {
	return path.join(state.root, id)
}

export function get_final_base(base: Basename): Basename {
	return `- ${base}`
}

export function has_pending_actions(state: Readonly<State>): boolean {
	return state.queue.length > 0
}

export function get_first_pending_action(state: Readonly<State>): Action {
	if (!has_pending_actions(state))
		throw new Error('No more pending actions!')

	return state.queue[0]
}

export function get_all_folder_ids(state: Readonly<State>): string[] {
	return Object.keys(state.folders)
		.sort()
}

export function get_all_file_ids(state: Readonly<State>): string[] {
	return Object.keys(state.media_files)
		.sort()
}

export function get_all_eligible_file_ids(state: Readonly<State>): string[] {
	return get_all_file_ids(state)
		.filter(k => state.media_files[k].is_eligible)
}

export function get_all_event_folder_ids(state: Readonly<State>): string[] {
	return Object.keys(state.folders)
		.filter(k => state.folders[k].type === Folder.Type.event)
}

///////////////////// REDUCERS /////////////////////

export function create(root: AbsolutePath): Readonly<State> {
	logger.trace(`[${LIB}] create(…)`, { root })

	let state: State = {
		root,
		folders: {},
		media_files: {},
		queue: [],
	}

	//state = on_folder_found(state, '.')
	const EXPLORE_ROOT_FOLDER = create_action_explore('.')
	state = enqueue_action(state, EXPLORE_ROOT_FOLDER)

	return state
}

export function enqueue_action(state: Readonly<State>, action: Action): Readonly<State> {
	logger.trace(`[${LIB}] enqueue_action(…)`, { action })

	return {
		...state,
		queue: [ ...state.queue, action ],
	}
}

export function discard_first_pending_action(state: Readonly<State>): Readonly<State> {
	logger.trace(`[${LIB}] discard_first_pending_action(…)`, { action: state.queue[0] })

	return {
		...state,
		queue: state.queue.slice(1),
	}
}

function _register_folder(state: Readonly<State>, id: RelativePath, exists: boolean): Readonly<State> {
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

export function on_folder_found(state: Readonly<State>, parent_id: RelativePath, sub_id: RelativePath): Readonly<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`[${LIB}] on_folder_found(…)`, { id })

	state = _register_folder(state, id, true)
	const folder_state = state.folders[id]

	if (folder_state.type !== Folder.Type.cantsort)
		state = enqueue_action(state, create_action_explore(id))

	return state
}

export function on_file_found(state: Readonly<State>, parent_id: RelativePath, sub_id: RelativePath): Readonly<State> {
	const id = path.join(parent_id, sub_id)
	logger.trace(`[${LIB}] on_file_found(…)`, { id })

	const file_state = MediaFile.create(id)

	state = {
		...state,
		media_files: {
			...state.media_files,
			[id]: file_state,
		},
	}

	if (file_state.is_eligible) {
		logger.verbose('eligible file found', { id })

		state = enqueue_action(state, create_action_query_fs_stats(id))
		state = enqueue_action(state, create_action_query_exif(id))
	}

	return state
}

function _on_file_info_read(state: Readonly<State>, file_id: RelativePath): Readonly<State> {
	const file_state = state.media_files[file_id]

	if (MediaFile.has_all_infos(file_state)) {
		// update folder date range
		const folder_id = MediaFile.get_parent_folder_id(file_state)
		const new_folder_state = Folder.on_subfile_found(state.folders[folder_id], file_state)
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

export function on_fs_stats_read(state: Readonly<State>, file_id: RelativePath, stats: MediaFile.State['fs_stats']): Readonly<State> {
	logger.trace(`[${LIB}] on_fs_stats_read(…)`, { file_id })

	const new_file_state = MediaFile.on_fs_stats_read(state.media_files[file_id], stats)

	state = {
		...state,
		media_files: {
			...state.media_files,
			[file_id]: new_file_state,
		},
	}

	return _on_file_info_read(state, file_id)
}

export function on_exif_read(state: Readonly<State>, file_id: RelativePath, exif_data: MediaFile.State['exif_data']): Readonly<State> {
	logger.trace(`[${LIB}] on_exif_read(…)`, { file_id })

	const new_file_state = MediaFile.on_exif_read(state.media_files[file_id], exif_data)

	state = {
		...state,
		media_files: {
			...state.media_files,
			[file_id]: new_file_state,
		},
	}

	return _on_file_info_read(state, file_id)
}

export function on_folder_moved(state: Readonly<State>, id: RelativePath, target_id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] on_folder_moved(…)`, { })

	assert(!state.folders[target_id])

	// TODO immu
	let folder_state = state.folders[id]
	folder_state = Folder.on_moved(folder_state, target_id)
	delete state.folders[id]
	state.folders[target_id] = folder_state

	get_all_file_ids(state).forEach(fid => {
		const file_state = state.media_files[fid]
		if (MediaFile.get_parent_folder_id(file_state) !== id) return

		const new_file_id = path.join(target_id, MediaFile.get_basename(file_state))
		state = on_file_moved(state, fid, new_file_id)
	})

	return state
}

export function on_file_moved(state: Readonly<State>, id: RelativePath, target_id: RelativePath): Readonly<State> {
	logger.trace(`[${LIB}] on_file_moved(…)`, { })

	assert(!state.media_files[target_id])

	// TODO immu
	let file_state = state.media_files[id]
	file_state = MediaFile.on_moved(file_state, target_id)
	delete state.media_files[id]
	state.media_files[target_id] = file_state

	return state
}

export function merge_folder(state: Readonly<State>, id: RelativePath, target_id: RelativePath): Readonly<State> {
	logger.info(`merging folders: "${id}" into "${target_id}"`)

	assert(id !== target_id)

	const folder_state = state.folders[id]
	const target_folder_state = state.folders[target_id]

	assert(folder_state.type === Folder.Type.event, 'NIMP merging folder from non-event!')
	assert(target_folder_state.type === Folder.Type.event, 'NIMP merging folder into non-event target!')

	// merge the dates
	// TODO reducer action ?
	// TODO can dates be -1 at this point ?? (can they even be -1 at all?)
	if (target_folder_state.start_date === -1)
		target_folder_state.start_date = folder_state.start_date
	if (target_folder_state.end_date === -1)
		target_folder_state.end_date = folder_state.end_date
	if (folder_state.start_date !== -1)
		target_folder_state.start_date = Math.min(target_folder_state.start_date, folder_state.start_date)
	if (folder_state.end_date !== -1)
		target_folder_state.end_date = Math.min(target_folder_state.end_date, folder_state.end_date)

	// merge the names
	if (Folder.get_basename(target_folder_state) !== Folder.get_basename(folder_state)) {
		throw new Error('TODO merge folders: merge basenames')
	}

	// move all img files to target (merge as well if needed)


	// mark the src folder as no longer event

	// clean it / move it away if needed

	throw new Error('NIMP merging folders')
}

////////////////////////////////////

export function ensure_structural_dirs_are_present(state: Readonly<State>): Readonly<State> {
	state = enqueue_action(state, create_action_ensure_folder(get_final_base(Folder.INBOX_BASENAME)))
	state = enqueue_action(state, create_action_ensure_folder(get_final_base(Folder.CANTSORT_BASENAME)))

	const years = new Set<number>()
	const all_file_ids = get_all_eligible_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.media_files[id]
		years.add(MediaFile.get_year(file_state))
	})
	for(const y of years) {
		state = _register_folder(state, String(y), false)
		state = enqueue_action(state, create_action_ensure_folder(String(y)))
	}

	return state
}

export function ensure_existing_event_folders_are_organized(state: Readonly<State>): Readonly<State> {
	// first re-qualify some event folders
	Object.keys(state.folders).forEach(id => {
		const folder_state = state.folders[id]
		if (folder_state.type !== Folder.Type.event) return

		// ensure dates look like an event
		if (folder_state.start_date === Folder.now_simple
			|| (folder_state.end_date - folder_state.start_date) > 28) {
			// demote. Not immutable, I know :/
			folder_state.type = Folder.Type.unknown
		}

		// TODO ensure the picture's dates spread is coherent with a single event
	})

	get_all_event_folder_ids(state).forEach(id => {
		const folder_state = state.folders[id]
		if (folder_state.type !== Folder.Type.event) return

		const ideal_basename = Folder.get_ideal_basename(folder_state)
		const year = Folder.get_year(folder_state)

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
			if (target_folder_state.start_date === -1)
				target_folder_state.start_date = folder_state.start_date
			if (target_folder_state.end_date === -1)
				target_folder_state.end_date = folder_state.end_date
			if (folder_state.start_date !== -1)
				target_folder_state.start_date = Math.min(target_folder_state.start_date, folder_state.start_date)
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
			state = enqueue_action(state, create_action_move_folder(id, ideal_id))
		}
	})

	return state
}

function _event_folder_matches(folder_state: Readonly<Folder.State>, compact_date: SimpleYYYYMMDD): boolean {
	return compact_date >= folder_state.start_date && compact_date <= folder_state.end_date
}

export function ensure_all_needed_events_folders_are_present_and_move_files_in_them(state: Readonly<State>): Readonly<State> {
	const actions: Action[] = []

	const all_events_folder_ids = get_all_event_folder_ids(state)

	const all_file_ids = get_all_eligible_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.media_files[id]
		const current_parent_id = MediaFile.get_parent_folder_id(file_state)
		const compact_date = MediaFile.get_best_compact_date(file_state)
		if (all_events_folder_ids.includes(current_parent_id) && _event_folder_matches(state.folders[current_parent_id], compact_date))
			return // all good

		let compatible_event_folder_id = all_events_folder_ids.find(fid => _event_folder_matches(state.folders[fid], compact_date))
		if (!compatible_event_folder_id) {
			// need to create a new event folder!
			// note: we group weekends together
			compatible_event_folder_id = (() => {
				const timestamp = MediaFile.get_best_creation_date_ms(file_state)
				let date = new Date(timestamp)

				if (date.getUTCDay() === 0) {
					// sunday is coalesced to sat = start of weekend
					const timestamp_one_day_before = timestamp - (1000 * 3600 * 24)
					date = new Date(timestamp_one_day_before)
				}

				const radix = get_human_readable_UTC_timestamp_days(date)

				return path.join(String(MediaFile.get_year(file_state)), radix + ' - ' + (date.getUTCDay() === 6 ? 'weekend' : 'life'))
			})()

			state = _register_folder(state, compatible_event_folder_id, false)
			actions.push(create_action_ensure_folder(compatible_event_folder_id))
			all_events_folder_ids.push(compatible_event_folder_id)
		}

		// now move the file there
		const new_file_id = path.join(compatible_event_folder_id, MediaFile.get_ideal_basename(file_state))
		if (state.media_files[new_file_id]) {
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

export function ensure_all_eligible_files_are_correctly_named(state: Readonly<State>): Readonly<State> {
	const actions: Action[] = []

	const all_file_ids = get_all_eligible_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.media_files[id]
		const current_basename = MediaFile.get_basename(file_state)
		const ideal_basename = MediaFile.get_ideal_basename(file_state)
		if (current_basename !== ideal_basename) {
			actions.push(create_action_move_file(id, path.join(MediaFile.get_parent_folder_id(file_state), ideal_basename)))
		}
	})

	return {
		...state,
		queue: [ ...state.queue, ...actions ],
	}}

///////////////////// DEBUG /////////////////////

export function to_string(state: Readonly<State>) {
	const { root, media_files, folders } = state

	let str = `
${stylize_string.blue.bold('####### Photo sorter’s DB #######')}
Root: "${stylize_string.yellow.bold(root)}"
`

	const all_folder_ids = get_all_folder_ids(state)
	str += stylize_string.bold(
		`\n${stylize_string.blue('' + all_folder_ids.length)} folders:\n`,
	)
	str += all_folder_ids.map(id => Folder.to_string(folders[id])).join('\n')


	//const all_file_ids = get_all_eligible_file_ids(state)
	const all_file_ids = get_all_file_ids(state)
	str += stylize_string.bold(
		`\n\n${stylize_string.blue(String(all_file_ids.length))} files in ${stylize_string.blue(String(all_folder_ids.length))} folders:\n`,
	)
	str += all_file_ids.map(id => MediaFile.to_string(media_files[id])).join('\n')

	return str
}

