import path from 'path'
import util from 'util'
import fs from 'fs'
import assert from 'tiny-invariant'

import { exiftool } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import json from '@offirmo/cli-toolbox/fs/json'

import { LIB, NOTES_BASENAME } from './consts'
import { RelativePath } from './types'
import * as DB from './state/db'
import * as File from './state/file'
import * as Notes from './state/notes'
import { ActionType } from './state/actions'

import logger from './services/logger'
import { exec_pending_actions_recursively_until_no_more } from './services/actions'
import { get_params } from './params'

const PARAMS = get_params()
logger.verbose(`******* ${LIB.toUpperCase()} *******`, { PARAMS })

////////////////////////////////////


async function sort_all_medias() {
	const up_to = 'normalize' as 'explore_and_take_notes' | 'deduplicate' | 'normalize' | 'move'

	let db = DB.create(PARAMS.root)

	await (async () => {
		logger.verbose('Starting sort up to: "' + up_to + '"…')

		////////// READ ONLY / INTERMEDIATE ////////////

		logger.group('******* STARTING EXPLORATION PHASE *******')
		db = DB.explore_fs_recursively(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		db = DB.on_fs_exploration_done_consolidate_data_and_backup_originals(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		logger.groupEnd()
		if (up_to === 'explore_and_take_notes') return

		////////// WRITE ////////////

		logger.group('******* STARTING IN-PLACE CLEANUP PHASE *******')
		db = DB.clean_up_duplicates(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		logger.groupEnd()
		if (up_to === 'deduplicate') return

		logger.group('******* STARTING IN-PLACE NORMALIZATION PHASE *******')
		db = DB.normalize_medias_in_place(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		logger.groupEnd()
		if (up_to === 'normalize') return

		logger.group('******* STARTING SORTING PHASE *******')

		// move non-analyzable to junk
		// normalize in-place: rotate, rename, clean
		// ensure structural dirs
		// move to ideal location

		db = DB.ensure_structural_dirs_are_present(db)
		db.queue.forEach(action => console.log(JSON.stringify(action)))
		db = await exec_pending_actions_recursively_until_no_more(db)

		db = DB.move_all_files_to_their_ideal_location_incl_deduping(db)
		db.queue.forEach(action => console.log(JSON.stringify(action)))
		db = await exec_pending_actions_recursively_until_no_more(db)
		logger.log('DB = ' + DB.to_string(db))

		db = DB.delete_empty_folders_recursively(db)
		db.queue.forEach(action => console.log(JSON.stringify(action)))
		db = await exec_pending_actions_recursively_until_no_more(db)
		logger.log('DB = ' + DB.to_string(db))

		logger.groupEnd()
	})()

	logger.verbose('Sort up to: "' + up_to + '" done.')
	logger.info('DB = ' + DB.to_string(db))
}

////////////////////////////////////

sort_all_medias()
	.then(() => logger.info('All done, my pleasure!'))
	.catch(err => logger.fatal('Crash, please report.', { err }))
	.finally(() => {
		exiftool.end()
	})
