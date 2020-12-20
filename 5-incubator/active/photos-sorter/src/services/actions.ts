import path from 'path'
import util from 'util'
import fs from 'fs'
import assert from 'tiny-invariant'
import json from '@offirmo/cli-toolbox/fs/json'
import { Immutable } from '@offirmo-private/ts-types'
const cli_progress = require('cli-progress')
import { exiftool } from 'exiftool-vendored'

import { RelativePath } from '../types'
import { NOTES_BASENAME } from '../consts'
import { get_params } from '../params'

import * as File from '../state/file'
import * as Notes from '../state/notes'
import * as DB from '../state/db'
import { State } from '../state/db'
import { Action, ActionType } from '../state/actions'

import logger from './logger'
import fs_extra from './fs-extra'
import { get_fs_stats_subset } from './fs'
import get_file_hash from './hash'
import { is_already_normalized } from './name_parser'

export async function exec_pending_actions_recursively_until_no_more(db: Immutable<State>): Promise<Immutable<State>> {
	// TODO handle errors

	const PARAMS = get_params()

	// https://www.npmjs.com/package/cli-progress
	const progress_multibar = new cli_progress.MultiBar({
		clearOnComplete: false,
		hideCursor: true
	}, cli_progress.Presets.shades_grey)

	const progress_bars: { [id: string]: { size: number, bar: any }} = {}
	function on_new_task(id: string) {
		progress_bars[id] ??= {
			size: 0,
			bar: progress_multibar.create(0, 0),
		}

		progress_bars[id].size++
		progress_bars[id].bar.setTotal(progress_bars[id].size)
	}
	function on_task_finished(id: string) {
		progress_bars[id].bar.increment()
	}

	////////////////////////////////////
	const TASK_ID = 'any'

	async function explore_folder(id: RelativePath): Promise<void> {
		logger.group(`- exploring dir "${id}"…`)
		const TASK_ID = 'explore_folder'
		on_new_task(TASK_ID)

		let pending_tasks: Promise<void>[] = []

		const abs_path = DB.get_absolute_path(db, id)

		const sub_dirs = fs_extra.lsDirsSync(abs_path, { full_path: false })
		sub_dirs.forEach((sub_id: RelativePath) => {
			db = DB.on_folder_found(db, id, sub_id)
		})

		const sub_file_basenames = fs_extra.lsFilesSync(abs_path, { full_path: false })
		sub_file_basenames.forEach((basename: RelativePath) => {
			//const normalized_extension TODO
			const basename_lc = basename.toLowerCase()
			const should_delete_asap = !!PARAMS.extensions_to_delete.find(ext => basename_lc.endsWith(ext))
				|| PARAMS.worthless_files.includes(basename_lc)
			if (should_delete_asap) {
				const abs_path_target = DB.get_absolute_path(db, path.join(id, basename))
				if (PARAMS.dry_run) {
					logger.verbose(`encountered trash, DRY RUN would have deleted it`, { basename })
				}
				else {
					logger.verbose(`encountered trash, cleaning it…`, { basename })
					pending_tasks.push(fs_extra.remove(abs_path_target))
				}
				return
			}

			db = DB.on_file_found(db, id, basename)
		})

		logger.groupEnd()

		await Promise.all(pending_tasks)
		on_task_finished(TASK_ID)
	}

	async function query_fs_stats(id: RelativePath): Promise<void> {
		logger.trace(`initiating fs stats query for "${id}"…`)
		const TASK_ID = 'query_fs_stats'
		on_new_task(TASK_ID)

		const abs_path = DB.get_absolute_path(db, id)
		const stats = await util.promisify(fs.stat)(abs_path)
		logger.trace(`- got fs stats data for "${id}"…`)
		db = DB.on_fs_stats_read(db, id, get_fs_stats_subset(stats))

		on_task_finished(TASK_ID)
	}

	async function query_exif(id: RelativePath): Promise<void> {
		logger.trace(`initiating exif query for "${id}"…`)
		const TASK_ID = 'query_exif'
		on_new_task(TASK_ID)

		const abs_path = DB.get_absolute_path(db, id)
		const exif_data = await exiftool.read(abs_path)
		logger.trace(`- got exif data for "${id}"…`)
		db = DB.on_exif_read(db, id, exif_data)

		on_task_finished(TASK_ID)
	}

	async function compute_hash(id: RelativePath): Promise<void> {
		logger.trace(`computing hash for "${id}"…`)
		const TASK_ID = 'hash'
		on_new_task(TASK_ID)

		const abs_path = DB.get_absolute_path(db, id)
		// TODO time limit + cache
		const hash = await get_file_hash(abs_path)

		db = DB.on_hash_computed(db, id, hash!)

		on_task_finished(TASK_ID)
	}

	async function load_notes(path: RelativePath): Promise<void> {
		logger.trace(`loading notes from "${path}"…`)
		on_new_task(TASK_ID)

		const abs_path = DB.get_absolute_path(db, path)
		const data = await json.read(abs_path)
		assert(data?.schema_version, 'load_notes()')

		db = DB.on_notes_found(db, data)

		on_task_finished(TASK_ID)
	}

	async function persist_notes(data: Immutable<Notes.State>, folder_path: RelativePath = '.'): Promise<void> {
		const abs_path = path.join(DB.get_absolute_path(db, folder_path), NOTES_BASENAME)
		logger.info(`persisting ${Object.keys(data.encountered_files).length} notes and ${Object.keys(data.known_modifications_new_to_old).length} redirects into: "${abs_path}"…`)
		on_new_task(TASK_ID)

		try {
			// always write, even in dry run
			// this is not risky
			// the oldest = the more authoritative
			await json.write(abs_path, data)
		}
		catch (err) {
			if (PARAMS.dry_run) {
				// swallow
			}
			else
				throw err
		}

		on_task_finished(TASK_ID)
	}

	async function normalize_file(id: RelativePath): Promise<void> {
		logger.trace(`initiating media file normalization for "${id}"…`)
		on_new_task(TASK_ID)

		const actions: Promise<void>[] = []

		//const abs_path = DB.get_absolute_path(db, id)
		const media_state = db.files[id]
		assert(media_state, 'normalize_file() media_state')

		const is_exif_powered = File.is_exif_powered_media_file(media_state)
		//console.log({ id, media_state, abs_path, is_exif_powered})

		if (is_exif_powered) {
			const current_exif_data: any = media_state.current_exif_data
			if (current_exif_data.Orientation) {
				// TODO one day NOTE will need hash chaining
				/*if (PARAMS.dry_run) {
					logger.info('DRY RUN would have losslessly rotated according to EXIF orientation', current_exif_data.Orientation)
				}
				else {
					logger.error('TODO losslessly rotated according to EXIF orientation', current_exif_data.Orientation)
				}*/
			}
		}

		// TODO fix birthtime

		const current_basename = File.get_current_basename(media_state)
		const target_basename = File.get_ideal_basename(media_state)
		if (current_basename !== target_basename) {
			const relative_target_path = path.join(File.get_current_parent_folder_id(media_state), target_basename)
			if (!DB.is_file_existing(db, relative_target_path)) {
				if (PARAMS.dry_run) {
					logger.info('DRY RUN would have renamed ' + current_basename + ' to ' + target_basename)
				}
				else {
					actions.push(
						move_file(id, relative_target_path)
					)
				}
			}
		}

		await Promise.all(actions)

		on_task_finished(TASK_ID)
	}

	async function ensure_folder(id: RelativePath): Promise<void> {
		logger.verbose(`- ensuring dir "${id}" exists…`)
		on_new_task(TASK_ID)

		const is_existing_according_to_db = DB.is_folder_existing(db, id)
		//logger.log('so far:', { is_existing_according_to_db })
		if (is_existing_according_to_db) return

		const abs_path = DB.get_absolute_path(db, id)

		if (PARAMS.dry_run) {
			logger.verbose('DRY RUN would have created folder: ' + id)
		}
		else {
			await util.promisify(fs_extra.mkdirp)(abs_path)
			DB.on_folder_found(db, '.', id)
		}

		on_task_finished(TASK_ID)
	}

	async function delete_file(id: RelativePath): Promise<void> {
		logger.trace(`- deleting file "${id}"…`)
		on_new_task(TASK_ID)

		const abs_path = DB.get_absolute_path(db, id)

		if (PARAMS.dry_run) {
			logger.info('DRY RUN would have deleted ' + abs_path)
		}
		else {
			logger.info('deleting… ' + abs_path)
			await util.promisify(fs.rm)(abs_path)
			db = DB.on_file_deleted(db, id)
		}

		on_task_finished(TASK_ID)
	}

	async function move_file(id: RelativePath, target_id: RelativePath): Promise<void> {
		logger.trace(`- moving/renaming file from "${id}" to "${target_id}"…`)
		on_new_task(TASK_ID)

		const parsed = path.parse(id)
		const parsed_target = path.parse(target_id)
		const is_renaming = parsed.base !== parsed_target.base
		const is_moving = id.split('/').slice(0, -1).join('/') !== target_id.split('/').slice(0, -1).join('/')
		assert(is_moving || is_renaming, `move_file() should do sth`)

		if (is_moving) {
			logger.verbose(`- moving file from "${id}" to "${target_id}"…`)
		}
		else {
			logger.verbose(`- renaming file in-place from "${parsed.base}" to "${parsed_target.base}"…`)
		}
		if (is_renaming && get_params().is_perfect_state) {
			assert(
				!is_already_normalized(parsed.base),
				`PERFECT STATE an already normalized basename "${parsed.base}" should not be renamed! to "${parsed_target.base}"`
			)
		}

		const abs_path = DB.get_absolute_path(db, id)
		const abs_path_target = DB.get_absolute_path(db, target_id)

		if (PARAMS.dry_run) {
			logger.info('DRY RUN would have moved' + abs_path + ' to ' + abs_path_target)
		}
		else {
			await util.promisify(fs_extra.mkdirp)(abs_path_target.split(path.sep).slice(0, -1).join(path.sep))
			await util.promisify(fs.rename)(abs_path, abs_path_target)
			db = DB.on_file_moved(db, id, target_id)
		}

		on_task_finished(TASK_ID)
	}

	TODO clean folder if empty
	TODO leave undated files in event folder
	
////////////////////////////////////

	async function asyncjs_iteratee(action: Immutable<Action>): Promise<void> {
		switch (action.type) {

			/////// READ

			case ActionType.explore_folder:
				await explore_folder(action.id)
				break

			case ActionType.query_fs_stats:
				await query_fs_stats(action.id)
				break

			case ActionType.query_exif:
				await query_exif(action.id)
				break

			case ActionType.hash:
				await compute_hash(action.id)
				break

			case ActionType.load_notes:
				await load_notes(action.path)
				break

			/////// WRITE

			case ActionType.persist_notes:
				await persist_notes(action.data, action.folder_path)
				break

			case ActionType.normalize_file:
				//assert(!PARAMS.dry_run, 'no normalize_file action in dry run mode')
				await normalize_file(action.id)
				break

			case ActionType.ensure_folder:
				//assert(!PARAMS.dry_run, 'no ensure_folder action in dry run mode')
				await ensure_folder(action.id)
				break

			case ActionType.delete_file:
				//assert(!PARAMS.dry_run, 'no delete action in dry run mode')
				await delete_file(action.id)
				break

			case ActionType.move_file:
				//assert(!PARAMS.dry_run, 'no write action in dry run mode')
				await move_file(action.id, action.target_id)
				break

			default:
				throw new Error(`action not implemented: "${(action as any).type}"!`)
		}
	}

	function dequeue_and_run_all_first_level_db_actions(): Promise<any>[] {
		const actions = DB.get_pending_actions(db)
		db = DB.discard_all_pending_actions(db)

		return actions.map(asyncjs_iteratee)
	}

	function run_and_wait_for_queued_actions(): Promise<void> {
		// trivial recursive version, may not scale well TODO improve when scaling issues
		const running_actions = dequeue_and_run_all_first_level_db_actions()
			.map(running_action => running_action.then(run_and_wait_for_queued_actions))

		return Promise.all(running_actions).then(() => {})
	}

	try {
		await run_and_wait_for_queued_actions()
	}
	catch (err) {
		throw err
	}
	finally {
		// stop all bars
		progress_multibar.stop()
	}

	return db
}
