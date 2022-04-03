import path from 'path'
import util from 'util'
import fs from 'fs'
import assert from 'tiny-invariant'
import async from 'async'
import json from '@offirmo/cli-toolbox/fs/json'
import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'
import { normalizeError } from '@offirmo/error-utils'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { Basename, RelativePath } from '../types'
import { NOTES_BASENAME_SUFFIX_LC } from '../consts'
import { get_params, Params } from '../params'

import * as File from '../state/file'
import * as Notes from '../state/notes'
import * as DB from '../state/db'
import { State } from '../state/db'
import { Action, ActionType } from '../state/actions'

import logger from './logger'
import fs_extra, { _is_same_inode } from './fs-extra'
import { get_relevant_fs_stats_subset } from './fs_stats'
import get_file_hash from './hash'
import { pathㆍparse_memoized } from './name_parser'
import { FolderId, SPECIAL_FOLDERⵧINBOX__BASENAME } from '../state/folder'
import { FileId } from '../state/file'
import { read_exif_data } from './exif'

////////////////////////////////////

const _report = {
	file_count: 0,
	folder_count: 0,
	file_deletions: [] as FileId[],
	file_renamings: {} as { [k: string]: Basename },
	file_moves: {} as { [k: string]: FolderId },
	folder_deletions: [] as FolderId[],
	error_count: 0,

	phases_duration_ms: {} as { [k: string]: number },
}

