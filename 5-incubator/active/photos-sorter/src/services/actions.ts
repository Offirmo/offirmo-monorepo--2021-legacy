import path from 'path'
import util from 'util'
import fs from 'fs'
import assert from 'tiny-invariant'
import json from '@offirmo/cli-toolbox/fs/json'
import { Immutable } from '@offirmo-private/ts-types'
import { exiftool } from 'exiftool-vendored'
import { NORMALIZERS } from '@offirmo-private/normalize-string'
import { checkPathsSync as throw_if_identical_sync } from 'fs-extra/lib/util/stat.js'

import { AbsolutePath, RelativePath } from '../types'
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
import { is_normalized_media_basename } from './name_parser'
import { FolderId } from '../state/folder'

function _is_same_inode(abs_path_a: AbsolutePath, abs_path_b: AbsolutePath): boolean {
	// abusing an internal non-documented function of fs-extra
	try {
		throw_if_identical_sync(abs_path_a, abs_path_b)
		return false
	}
	catch (err) {
		if (err.message.includes('Source and destination must not be the same'))
			return true
	}
	return false
}

export async function exec_pending_actions_recursively_until_no_more(db: Immutable<State>): Promise<Immutable<State>> {

	const PARAMS = get_params()
	const display_progress = false // activating sort of turns off wrapping in iTerm = bad for debug

	// https://www.npmjs.com/package/cli-progress
	const progress_multibar = null as any /*display_progress ? new (require('cli-progress')).MultiBar({
		clearOnComplete: false,
		linewrap: null,
		hideCursor: null,
		forceRedraw: true,
		barsize: 80,
		format: '{name} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}'
	}, cli_progress.Presets.shades_grey) : null*/

	const progress_bars: { [id: string]: { size: number, bar: any }} = {}
	function on_new_task(id: string) {
		if (!display_progress) return

		progress_bars[id] ??= {
			size: 0,
			bar: progress_multibar.create(0, 0),
		}

		progress_bars[id].size++
		progress_bars[id].bar.setTotal(progress_bars[id].size)
		progress_bars[id].bar.update(0, {name: id.padEnd(14)})
	}
	function on_task_finished(id: string) {
		if (!display_progress) return

		progress_bars[id].bar.increment()
	}

	////////////////////////////////////
	const TASK_ID = 'other'

	function _on_error(TASK_ID: string, err: Error, details: any): void {
		logger.error(`Error when processing task "${TASK_ID}"`, { err, ...details })
	}

	// read only
	async function explore_folder(id: RelativePath): Promise<void> {
		logger.trace(`initiating explore_folder "${id}"…`)
		const TASK_ID = 'explore_folder'
		on_new_task(TASK_ID)

		try {
			let pending_tasks: Promise<void>[] = []

			const abs_path = DB.get_absolute_path(db, id)

			logger.group(`- exploring dir "${id}"…`)
			try {
				// TODO async
				const sub_dirs = fs_extra.lsDirsSync(abs_path, { full_path: false })
				sub_dirs
					.forEach((sub_id: RelativePath) => {
						db = DB.on_folder_found(db, id, sub_id)
					})

				const sub_file_basenames = fs_extra.lsFilesSync(abs_path, { full_path: false })
				sub_file_basenames
					.forEach((basename: RelativePath) => {
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
			}
			catch (err) {
				throw err
			}
			finally {
				logger.groupEnd()
			}

			await Promise.all(pending_tasks)
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function query_fs_stats(id: RelativePath): Promise<void> {
		logger.trace(`initiating fs stats query for "${id}"…`)
		const TASK_ID = 'query_fs_stats'
		on_new_task(TASK_ID)

		try {
			const abs_path = DB.get_absolute_path(db, id)
			const stats = await util.promisify(fs.stat)(abs_path)
			logger.trace(`- got fs stats data for "${id}"…`)
			db = DB.on_fs_stats_read(db, id, get_fs_stats_subset(stats))
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function query_exif(id: RelativePath): Promise<void> {
		logger.trace(`initiating exif query for "${id}"…`)
		const TASK_ID = 'query_exif'
		on_new_task(TASK_ID)

		try {
			const abs_path = DB.get_absolute_path(db, id)
			const exif_data = await exiftool.read(abs_path)
			logger.trace(`- got exif data for "${id}"…`)
			db = DB.on_exif_read(db, id, exif_data)
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function compute_hash(id: RelativePath): Promise<void> {
		logger.trace(`computing hash for "${id}"…`)
		const TASK_ID = 'hash'
		on_new_task(TASK_ID)

		try {
			const abs_path = DB.get_absolute_path(db, id)
			// TODO time limit + cache
			const hash = await get_file_hash(abs_path)
			logger.trace(`- got hash for "${id}""`, { hash })
			db = DB.on_hash_computed(db, id, hash!)
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function load_notes(path: RelativePath): Promise<void> {
		logger.trace(`loading notes from "${path}"…`)
		const TASK_ID = 'load_notes'
		on_new_task(TASK_ID)

		try {
			const abs_path = DB.get_absolute_path(db, path)
			const data = await json.read(abs_path)
			assert(data?.schema_version, 'load_notes()')
			db = DB.on_notes_found(db, data)
		}
		catch (err) {
			_on_error(TASK_ID, err, { path })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	// write
	async function ensure_folder(id: RelativePath): Promise<void> {
		logger.verbose(`- ensuring dir "${id}" exists…`)
		const TASK_ID = 'ensure_folder'
		on_new_task(TASK_ID)

		try {
			const is_existing_according_to_db = DB.is_folder_existing(db, id)
			//logger.log('so far:', { is_existing_according_to_db })
			if (is_existing_according_to_db) return

			if (PARAMS.dry_run) {
				logger.verbose('DRY RUN would have created folder: ' + id)
			}
			else {
				const abs_path = DB.get_absolute_path(db, id)
				await util.promisify(fs_extra.mkdirp)(abs_path)
				if (!DB.is_folder_existing(db, id)) { // re-check in case of race conditions
					// Note: can still fail due to case/unicode normalization
					// no big deal
					db = DB.on_folder_found(db, '.', id)
				}
			}
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function delete_file(id: RelativePath): Promise<void> {
		logger.trace(`- deleting file "${id}"…`)
		const TASK_ID = 'delete_file'
		on_new_task(TASK_ID)

		try {
			const abs_path = DB.get_absolute_path(db, id)

			if (PARAMS.dry_run) {
				logger.info('DRY RUN would have deleted file ' + abs_path)
			}
			else {
				logger.info('deleting file… ' + abs_path)
				await util.promisify(fs.rm)(abs_path)
				db = DB.on_file_deleted(db, id)
			}
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function persist_notes(data: Immutable<Notes.State>, folder_path: RelativePath = '.'): Promise<void> {
		const abs_path = path.join(DB.get_absolute_path(db, folder_path), NOTES_BASENAME)
		logger.info(`persisting ${Object.keys(data.encountered_files).length} notes and ${Object.keys(data.known_modifications_new_to_old).length} redirects into: "${abs_path}"…`)
		const TASK_ID = 'persist_notes'
		on_new_task(TASK_ID)

		try {
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
		}
		catch (err) {
			_on_error(TASK_ID, err, { folder_path })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	// intelligently = will avoid conflicts at the target location by using a copy marker (x)
	// needs to be sync bc we'll do a check for conflict = race condition
	// expecting the folder to be pre-existing
	function _intelligently_normalize_file_basename_sync(
		id: RelativePath,
		target_folder: FolderId = File.get_current_parent_folder_id(db.files[id])
	): void {
		const current_file_state = db.files[id]
		assert(current_file_state, `_intelligently_normalize_file_basename_sync() should have current_file_state "${id}"`)

		let copy_marker: 'none' | 'preserve' | number = 'none'
		let target_basename = File.get_ideal_basename(current_file_state, { copy_marker })

		// there will be a change, ensure there is no conflict:
		const abs_path_current = DB.get_absolute_path(db, id)
		let good_target_found = false
		do {
			target_basename = File.get_ideal_basename(current_file_state, { copy_marker })
			const id_target = path.join(target_folder, target_basename)
			if (id === id_target) {
				// perfect! Nothing to do!
				return
			}
			const abs_path_target = DB.get_absolute_path(db, id_target)

			if (!DB.is_file_existing(db, id_target) && !fs_extra.pathExistsSync(DB.get_absolute_path(db, id_target))) {
				// good, fs target emplacement is free
				good_target_found = true
				break
			}

			// some FS are doing unicode normalization automatically
			// also some FS are NOT case-sensitive
			// hence it's hard to know if we have a real conflict or if it's the same file...
			// https://github.com/jprichardson/node-fs-extra/issues/859
			if (_is_same_inode(abs_path_current, abs_path_target)) {
				// same file but name is not ideal = unicode, case sensitive
				// will be taken care of later
				good_target_found = true
				break
			}

			// not free, try an alternative basename
			switch (copy_marker) {
				case 'none':
					copy_marker = 'preserve'
					break
				case 'preserve':
					copy_marker = 1
					break
				default:
					copy_marker = copy_marker++
					break
			}
		} while (!good_target_found && (typeof copy_marker !== 'number' || copy_marker <= 10))

		const target_id = path.join(target_folder, target_basename)

		if (!good_target_found) {
			logger.warn(`Couldn't rename "${id}" to a proper normalized name "${target_id}" due to conflicts...`)
		}
		else {
			if (PARAMS.dry_run) {
				logger.info(`DRY RUN would have renamed/moved "${id}" to "${target_id}"`)
			}
			else {
				console.log(`about to rename/move "${id}" to "${target_id}"…`)
				// NO, we don't use the "move" action, we need to be sync for race condition reasons
				const abs_path_target = DB.get_absolute_path(db, target_id)
				try {
					fs_extra.moveSync(abs_path_current, abs_path_target)
					db = DB.on_file_moved(db, id, target_id)
				} catch (err) {
					if (err.message.includes('Source and destination must not be the same')) {
						// this may happens for unicode normalization or case-sensitivity of the underlying FS
						assert(NORMALIZERS.normalize_unicode(id.toLowerCase()) === NORMALIZERS.normalize_unicode(target_id.toLowerCase()), 'expecting real identity')
						const intermediate_target_id = path.join(target_folder, File.get_ideal_basename(current_file_state, { copy_marker: 'temp' }))
						const intermediate_target_abs_path = DB.get_absolute_path(db, intermediate_target_id)
						fs_extra.moveSync(abs_path_current, intermediate_target_abs_path)
						fs_extra.moveSync(intermediate_target_abs_path, abs_path_target)
						db = DB.on_file_moved(db, id, target_id)
					}
					else {
						logger.error('norm: #3 error', {
							id,
							target_id,
							id_equality: id === target_id,
							id_equality_u: NORMALIZERS.normalize_unicode(id) === NORMALIZERS.normalize_unicode(target_id),
							abs_path_current,
							abs_path_target,
							path_equality: abs_path_current === abs_path_target,
							path_equality_u: NORMALIZERS.normalize_unicode(abs_path_current) === NORMALIZERS.normalize_unicode(abs_path_target),
							err,
						})
					}
				}
			}
		}
	}

	async function move_file_to_ideal_location(id: RelativePath): Promise<void> {
		const target_id = DB.get_ideal_file_relative_path(db, id)
		logger.trace(`- moving/renaming file "${id}" to its ideal location "${target_id}"…`)
		const TASK_ID = 'move_file_to_ideal_location'
		on_new_task(TASK_ID)

		try {
			const parsed = path.parse(id)
			const parsed_target = path.parse(target_id)
			const is_renaming = parsed.base !== parsed_target.base
			const is_moving = id.split('/').slice(0, -1).join('/') !== target_id.split('/').slice(0, -1).join('/')
			assert(is_moving || is_renaming, `move_file_to_ideal_location() should do sth`)

			if (is_moving) {
				logger.verbose(`- moving file from "${id}" to "${target_id}"…`)
			}
			else {
				logger.verbose(`- renaming file in-place from "${parsed.base}" to ideally "${parsed_target.base}"…`)
			}

			/*
			if (get_params().is_perfect_state && File.is_media_file() && File.get_confidence_in_date()) {
				assert(
					is_normalized_media_basename(parsed.base),
					`PERFECT STATE when moving to ideal location, file "${parsed.base}" is expected to be already normalized to "${parsed_target.base}"`
				)
			}*/

			const abs_path = DB.get_absolute_path(db, id)
			const abs_path_target = DB.get_absolute_path(db, target_id)

			if (PARAMS.dry_run) {
				logger.info('DRY RUN would have moved' + abs_path + ' to ' + abs_path_target)
			}
			else {
				const target_folder_id = DB.get_ideal_file_relative_folder(db, id)
				await ensure_folder(target_folder_id)
				_intelligently_normalize_file_basename_sync(id, target_folder_id)
			}
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function normalize_file(id: RelativePath): Promise<void> {
		logger.trace(`initiating file normalization for "${id}"…`)
		const TASK_ID = 'normalize_file'
		on_new_task(TASK_ID)

		try {
			const file_state = db.files[id]
			assert(file_state, 'normalize_file() file_state')

			if (File.is_exif_powered_media_file(file_state)) {
				const current_exif_data: any = file_state.current_exif_data
				// https://www.impulseadventure.com/photo/exif-orientation.html
				if (current_exif_data.Orientation > 1) {
					// https://www.impulseadventure.com/photo/lossless-rotation.html
					if (PARAMS.dry_run) {
						logger.info('DRY RUN would have losslessly rotated according to EXIF orientation', current_exif_data.Orientation)
					}
					else {
						logger.info(`TODO losslessly rotate "${id}" according to EXIF orientation`, current_exif_data.Orientation)
						// TODO one day NOTE will need hash chaining
					}
				}
			}

			if (File.is_media_file(file_state) && File.get_confidence_in_date(file_state)) {
				// TODO fix birthtime if wrong
			}

			_intelligently_normalize_file_basename_sync(id)
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

	async function delete_folder_if_empty(id: RelativePath): Promise<void> {
		logger.trace(`- deleting folder if it's empty "${id}"…`)
		const TASK_ID = 'delete_folder_if_empty'
		on_new_task(TASK_ID)

		try {
			const abs_path = DB.get_absolute_path(db, id)

			const children = [
				...fs_extra.lsDirsSync(abs_path, { full_path: false }),
				...fs_extra.lsFilesSync(abs_path, { full_path: false }),
			]
			if (children.length === 0) {
				if (PARAMS.dry_run) {
					logger.info('DRY RUN would have deleted empty folder ' + abs_path)
				}
				else {
					logger.info('deleting empty folder… ' + abs_path)
					await util.promisify(fs_extra.remove)(abs_path)
					db = DB.on_folder_deleted(db, id)
				}
			}
		}
		catch (err) {
			_on_error(TASK_ID, err, { id })
		}
		finally {
			on_task_finished(TASK_ID)
		}
	}

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

			case ActionType.move_file_to_ideal_location:
				//assert(!PARAMS.dry_run, 'no write action in dry run mode')
				await move_file_to_ideal_location(action.id)
				break

			case ActionType.delete_folder_if_empty:
				//assert(!PARAMS.dry_run, 'no write action in dry run mode')
				await delete_folder_if_empty(action.id)
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
		if (display_progress) progress_multibar.stop()
	}

	return db
}
