
import { Enum } from 'typescript-string-enums'

import { RelativePath } from '../types'

/////////////////////

export const ActionType = Enum(
	'explore_folder',
	'query_fs_stats',
	'query_exif',
	'ensure_folder',
	'move_folder',
	'move_file',
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

export interface ActionQueryExif extends BaseAction {
	type: typeof ActionType.query_exif
	id: string
}

export interface ActionEnsureFolder extends BaseAction {
	type: typeof ActionType.ensure_folder
	id: string
}

export interface ActionMoveFile extends BaseAction {
	type: typeof ActionType.move_file
	id: string
	target_id: string
}

export interface ActionMoveFolder extends BaseAction {
	type: typeof ActionType.move_folder
	id: string
	target_id: string
}

export interface ActionDeleteFile extends BaseAction {
	type: typeof ActionType.move_file
	id: string
}

export type Action =
	// read only
	| ActionExploreFolder
	| ActionQueryFsStats
	| ActionQueryExif
	// write
	| ActionEnsureFolder
	| ActionMoveFile
	| ActionMoveFolder
	| ActionDeleteFile

export function create_action_explore(id: RelativePath): ActionExploreFolder {
	return {
		type: ActionType.explore_folder,
		id,
	}
}
export function create_action_query_fs_stats(id: RelativePath): ActionQueryFsStats {
	return {
		type: ActionType.query_fs_stats,
		id,
	}
}
export function create_action_query_exif(id: RelativePath): ActionQueryExif {
	return {
		type: ActionType.query_exif,
		id,
	}
}
export function create_action_ensure_folder(id: RelativePath): ActionEnsureFolder {
	return {
		type: ActionType.ensure_folder,
		id,
	}
}
export function create_action_move_folder(id: RelativePath, target_id: RelativePath): ActionMoveFolder {
	return {
		type: ActionType.move_folder,
		id,
		target_id,
	}
}
export function create_action_move_file(id: RelativePath, target_id: RelativePath): ActionMoveFile {
	return {
		type: ActionType.move_file,
		id,
		target_id,
	}
}
