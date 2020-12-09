import path from 'path'
import util from 'util'
import fs from 'fs'
import assert from 'tiny-invariant'
import hasha from 'hasha'

import { exiftool } from 'exiftool-vendored'

import { LIB, NOTES_BASENAME } from './consts'
import { RelativePath } from './types'
import * as DB from './state/db'
import * as File from './state/file'
import * as Actions from './state/actions'
import { ActionType } from './state/actions'

import logger from './services/logger'
import fs_extra from './services/fs-extra'
import get_file_hash from './services/hash'
import { get_params } from './params'

const PARAMS = get_params()
logger.verbose(`******* ${LIB.toUpperCase()} *******`, { PARAMS })

////////////////////////////////////

let db = DB.create(PARAMS.root)

function dequeue_and_run_all_first_level_db_actions(): Promise<any>[] {
	const pending_actions: Promise<any>[] = []

	while(DB.has_pending_actions(db)) {
		const action = DB.get_first_pending_action(db)
		logger.trace(`DQ1 executing action…`, { action })
		db = DB.discard_first_pending_action(db)

		switch (action.type) {

			/////// READ

			case ActionType.explore_folder:
				pending_actions.push(explore_folder(action.id))
				break

			case ActionType.query_fs_stats:
				pending_actions.push(query_fs_stats(action.id))
				break

			case ActionType.query_exif:
				pending_actions.push(query_exif(action.id))
				break

			case ActionType.hash:
				pending_actions.push(compute_hash(action.id))
				break

			/////// WRITE

			case ActionType.normalize_file:
				assert(!PARAMS.dry_run, 'no normalize_file action in dry run mode')
				pending_actions.push(normalize_file(action.id))
				break

			case ActionType.ensure_folder:
				assert(!PARAMS.dry_run, 'no ensure_folder action in dry run mode')
				pending_actions.push(ensure_folder(action.id))
				break

			case ActionType.delete_file:
				assert(!PARAMS.dry_run, 'no delete action in dry run mode')
				pending_actions.push(delete_file(action.id))
				break

			/*case ActionType.move_folder:
				assert(!PARAMS.dry_run, 'no write action in dry run mode')
				pending_actions.push(move_folder(id, (action as ActionMoveFolder).target_id))
				break*/

			case ActionType.move_file:
				assert(!PARAMS.dry_run, 'no write action in dry run mode')
				pending_actions.push(move_file(action.id, action.target_id))
				break

			default:
				throw new Error(`action not implemented: "${action.type}"!`)
		}
	}

	return pending_actions
}

async function exec_pending_actions_recursively_until_no_more(): Promise<void> {
	const pending_actions: Promise<any>[] = [ Promise.resolve() ]

	function run_and_wait_for_queued_actions(): Promise<void> {
		const pending_actions = dequeue_and_run_all_first_level_db_actions()
			.map(pending_action => pending_action.then(run_and_wait_for_queued_actions))
		return Promise.all(pending_actions).then(() => {})
	}

	await run_and_wait_for_queued_actions()
}

async function sort_all_medias() {

	////////// READ ONLY ////////////

	logger.group('******* STARTING EXPLORATION PHASE *******')
	db = DB.explore_fs_recursively(db)
	await exec_pending_actions_recursively_until_no_more()
	db = DB.on_fs_exploration_done(db)
	await exec_pending_actions_recursively_until_no_more()
	logger.groupEnd()
	//logger.log('DB = ' + DB.to_string(db))

	////////// INTERMEDIATE ////////////

	// this needs to be done before we start to write / delete
	logger.group('******* STARTING ORIGINAL DATA BACKUP *******')
	db = DB.consolidate_and_backup_original_data(db)
	logger.log('DB = ' + DB.to_string(db))
	await exec_pending_actions_recursively_until_no_more()
	logger.groupEnd()

	////////// WRITE ////////////

	logger.group('******* STARTING IN-PLACE CLEANUP PHASE *******')
	db = DB.clean_up_duplicates(db)
	await exec_pending_actions_recursively_until_no_more()
	logger.groupEnd()

	logger.group('******* STARTING IN-PLACE NORMALIZATION PHASE *******')
	db = DB.normalize_medias_in_place(db)
	await exec_pending_actions_recursively_until_no_more()
	logger.groupEnd()
	logger.log('DB = ' + DB.to_string(db))

	logger.group('******* STARTING SORTING PHASE *******')

	// move non-analyzable to junk
	// normalize in-place: rotate, rename, clean
	// ensure structural dirs
	// move to ideal location

	db = DB.ensure_structural_dirs_are_present(db)
	db.queue.forEach(action => console.log(JSON.stringify(action)))
	await exec_pending_actions_recursively_until_no_more()

	db = DB.move_all_files_to_their_ideal_location_incl_deduping(db)
	db.queue.forEach(action => console.log(JSON.stringify(action)))
	await exec_pending_actions_recursively_until_no_more()
	logger.log('DB = ' + DB.to_string(db))

	db = DB.delete_empty_folders_recursively(db)
	db.queue.forEach(action => console.log(JSON.stringify(action)))
	await exec_pending_actions_recursively_until_no_more()
	logger.log('DB = ' + DB.to_string(db))

	logger.groupEnd()
}

////////////////////////////////////

