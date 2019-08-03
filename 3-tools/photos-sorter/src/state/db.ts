import path from 'path'
import fs from 'fs'

import stylize_string from 'chalk'
import { Enum } from 'typescript-string-enums'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

import logger from '../services/logger'
import * as Match from '../services/matchers'
import { Basename, AbsolutePath, RelativePath } from '../types'
import * as Folder from './folder'
import * as MediaFile from './media-file'


/////////////////////

export const ActionType = Enum(
	'explore_folder',
	'query_fs_stats',
	'query_exif',
	'ensure_folder',
	'rename_file',
	'delete_file',
)
export type ActionType = Enum<typeof ActionType> // eslint-disable-line no-redeclare

/////////////////////

export interface BaseAction {
}

export interface ActionExploreFolder extends BaseAction {
	type: typeof ActionType.explore_folder
	id: string
}

export interface ActionQueryFsStats extends BaseAction {
	type: typeof ActionType.query_fs_stats
	id: string
}

export interface ActionQueryEXIF extends BaseAction {
	type: typeof ActionType.query_exif
	id: string
}

export interface ActionEnsureFolder extends BaseAction {
	type: typeof ActionType.ensure_folder
	id: string
}

export interface ActionRenameFile extends BaseAction {
	type: typeof ActionType.rename_file
	id: string
}

export interface ActionDeleteFile extends BaseAction {
	type: typeof ActionType.rename_file
	id: string
}

export type Action =
	// read only
	ActionExploreFolder |
	ActionQueryFsStats |
	ActionQueryEXIF |
	// write
	ActionEnsureFolder |
	ActionRenameFile |
	ActionDeleteFile

function create_action_explore(id: RelativePath): ActionExploreFolder {
	return {
		type: ActionType.explore_folder,
		id,
	}
}
function create_action_query_fs_stats(id: RelativePath): ActionQueryFsStats {
	return {
		type: ActionType.query_fs_stats,
		id,
	}
}
function create_action_query_exif(id: RelativePath): ActionQueryEXIF {
	return {
		type: ActionType.query_exif,
		id,
	}
}

/////////////////////

export interface State {
	root: AbsolutePath

	// normalized
	folders: { [id: string]: Folder.State }
	media_files: { [id: string]: MediaFile.State }

	queue: Action[],
}



////////////////////////////////////

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

export function get_all_eligible_file_ids(state: Readonly<State>): string[] {
	return Object.keys(state.media_files)
		.filter(k => state.media_files[k].is_eligible)
		.sort()
}

////////////////////////////////////

export function create(root: AbsolutePath): Readonly<State> {
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
	return {
		...state,
		queue: [ ...state.queue, action ]
	}
}

export function discard_first_pending_action(state: Readonly<State>): Readonly<State> {
	return {
		...state,
		queue: state.queue.slice(1),
	}
}

export function on_folder_found(state: Readonly<State>, parent_id: RelativePath, sub_id: RelativePath): Readonly<State> {
	const id = path.join(parent_id, sub_id)
	const folder_state = Folder.create(id)

	state = {
		...state,
		folders: {
			...state.folders,
			[id]: folder_state,
		},
	}

	logger.info('folder found', {id, type: folder_state.type })

	if (folder_state.type !== Folder.Type.cantsort)
		state = enqueue_action(state, create_action_explore(id))

	return state
}

export function on_file_found(state: Readonly<State>, parent_id: RelativePath, sub_id: RelativePath): Readonly<State> {
	const id = path.join(parent_id, sub_id)

	const file_state = MediaFile.create(id)

	state = {
		...state,
		media_files: {
			...state.media_files,
			[id]: file_state,
		},
	}

	if (file_state.is_eligible) {
		logger.info('eligible file found', { id })

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

export function on_exploration_complete(state: Readonly<State>): Readonly<State> {
	// starts writing...
	const ENSURE_INBOX_FOLDER: ActionEnsureFolder = {
		type: ActionType.ensure_folder,
		id: get_final_base(Folder.INBOX_BASENAME),
	}
	state = enqueue_action(state, ENSURE_INBOX_FOLDER)

	const ENSURE_CANTSORT_FOLDER: ActionEnsureFolder = {
		type: ActionType.ensure_folder,
		id: get_final_base(Folder.CANTSORT_BASENAME),
	}
	state = enqueue_action(state, ENSURE_CANTSORT_FOLDER)

	state = _ensure_all_eligible_files_are_correctly_named(state)
	// TODO ensure all files have correct utime
	// TODO ensure all files correct place + delete duplicates + rename conflicting
	// TODO move files below root or a year folder
	// TODO move unknown folders and files to CANTSORT
	// TODO jpeg lossless rotation

	return state
}

////////////////////////////////////

function _ensure_all_eligible_files_are_correctly_named(state: Readonly<State>): Readonly<State> {
	const actions: Action[] = []

	const all_file_ids = get_all_eligible_file_ids(state)
	all_file_ids.forEach(id => {
		const file_state = state.media_files[id]
		const current_basename = MediaFile.get_basename(file_state)
		const ideal_basename = MediaFile.get_ideal_basename(file_state)
		if (current_basename !== ideal_basename) {
			console.error(`TODO rename from "${current_basename}" to "${ideal_basename}"`)
		}
	})

	return {
		...state,
		queue: [ ...state.queue, ...actions ]
	}}

////////////////////////////////////

export function to_string(state: Readonly<State>) {
	const { root, media_files, folders } = state

	const all_file_ids = get_all_eligible_file_ids(state)
	let str = `
${stylize_string.blue('####### Photo sorter’s DB #######')}
Root: "${root}"
${stylize_string.blue('' + all_file_ids.length)} files in ${stylize_string.blue('' + Object.keys(folders).length)} folders:
${all_file_ids.map(id => MediaFile.to_string(media_files[id])).join('\n')}
`
	return str
}