export async function exec_pending_actions_recursively_until_no_more(db: Immutable<State>, debug_id: string, PARAMS: Immutable<Params> = get_params()): Promise<Immutable<State>> {
	logger.trace(`executing actions from "${debug_id}"…`)

	const start_date_ms = get_UTC_timestamp_ms()

	const display_progress = true // activating sort of turns off wrapping in iTerm = bad for debug

	// https://www.npmjs.com/package/cli-progress
	let progress_multibar = null as any
	if (display_progress) {
		const CliProgress = require('cli-progress')
		progress_multibar = new CliProgress.MultiBar({
			clearOnComplete: false,
			linewrap: null,
			hideCursor: null,
			forceRedraw: true,
			barsize: 80,
			format: '{name} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}'
		}, CliProgress.Presets.shades_grey)
	}

	const progress_bars: { [id: string]: { size: number, bar: any }} = {}
	const PROGRESS_ID__OVERALL = 'overall'
	function on_new_tasks(id: string, count: number = 1) {
		if (!display_progress) return

		if (!progress_bars[id]) {
			progress_bars[id] = {
				size: 0,
				bar: progress_multibar.create(0, 0, {name: id.padEnd(14)}),
			}
		}

		progress_bars[id].size += count
		progress_bars[id].bar.setTotal(progress_bars[id].size)
		//progress_bars[id].bar.update(/*0,*/ {name: id.padEnd(14)})
	}
	function on_task_finished(id: string) {
		if (!display_progress) return

		progress_bars[id].bar.increment()
	}

	////////////////////////////////////

	function _on_error(TASK_ID: string, err: Error, details: any): void {
		_report.error_count++
		logger.error(`Error when processing task "${TASK_ID}"`, { err, ...details })
	}

	// read only
	async function explore_folder(id: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating explore_folder "${id}"…`)

		try {
			let pending_tasks: Promise<void>[] = []

			const abs_path = DB.get_absolute_path(db, id)

			logger.group(`- exploring dir "${id}"…`)
			try {
				// TODO async
				const sub_dirs = fs_extra.lsDirsSync(abs_path, { full_path: false })
				sub_dirs
					.forEach((sub_id: RelativePath) => {
						_report.folder_count++
						db = DB.on_folder_found(db, id, sub_id)
					})

				const sub_file_basenames = fs_extra.lsFilesSync(abs_path, { full_path: false })
				sub_file_basenames
					.forEach((basename: Basename) => {
						//const normalized_extension TODO
						const basename_lc = basename.toLowerCase()
						const should_delete_asap = !!PARAMS.extensions_to_delete‿lc.find(ext => basename_lc.endsWith(ext))
							|| PARAMS.worthless_file_basenames‿lc.includes(basename_lc)
						if (should_delete_asap) {
							const abs_path_target = DB.get_absolute_path(db, path.join(id, basename))
							if (PARAMS.dry_run) {
								logger.verbose(`✍️ encountered trash, DRY RUN would have deleted it`, { basename })
							}
							else {
								logger.verbose(`✍️ encountered trash, cleaning it…`, { basename })
								pending_tasks.push(fs_extra.remove(abs_path_target))
							}
							return
						}

						_report.file_count++
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
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.explore_folder, err, { id })
		}
	}

	async function query_fs_stats(id: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating query_fs_stats for "${id}"…`)

		try {
			const abs_path = DB.get_absolute_path(db, id)
			const stats = await util.promisify(fs.stat)(abs_path)
			logger.silly(`- got fs stats data for "${id}"…`)
			db = DB.on_fs_stats_read(db, id, get_relevant_fs_stats_subset(stats))
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.query_fs_stats, err, { id })
		}
	}

	async function query_exif(id: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating query_exif for "${id}"…`)

		try {
			const abs_path = DB.get_absolute_path(db, id)
			const exif_data = await read_exif_data(abs_path)
			logger.trace(`- got exif data for "${id}"…`)
			db = DB.on_exif_read(db, id, exif_data)
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.query_exif, err, { id })
		}
	}

	async function compute_hash(id: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating compute_hash for "${id}"…`)

		try {
			const abs_path = DB.get_absolute_path(db, id)
			const hash = await get_file_hash(abs_path)
			logger.silly(`- got hash for "${id}""`, { hash })
			db = DB.on_hash_computed(db, id, hash!)
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.hash, err, { id })
		}
	}

	async function load_notes(path: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating load_notes from "${path}"…`)

		try {
			const abs_path = DB.get_absolute_path(db, path)
			const data = await json.read(abs_path)
			assert(data?.schema_version, 'load_notes()')
			db = DB.on_note_file_found(db, data)
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.load_notes, err, { path })
		}
	}

	// write

	// because of unicode normalization, we have to check the OS for the existence of the folder :-(
	// since we never delete until the end
	async function ensure_folder(id: RelativePath): Promise<void> {
		const split_path = id.split(path.sep)
		const depth = split_path.length
		logger.trace(`[Action] initiating ensure_folder "${id}"…`, { depth })

		assert(
			split_path[0] !== SPECIAL_FOLDERⵧINBOX__BASENAME || id === SPECIAL_FOLDERⵧINBOX__BASENAME,
			`ensure_folder() should never create a subfolder in inbox!`
		)
		try {
			const is_existing_according_to_db = DB.is_folder_existing(db, id)
			//logger.log('so far:', { is_existing_according_to_db })
			if (is_existing_according_to_db) {
				// may happen:
				// - because we just call this func out of safety
				// - because this func is recursive
				// So don't bother, all good.
				return
			}

			if (depth > 1) {
				await ensure_folder(split_path.slice(0, -1).join(path.sep))
			}

			const abs_path = DB.get_absolute_path(db, id)
			const is_existing_according_to_fs = fs.existsSync(abs_path)
			if (is_existing_according_to_fs) {
				// The path exists but we don't have it in DB
				// possible cases:
				// - (most common) multiple "move_file_to_ideal_location()" actions at the time cause concurrent call to this. Completely normal.
				// - the exact same folder was externally created concurrently to our code running (theoritical, should never happen)
				// - the OS sneakily did unicode normalization :-( TODO fix by normalizing
				// TODO one day: normalize the folders unicode (do it during explore, simpler)
				//logger.warn('ensure_folder(): folder already exists in fs?', { id })
			}
			else if (PARAMS.dry_run) {
				logger.verbose('✍️ DRY RUN would have created folder: ' + id)
			}
			else {
				logger.verbose(`- ✍️ creating dir "${id}"…`)
				logger.log(`💾 mkdirp("${abs_path}")`)
				await util.promisify(fs_extra.mkdirp)(abs_path)
				if (DB.is_folder_existing(db, id)) {
					// race condition while await-ing mkdirp, can happen?
					logger.warn('ensure_folder(): existing in DB after I created it?', { id })
				}
				else {
					db = DB.on_folder_found(db,
						'.',
						id,
						true, // will prevent a useless "explore" from being triggered. We know the folder is empty, we just created it!
					)
				}
			}
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.ensure_folder, err, { id })
		}
	}

	async function delete_file(id: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating  "${id}"…`)
		logger.verbose(`- ✍️ deleting file "${id}"…`)

		try {
			const abs_path = DB.get_absolute_path(db, id)

			_report.file_deletions.push(id)
			if (PARAMS.dry_run) {
				logger.info('DRY RUN would have deleted file ' + abs_path)
			}
			else {
				logger.info('deleting file… ' + abs_path)
				logger.log(`💾 rm("${abs_path}")`)
				await util.promisify(fs.rm)(abs_path)
				db = DB.on_file_deleted(db, id)
			}
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.delete_file, err, { id })
		}
	}

	async function persist_notes(folder_path: RelativePath = '.', data: Immutable<Notes.State> | undefined): Promise<void> {
		logger.trace(`[Action] initiating persist_notes "${folder_path}"…`)
		logger.verbose(`- ✍️ persisting notes into "${folder_path}"…`)

		data = data ?? DB.get_past_and_present_notes(db)
		const relative_path = path.join(folder_path, NOTES_BASENAME_SUFFIX_LC)
		const abs_path = DB.get_absolute_path(db, relative_path)
		logger.info(`persisting ${Object.keys(data.encountered_files).length} notes and ${Object.keys(data.known_modifications_new_to_old).length} redirects into: "${abs_path}"…`)

		try {
			try {
				// always write, even in dry run
				// this is not risky
				// the oldest = the more authoritative
				logger.log(`💾 json.write("${abs_path}", {…})`)
				await json.write(abs_path, data)
				if (DB.is_file_existing(db, relative_path)) {
					// ok, we just updated an existing note file
				}
				else {
					db = DB.on_file_found(db,
						'.',
						relative_path,
						true, // will prevent a useless note read and merge. Wouldn't bring anything!
					)
				}
			}
			catch (err) {
				if (PARAMS.dry_run) {
					// swallow
				}
				else {
					// propagate
					throw err
				}
			}
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.persist_notes, err, { folder_path })
		}
	}

	// sub-function of move_file_to_ideal_location() and normalize_file()
	// - "intelligently" = will avoid conflicts at the target location by using a copy marker (x)
	// - needs to be sync bc we'll do a check for conflict = race condition
	// - expecting the folder to be pre-existing
	function _intelligently_normalize_file_basename_sync(
		id: RelativePath,
		target_folder: FolderId = File.get_current_parent_folder_id(db.files[id])
	): void {
		logger.trace(`[Action] (sub-INFB) _intelligently_normalize_file_basename_sync() "${id}"…`)

		const current_file_state = db.files[id]
		assert(current_file_state, `_intelligently_normalize_file_basename_sync() should have current_file_state "${id}"`)

		let copy_marker: 'none' | 'preserve' | number = 'none'
		let target_basename: Basename = '(pending)'

		// there will be a change, ensure there is no conflict:
		const abs_pathⵧcurrent = DB.get_absolute_path(db, id)
		let good_target_found = false
		let safety = 15
		do {
			safety--
			logger.trace('INFB (still) looking for the ideal normalized basename…', { id, target_folder, safety })
			target_basename = File.get_ideal_basename(current_file_state, { copy_marker })
			const target_id = path.join(target_folder, target_basename)
			if (id === target_id) {
				// perfect! Nothing to do!
				return
			}

			const abs_pathⵧtarget = DB.get_absolute_path(db, target_id)

			/*logger.trace('intermediate infos 1', {
				target_basename,
				target_id,
				abs_pathⵧtarget,
				'DB.is_file_existing': DB.is_file_existing(db, target_id),
				'fs_extra.pathExistsSync': fs_extra.pathExistsSync(abs_pathⵧtarget),
			})*/

			if (!DB.is_file_existing(db, target_id) && !fs_extra.pathExistsSync(abs_pathⵧtarget)) {
				// good, fs target emplacement is free
				good_target_found = true
				break
			}

			/*logger.trace('intermediate infos 2', {
				abs_pathⵧcurrent,
				abs_pathⵧtarget,
				'_is_same_inode': _is_same_inode(abs_pathⵧcurrent, abs_pathⵧtarget),
			})*/

			// some FS are doing unicode normalization automatically
			// also some FS are NOT case-sensitive
			// hence it's hard to know if we have a real conflict or if it's the same file...
			// https://github.com/jprichardson/node-fs-extra/issues/859
			if (_is_same_inode(abs_pathⵧcurrent, abs_pathⵧtarget)) {
				// same file but name is not ideal = unicode, case sensitive
				// will be taken care of later
				good_target_found = true
				break
			}

			/*logger.trace('intermediate infos 3', {
				copy_marker,
			})*/

			// not free, try an alternative basename
			// TODO seen cases of copy markers looping, investigate and fix
			switch (copy_marker) {
				case 'none':
					copy_marker = 'preserve'
					break
				case 'preserve':
					copy_marker = 1
					break
				default:
					copy_marker += 1
					break
			}
		} while (safety > 0 && !good_target_found && (typeof copy_marker !== 'number' || copy_marker <= 10))
		assert(safety, 'no infinite loop')

		const target_id = path.join(target_folder, target_basename)

		if (!good_target_found) {
			logger.error(`Couldn't rename "${id}" to a proper normalized name "${target_id}" due to conflicts...`)
			assert(good_target_found, 'should be able to normalize files. Could there be a bug?') // seen, was a bug
		}
		else {
			const abs_pathⵧtarget = DB.get_absolute_path(db, target_id)
			const source_norm = NORMALIZERS.normalize_unicode(abs_pathⵧcurrent)
			const target_norm = NORMALIZERS.normalize_unicode(abs_pathⵧtarget)
			if (source_norm === target_norm) {
				// TODO one day normalize the folders
				return
			}

			if (File.get_current_basename(current_file_state) !== target_basename) {
				_report.file_renamings[id] = target_basename
				logger.verbose(`✍️ about to normalize:rename "${id}" to "${target_id}"…`)
			}
			if (File.get_current_parent_folder_id(current_file_state) !== target_folder) {
				_report.file_moves[id] = target_folder
				logger.verbose(`✍️ about to normalize:move "${id}" to "${target_id}"…`)
			}

			if (PARAMS.dry_run) {
				logger.verbose(`✍️ DRY RUN would have renamed/moved "${id}" to "${target_id}"`)
			}
			else {
				//logger.trace(`about to rename/move "${id}" to "${target_id}"…`)

				// TODO NOW fix unicode normalization?

				// NO, we don't use the "move" action, we need to be sync for race condition reasons
				try {
					logger.log(`💾 move("${abs_pathⵧcurrent}", "${abs_pathⵧtarget}")`)
					fs_extra.moveSync(abs_pathⵧcurrent, abs_pathⵧtarget)
					db = DB.on_file_moved(db, id, target_id)
				}
				catch (_err) {
					const err = normalizeError(_err)
					if (err.message.includes('Source and destination must not be the same')) {
						// this may happens for unicode normalization or case-sensitivity of the underlying FS
						assert(NORMALIZERS.normalize_unicode(id.toLowerCase()) === NORMALIZERS.normalize_unicode(target_id.toLowerCase()), 'expecting real identity')
						const intermediate_target_id = path.join(target_folder, File.get_ideal_basename(current_file_state, { copy_marker: 'temp' }))
						const intermediate_target_abs_path = DB.get_absolute_path(db, intermediate_target_id)
						fs_extra.moveSync(abs_pathⵧcurrent, intermediate_target_abs_path)
						fs_extra.moveSync(intermediate_target_abs_path, abs_pathⵧtarget)
						db = DB.on_file_moved(db, id, target_id)
						if (File.get_current_basename(current_file_state) !== target_basename)
							_report.file_renamings[id] = target_basename
						if (File.get_current_parent_folder_id(current_file_state) !== target_folder)
							_report.file_moves[id] = target_folder
					}
					else {
						logger.error('norm: #3 error', {
							id,
							target_id,
							id_equality: id === target_id,
							id_equality_u: NORMALIZERS.normalize_unicode(id) === NORMALIZERS.normalize_unicode(target_id),
							abs_pathⵧcurrent,
							abs_pathⵧtarget,
							path_equality: abs_pathⵧcurrent === abs_pathⵧtarget,
							path_equality_u: NORMALIZERS.normalize_unicode(abs_pathⵧcurrent) === NORMALIZERS.normalize_unicode(abs_pathⵧtarget),
							err,
						})
					}
				}
			}
		}
	}

	async function move_file_to_ideal_location(id: RelativePath): Promise<void> {
		const target_id = DB.get_ideal_file_relative_path(db, id)

		logger.trace(`[Action] initiating move_file_to_ideal_location "${id}" to DIFFERENT "${target_id}"…`)
		assert(target_id !== id, 'MTIL') // should have been pre-filtered

		try {
			const parsed = pathㆍparse_memoized(id)
			const parsed_target = pathㆍparse_memoized(target_id)
			const is_renaming = parsed.base !== parsed_target.base
			const folder_source = id.split(path.sep).slice(0, -1).join(path.sep)
			const folder_target = target_id.split(path.sep).slice(0, -1).join(path.sep)
			const is_moving = folder_source !== folder_target
			assert(is_moving || is_renaming, `move_file_to_ideal_location() should do sth!`)

			if (is_moving && !is_renaming) {
				const folder_source_norm = NORMALIZERS.normalize_unicode(folder_source)
				const folder_target_norm = NORMALIZERS.normalize_unicode(folder_target)
				if (folder_source_norm === folder_target_norm) {
					// TODO one day normalize the folders
					logger.warn(`MTIL: we should normalize folder ${folder_source_norm}`)
					return
				}
			}

			if (is_moving) {
				logger.verbose(`- ✍️ [MTIL] about to move file "${id}" to DIFFERENT ideal location "${target_id}"…`)
			}
			else {
				logger.verbose(`- ✍️ [MTIL] about to rename file in-place from "${parsed.base}" to DIFFERENT ideally "${parsed_target.base}"…`)
			}

			/* TODO ?
			if (get_params().expect_perfect_state && File.is_media_file() && File.get_confidence_in_date()) {
				assert(
					is_normalized_media_basename(parsed.base),
					`PERFECT STATE when moving to ideal location, file "${parsed.base}" is expected to be already normalized to "${parsed_target.base}"`
				)
			}*/

			const target_folder_id = DB.get_ideal_file_relative_folder(db, id)
			if (!PARAMS.dry_run) {
				//const is_target_folder_existing_according_to_db = DB.is_folder_existing(db, target_folder_id)
				//assert(is_target_folder_existing_according_to_db, `INFBS is_target_folder_existing_according_to_db!`)
				await ensure_folder(target_folder_id)
			}
			_intelligently_normalize_file_basename_sync(id, target_folder_id)
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.move_file_to_ideal_location, err, { id })
		}
	}

	async function normalize_file(id: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating normalize_file "${id}"…`)

		try {
			const file_state = db.files[id]
			assert(file_state, 'normalize_file() file_state')

			if (File.is_exif_powered_media_file(file_state)) {
				const current_exif_data: any = file_state.current_exif_data
				// https://www.impulseadventure.com/photo/exif-orientation.html
				if (current_exif_data.Orientation > 1) {
					// https://www.impulseadventure.com/photo/lossless-rotation.html
					if (PARAMS.dry_run) {
						//logger.info('DRY RUN would have losslessly rotated according to EXIF orientation', current_exif_data.Orientation)
					}
					else {
						//logger.info(`TODO losslessly rotate "${id}" according to EXIF orientation`, current_exif_data.Orientation)
						// TODO one day BUT will need hash chaining
						// + there is data loss
					}
				}
			}

			if (File.is_media_file(file_state) && File.is_confident_in_date_enough_to__fix_fs(file_state)) {
				// TODO fix birthtime if wrong
			}

			_intelligently_normalize_file_basename_sync(id)
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.normalize_file, err, { id })
		}
	}

	async function delete_folder_if_empty(id: RelativePath): Promise<void> {
		logger.trace(`[Action] initiating delete_folder_if_empty "${id}"…`)

		try {
			const abs_path = DB.get_absolute_path(db, id)

			const children = [
				...fs_extra.lsDirsSync(abs_path, { full_path: false }),
				...fs_extra.lsFilesSync(abs_path, { full_path: false }),
			]
			if (children.length === 0) {
				_report.folder_deletions.push(id)
				if (PARAMS.dry_run) {
					logger.info('DRY RUN would have deleted empty folder ' + abs_path)
				}
				else {
					logger.info('deleting empty folder… ' + abs_path)
					logger.log(`💾 rmdir("${abs_path}")`)
					await util.promisify(fs_extra.remove)(abs_path)
					db = DB.on_folder_deleted(db, id)
				}
			}
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(ActionType.delete_folder_if_empty, err, { id })
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
				await persist_notes(action.folder_path, action.data)
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

	const action_queue = async.priorityQueue(async function worker(task: Immutable<Action>): Promise<void> {
		dequeue_and_schedule_all_first_level_db_actions()

		await asyncjs_iteratee(task)
		on_task_finished(task.type)
		on_task_finished(PROGRESS_ID__OVERALL)

		dequeue_and_schedule_all_first_level_db_actions()
	}, 20)
	action_queue.error(function(err, task) {
		logger.error('task experienced an error', { task, err });
	})

	function dequeue_and_schedule_all_first_level_db_actions(): void {
		const pending_actions = DB.get_pending_actions(db)
		if (pending_actions.length) {
			db = DB.discard_all_pending_actions(db)
			pending_actions.forEach(action => {
				const priority = action.type === 'explore_folder'
					? 0
					: action.type === 'ensure_folder'
						? 1
						: 2
				action_queue.push(action, priority)
				on_new_tasks(PROGRESS_ID__OVERALL)
				on_new_tasks(action.type)
			})
			//console.log('+' + pending_actions.length)
		}
	}

	dequeue_and_schedule_all_first_level_db_actions()

	try {

		if (action_queue.length() === 0) {
			// the priority queue we use (async.priorityQueue)
			// blocks when no actions at all
		}
		else {
			await action_queue.drain()
		}
	}
	catch (err) {
		throw err
	}
	finally {
		// stop all bars
		if (display_progress) progress_multibar.stop()

		const end_date_ms = get_UTC_timestamp_ms()
		const exec_duration_ms = end_date_ms - start_date_ms
		_report.phases_duration_ms[debug_id] = exec_duration_ms

		logger.trace(`DONE executing actions "${debug_id}", elapsed: ${exec_duration_ms/1000.}s`)
	}

	return db
}

////////////////////////////////////

export function get_report_to_string(): string {



	let report = ''

	report += 'Action report: ' + JSON.stringify(_report, null, '\t')

	const counts = JSON.stringify(
		Object.fromEntries(
			Object.entries(
				_report
			).map(([k, v]) => {
				if (Array.isArray(v)) {
					return [ k + '_count', v.length ]
				}
				else if (typeof v === 'object') {
					return [ k + '_count', Object.keys(v).length ]
				}
				else {
					return [ k, v ]
				}
			})
		),
		null,
		'\t'
	)

	report += '\nAggregated counters:' + counts

	if (_report.file_count) {
		const total_duration_ms = Object.values(_report.phases_duration_ms).reduce(
			(previousValue, currentValue) => previousValue + currentValue,
			0,
		)

		report += `\nSpeed: ${_report.file_count} files in ${total_duration_ms}ms = ${total_duration_ms/_report.file_count} ms/file`
	}

	return report
}