async function explore_folder(id: RelativePath) {
	logger.group(`- exploring dir "${id}"…`)

	const abs_path = DB.get_absolute_path(db, id)
	let pending_tasks: Promise<void>[] = []

	const sub_dirs = fs_extra.lsDirsSync(abs_path, { full_path: false })
	//console.log(sub_dirs)
	sub_dirs.forEach((sub_id: RelativePath) => db = DB.on_folder_found(db, id, sub_id))

	const sub_file_basenames = fs_extra.lsFilesSync(abs_path, { full_path: false })
	//console.log(sub_file_basenames)
	sub_file_basenames.forEach((basename: RelativePath) => {
		const is_notes = basename === NOTES_BASENAME
		if (is_notes) {
			// TODO load
			// TODO consolidate (inc. persist)
			throw new Error('NIMP load notes')
		}

		//const normalized_extension TODO
		const basename_lc = basename.toLowerCase()
		const should_delete_asap = !!PARAMS.extensions_to_delete.find(ext => basename_lc.endsWith(ext))
			||PARAMS.worthless_files.includes(basename_lc)
		if (should_delete_asap) {
			const abs_path_target = DB.get_absolute_path(db, path.join(id, basename))
			if (PARAMS.dry_run) {
				logger.verbose(`ignoring trash`, { basename })
			}
			else {
				logger.verbose(`ignoring trash, cleaning it…`, { basename })
				pending_tasks.push(fs_extra.remove(abs_path_target))
			}
		}
		else {
			db = DB.on_file_found(db, id, basename)
		}
	})
	logger.groupEnd()

	await Promise.all(pending_tasks)
}

async function query_fs_stats(id: RelativePath) {
	logger.trace(`initiating fs stats query for "${id}"…`)

	const abs_path = DB.get_absolute_path(db, id)
	const stats = await util.promisify(fs.stat)(abs_path)
	//logger.group(`- got fs stats data for "${id}"…`)
	logger.trace(`- got fs stats data for "${id}"…`)
	//console.log(id, tags)
	db = DB.on_fs_stats_read(db, id, stats)
	//logger.groupEnd()
}

async function query_exif(id: RelativePath) {
	logger.trace(`initiating exif query for "${id}"…`)

	const abs_path = DB.get_absolute_path(db, id)
	const exif_data = await exiftool.read(abs_path)
	//logger.group(`- got exif data for "${id}"…`)
	logger.trace(`- got exif data for "${id}"…`)
	//console.log(id, tags)
	db = DB.on_exif_read(db, id, exif_data)
	//logger.groupEnd()
}

async function compute_hash(id: RelativePath) {
	logger.trace(`computing hash for "${id}"…`)

	const abs_path = DB.get_absolute_path(db, id)
	const hash = await get_file_hash(abs_path)

	db = DB.on_hash_computed(db, id, hash!)
}

async function normalize_file(id: RelativePath) {
	logger.trace(`initiating media file normalization for "${id}"…`)
	const actions: Promise<void>[] = []

	const abs_path = DB.get_absolute_path(db, id)
	const media_state = db.files[id]
	assert(media_state, 'normalize_file() media_state')

	const is_exif_powered = File.is_exif_powered_media_file(media_state)
	//console.log({ id, media_state, abs_path, is_exif_powered})

	if (is_exif_powered) {
		const current_exif_data: any = media_state.current_exif_data
		if (current_exif_data.Orientation) {
			if (PARAMS.dry_run) {
				console.log('DRY RUN would have losslessly rotated according to EXIF orientation', current_exif_data.Orientation)
			}
			else {
				logger.error('TODO losslessly rotated according to EXIF orientation', current_exif_data.Orientation)
			}
		}
	}

	// TODO fix birthtime

	const current_basename = File.get_current_basename(media_state)
	const target_basename = File.get_ideal_basename(media_state)
	if (current_basename !== target_basename) {
		const relative_target_path = path.join(File.get_current_parent_folder_id(media_state), target_basename)
		if (!DB.is_file_existing(db, relative_target_path)) {
			if (PARAMS.dry_run) {
				console.log('DRY RUN would have renamed to', target_basename)
			}
			else {
				actions.push(
					move_file(id, relative_target_path)
				)
			}
		}
	}

	return Promise.all(actions)
}

async function ensure_folder(id: RelativePath) {
	logger.trace(`- ensuring dir "${id}"…`)

	const is_existing_according_to_db = DB.is_folder_existing(db, id)
	//logger.log('so far:', { is_existing_according_to_db })
	if (is_existing_according_to_db) return

	const abs_path = DB.get_absolute_path(db, id)

	if (PARAMS.dry_run) {
		console.log('DRY RUN would have created folder:', id)
	}
	else {
		await util.promisify(fs_extra.mkdirp)(abs_path)
		DB.on_folder_found(db, '.', id)
	}
}

async function delete_file(id: RelativePath) {
	logger.trace(`- deleting file "${id}"…`)

	const abs_path = DB.get_absolute_path(db, id)

	await util.promisify(fs.rm)(abs_path)
	db = DB.on_file_deleted(db, id)
}

/*
async function move_folder(id: RelativePath, target_id: RelativePath) {
	logger.trace(`- moving folder from "${id}" to "${target_id}"…`)

	const abs_path = DB.get_absolute_path(db, id)
	const abs_path_target = DB.get_absolute_path(db, target_id)

	await util.promisify(fs.rename)(abs_path, abs_path_target)
	db = DB.on_folder_moved(db, id, target_id)
}*/

async function move_file(id: RelativePath, target_id: RelativePath) {
	logger.trace(`- moving file from "${id}" to "${target_id}"…`)

	const abs_path = DB.get_absolute_path(db, id)
	const abs_path_target = DB.get_absolute_path(db, target_id)

	await util.promisify(fs.rename)(abs_path, abs_path_target)
	db = DB.on_file_moved(db, id, target_id)
}

////////////////////////////////////

sort_all_medias()
	.then(() => logger.info('All done, my pleasure!'))
	.catch(err => logger.fatal('Crash, please report.', { err }))
	.finally(() => {
		exiftool.end()
	})
