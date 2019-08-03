import path from 'path'
import util from 'util'
import fs from 'fs'
import assert from 'tiny-invariant'

import { exiftool } from 'exiftool-vendored'

import { RelativePath } from './types'
import * as DB from './state/db'
import * as Match from './services/matching'
import logger from './services/logger'
import fs_extra from './services/fs-extra'

console.log('Hello world !')

const ROOT = path.normalize(`/Users/${process.env.USER}/Documents/- photos/- sorted`)
logger.info('******* PHOTO SORTER *******', { ROOT })

////////////////////////////////////

let db = DB.create(ROOT)

function dequeue_and_run_all_queued_actions(readonly = true): Promise<any>[] {
	let pending_actions: Promise<any>[] = []

	while(DB.has_pending_actions(db)) {
		const action = DB.get_first_pending_action(db)
		db = DB.discard_first_pending_action(db)

		const { type, id } = action
		switch (type) {
			case DB.ActionType.explore_folder:
				pending_actions.push(explore_folder(id))
				break

			case DB.ActionType.query_fs_stats:
				pending_actions.push(query_fs_stats(id))
				break

			case DB.ActionType.query_exif:
				pending_actions.push(query_exif(id))
				break

			case DB.ActionType.ensure_folder:
				assert(!readonly, 'no write action in readonly mode')
				pending_actions.push(ensure_folder(id))
				break

			default:
				throw new Error(`TODO unsupported action "${type}"!`)
		}
	}

	return pending_actions
}

async function exec_all_pending_actions(readonly = true): Promise<void> {
	let pending_actions: Promise<any>[] = [ Promise.resolve() ]

	function run_and_wait_for_queued_actions(): Promise<void> {
		const pending_actions = dequeue_and_run_all_queued_actions(readonly)
			.map(pending_action => pending_action.then(run_and_wait_for_queued_actions))
		return Promise.all(pending_actions).then(() => {})
	}

	await run_and_wait_for_queued_actions()
}

async function sort_all_medias() {
	logger.group('******* STARTING EXPLORATION PHASE *******')
	await exec_all_pending_actions()
	logger.groupEnd()

	logger.group('******* STARTING SORTING PHASE *******')
	db = DB.on_exploration_complete(db)
	// TOTO do it
	logger.warn('TODO')

	//await exec_all_pending_actions()
	logger.groupEnd()
}
sort_all_medias()
	.then(() => logger.info('All done, my pleasure!'))
	.catch(err => logger.fatal('Please report.', { err }))
	.finally(() => {
		exiftool.end()
	})

////////////////////////////////////


async function explore_folder(id: RelativePath) {
	logger.group(`- exploring dir "${id}"…`)

	const abs_path = DB.get_absolute_path(db, id)

	const sub_dirs = fs_extra.lsDirsSync(abs_path, { full_path: false })
	sub_dirs.forEach((sub_id: RelativePath) => db = DB.on_folder_found(db, id, sub_id))

	const sub_files = fs_extra.lsFilesSync(abs_path, { full_path: false })
	sub_files.forEach((sub_id: RelativePath) => db = DB.on_file_found(db, id, sub_id))

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

async function ensure_folder(id: RelativePath) {
	const is_existing_according_to_db = db.folders.hasOwnProperty(id)

	logger.group(`- ensuring dir "${id}"…`)
	logger.log('so far:', { is_existing_according_to_db })

	if (is_existing_according_to_db) return

	const abs_path = DB.get_absolute_path(db, id)

	await util.promisify(fs_extra.mkdirp)(abs_path)
	logger.groupEnd()
}
