
import { Enum } from 'typescript-string-enums'

import { RelativePath } from '../types'
import { FolderId } from './folder'
import { FileId } from './file'
import { State as NotesState } from './notes'
import { Immutable } from '@offirmo-private/ts-types'

/////////////////////

export const ActionType = Enum(
	'explore_folder',
	'query_fs_stats',
	'query_exif',
	'hash',
	'load_notes',
	'persist_notes',
	'ensure_folder',
	'normalize_file',
	'move_file',
	'delete_file',
	'delete_folder_if_empty'
)
export type ActionType = Enum<typeof ActionType> // eslint-disable-line no-redeclare

/////////////////////

export interface BaseAction {
}

export interface ActionExploreFolder extends BaseAction {
	type: typeof ActionType.explore_folder
	id: FolderId
}

export interface ActionQueryFsStats extends BaseAction {
	type: typeof ActionType.query_fs_stats
	id: FileId
}

export interface ActionQueryExif extends BaseAction {
	type: typeof ActionType.query_exif
	id: FileId
}

export interface ActionHash extends BaseAction {
	type: typeof ActionType.hash
	id: FileId
}

export interface ActionLoadNotes extends BaseAction {
	type: typeof ActionType.load_notes
	path: RelativePath
}

export interface ActionPersistNotes extends BaseAction {
	type: typeof ActionType.persist_notes
	data: Immutable<NotesState>
	folder_path?: RelativePath
}

export interface ActionEnsureFolder extends BaseAction {
	type: typeof ActionType.ensure_folder
	id: FolderId
}

export interface ActionNormalizeFile extends BaseAction {
	type: typeof ActionType.normalize_file
	id: FileId
}

export interface ActionMoveFile extends BaseAction {
	type: typeof ActionType.move_file
	id: FileId
	target_id: FileId
}

export interface ActionDeleteFile extends BaseAction {
	type: typeof ActionType.delete_file
	id: FileId
}

export interface ActionDeleteFolderIfEmpty extends BaseAction {
	type: typeof ActionType.delete_folder_if_empty
	id: FolderId
	//depth: number // needed to order the actions
}


// TODO delete empty folder

export type Action =
	// read only
	| ActionExploreFolder
	| ActionQueryFsStats
	| ActionQueryExif
	| ActionHash
	| ActionLoadNotes
	// write
	| ActionPersistNotes
	| ActionNormalizeFile
	| ActionEnsureFolder
	| ActionMoveFile
	| ActionDeleteFile
	| ActionDeleteFolderIfEmpty

export function create_action_explore_folder(id: FolderId): ActionExploreFolder {
	return {
		type: ActionType.explore_folder,
		id,
	}
}
export function create_action_query_fs_stats(id: FileId): ActionQueryFsStats {
	return {
		type: ActionType.query_fs_stats,
		id,
	}
}
export function create_action_query_exif(id: FileId): ActionQueryExif {
	return {
		type: ActionType.query_exif,
		id,
	}
}
export function create_action_hash(id: FileId): ActionHash {
	return {
		type: ActionType.hash,
		id,
	}
}
export function create_action_load_notes(path: RelativePath): ActionLoadNotes {
	return {
		type: ActionType.load_notes,
		path,
	}
}
export function create_action_persist_notes(data: Immutable<NotesState>, folder_path?: RelativePath): ActionPersistNotes {
	return {
		type: ActionType.persist_notes,
		data,
		folder_path,
	}
}

// TODO this should not be an action, too low level
export function create_action_normalize_file(id: FileId): ActionNormalizeFile {
	return {
		type: ActionType.normalize_file,
		id,
	}
}
export function create_action_ensure_folder(id: FolderId): ActionEnsureFolder {
	return {
		type: ActionType.ensure_folder,
		id,
	}
}
/*export function create_action_move_folder(id: RelativePath, target_id: RelativePath): ActionMoveFolder {
	return {
		type: ActionType.move_folder,
		id,
		target_id,
	}
}*/
export function create_action_move_file(id: FileId, target_id: FileId): ActionMoveFile {
	return {
		type: ActionType.move_file,
		id,
		target_id,
	}
}
export function create_action_delete_file(id: FileId): ActionDeleteFile {
	return {
		type: ActionType.delete_file,
		id,
	}
}
export function create_action_delete_folder_if_empty(id: FolderId): ActionDeleteFolderIfEmpty {
	return {
		type: ActionType.delete_folder_if_empty,
		id,
	}
}
