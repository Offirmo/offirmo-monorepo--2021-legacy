import path from 'path'
import util from 'util'
import fs from 'fs'
import assert from 'tiny-invariant'
import stable_stringify from 'json-stable-stringify'

import { exiftool } from 'exiftool-vendored'

import { LIB, EXIF_ENTRY } from './consts'
import { RelativePath } from './types'
import * as DB from './state/db'
import * as File from './state/file'
import { ActionType, ActionMoveFile } from './state/actions'

import logger from './services/logger'
import fs_extra from './services/fs-extra'
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

		const { type, id } = action
		switch (type) {
			case ActionType.explore_folder:
				pending_actions.push(explore_folder(id))
				break

			case ActionType.query_fs_stats:
				pending_actions.push(query_fs_stats(id))
				break

			case ActionType.query_exif:
				pending_actions.push(query_exif(id))
				break

			case ActionType.normalize_file:
				pending_actions.push(normalize_file(id))
				break

			case ActionType.ensure_folder:
				assert(!PARAMS.dry_run, 'no write action in dry run mode')
				pending_actions.push(ensure_folder(id))
				break

			/*case ActionType.move_folder:
				assert(!PARAMS.dry_run, 'no write action in dry run mode')
				pending_actions.push(move_folder(id, (action as ActionMoveFolder).target_id))
				break*/

			case ActionType.move_file:
				assert(!PARAMS.dry_run, 'no write action in dry run mode')
				pending_actions.push(move_file(id, (action as ActionMoveFile).target_id))
				break

			default:
				throw new Error(`action not implemented: "${type}"!`)
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
	logger.group('******* STARTING EXPLORATION PHASE *******')
	db = DB.explore_recursively(db)
	await exec_pending_actions_recursively_until_no_more()
	logger.groupEnd()
	logger.log(DB.to_string(db))

	logger.group('******* STARTING IN-PLACE NORMALIZATION PHASE *******')
	db = DB.normalize_medias_in_place(db)
	await exec_pending_actions_recursively_until_no_more()
	logger.groupEnd()
	logger.log(DB.to_string(db))

	logger.group('******* STARTING SORTING PHASE *******')
	db = DB.ensure_structural_dirs_are_present(db)
	db = DB.ensure_existing_event_folders_are_organized(db)
	db.queue.forEach(action => console.log(JSON.stringify(action)))
	await exec_pending_actions_recursively_until_no_more()
	logger.log(DB.to_string(db))

	db = DB.ensure_all_needed_events_folders_are_present_and_move_files_in_them(db)
	db.queue.forEach(action => console.log(JSON.stringify(action)))
	await exec_pending_actions_recursively_until_no_more()
	logger.log(DB.to_string(db))

	//db = DB.ensure_all_eligible_files_are_correctly_named(db)
	//db.queue.forEach(action => console.log(JSON.stringify(action)))
	//logger.warn('TODO')

	//await exec_pending_actions_recursively_until_no_more()
	logger.groupEnd()
}

////////////////////////////////////

async function explore_folder(id: RelativePath) {
	logger.group(`- exploring dir "${id}"…`)

	const abs_path = DB.get_absolute_path(db, id)

	const sub_dirs = fs_extra.lsDirsSync(abs_path, { full_path: false })
	//console.log(sub_dirs)
	sub_dirs.forEach((sub_id: RelativePath) => db = DB.on_folder_found(db, id, sub_id))

	const sub_files = fs_extra.lsFilesSync(abs_path, { full_path: false })
	//console.log(sub_files)
	sub_files.forEach((sub_id: RelativePath) => {
		const should_delete_asap = !!PARAMS.extensions_to_delete.find(ext => sub_id.toLowerCase().endsWith(ext))
		if (should_delete_asap) {
			const abs_path_target = DB.get_absolute_path(db, path.join(id, sub_id))
			if (PARAMS.dry_run) {
				logger.verbose(`ignoring trash`, { abs_path_target })
			}
			else {
				logger.verbose(`ignoring trash, cleaning it…`, { abs_path_target })
				fs_extra.remove(abs_path_target)
			}
		}
		else {
			db = DB.on_file_found(db, id, sub_id)
		}
	})

	logger.groupEnd()
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

async function normalize_file(id: RelativePath) {
	logger.trace(`initiating media file normalization for "${id}"…`)
	const actions: Promise<void>[] = []

	const abs_path = DB.get_absolute_path(db, id)
	const media_state = db.media_files[id]
	assert(media_state, 'media_state')

	const is_exif_powered = File.is_exif_powered_media_file(media_state)
	console.log({ id, media_state, abs_path, is_exif_powered})

	const exif_data: any = media_state.current_exif_data
	if (is_exif_powered && exif_data) {
		const target_notes = stable_stringify({
			original: media_state.original,
		})
		if (target_notes !== exif_data[EXIF_ENTRY]) {
			assert(!exif_data[EXIF_ENTRY])
			actions.push(
				exiftool.write(abs_path, { [EXIF_ENTRY]: target_notes })
			)
		}



		process.exit(-1)
	}
}

async function ensure_folder(id: RelativePath) {
	logger.trace(`- ensuring dir "${id}"…`)
	//const is_existing_according_to_db = db.folders.hasOwnProperty(id)
	//logger.log('so far:', { is_existing_according_to_db })
	//if (is_existing_according_to_db) return

	const abs_path = DB.get_absolute_path(db, id)
	await util.promisify(fs_extra.mkdirp)(abs_path)
	//logger.groupEnd()
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
	.catch(err => logger.fatal('Please report.', { err }))
	.finally(() => {
		exiftool.end()
	})
