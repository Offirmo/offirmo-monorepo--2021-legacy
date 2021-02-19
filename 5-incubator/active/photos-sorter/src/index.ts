import assert from 'tiny-invariant'

import { exiftool } from 'exiftool-vendored'

import { LIB } from './consts'
import * as DB from './state/db'

import logger from './services/logger'
import { exec_pending_actions_recursively_until_no_more, get_report_to_string } from './services/actions'
import { get_params } from './params'

const PARAMS = get_params()
logger.verbose(`******* ${LIB.toUpperCase()} *******`, { PARAMS })

////////////////////////////////////


async function sort_all_medias() {
	const up_to = 'cleanup' as 'explore_and_take_notes' | 'deduplicate' | 'normalize' | 'move' | 'cleanup'

	let db = DB.create(PARAMS.root)

	await (async () => {
		logger.verbose('Starting sort up to: "' + up_to + '"…')

		////////// READ ONLY / INTERMEDIATE ////////////

		logger.group('******* STARTING EXPLORATION PHASE *******')
		db = DB.explore_fs_recursively(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		assert(DB.get_pending_actions(db).length === 0, 'eq 1')
		logger.verbose('>>>>>>> FS READ, NOW CONSOLIDATING >>>>>>>')
		db = DB.on_fs_exploration_done_consolidate_data_and_backup_originals(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		assert(DB.get_pending_actions(db).length === 0, 'eq 2')
		logger.verbose('>>>>>>> CONSOLIDATION DONE ✔️ >>>>>>>')
		logger.groupEnd()
		if (up_to === 'explore_and_take_notes') return

		////////// WRITE ////////////
		logger.info('DB = ' + DB.to_string(db)) // for debug

		logger.group('******* STARTING DE-DUPLICATION PHASE *******')
		db = DB.clean_up_duplicates(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		assert(DB.get_pending_actions(db).length === 0, 'eq 3')
		logger.groupEnd()
		if (up_to === 'deduplicate') return

		logger.group('******* STARTING IN-PLACE NORMALIZATION PHASE *******')
		db = DB.normalize_files_in_place(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		db = DB.backup_notes(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		logger.groupEnd()
		if (up_to === 'normalize') return

		logger.group('******* STARTING FILE MOVE PHASE *******')
		db = DB.ensure_structural_dirs_are_present(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		db = DB.move_all_files_to_their_ideal_location(db)
		db = await exec_pending_actions_recursively_until_no_more(db)
		logger.groupEnd()
		if (up_to === 'move') return

		logger.group('******* STARTING FINAL CLEANUP PHASE *******')
		const max_folder_depth = DB.get_max_folder_depth(db)
		for(let depth = max_folder_depth; depth >= 0; --depth) {
			db = DB.delete_empty_folders_recursively(db, depth)
			db = await exec_pending_actions_recursively_until_no_more(db)
		}
		logger.groupEnd()
		if (up_to === 'cleanup') return
	})()

	logger.verbose('Sort up to: "' + up_to + '" done.')
	logger.info('DB = ' + DB.to_string(db))
	console.log('\nactions done: ' + get_report_to_string())
}

////////////////////////////////////

sort_all_medias()
	.then(() => logger.info('All done, my pleasure!'))
	.catch(err => logger.fatal('Crash, please report.', { err }))
	.finally(() => {
		exiftool.end()
	})
