import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import { exiftool } from 'exiftool-vendored'

import { LIB } from './consts'
import { get_params, Params } from './params'
import * as DB from './state/db'
import logger from './services/logger'
import { exec_pending_actions_recursively_until_no_more, get_report_to_string } from './services/actions'

console.log(`******* ${LIB.toUpperCase()} *******`)

////////////////////////////////////


async function sort_all_medias(PARAMS: Immutable<Params> = get_params()) {
	// for debug
	const up_to = 'cleanup' as 'explore_and_take_notes' | 'deduplicate' | 'normalize' | 'move' | 'cleanup'

	logger.trace(`Running with params:`, PARAMS)

	console.log(`ROOT = ${PARAMS.root}`)
	let db = DB.create(PARAMS.root)

	await (async () => {
		logger.trace('Starting execution up to: "' + up_to + '" phase…')

		////////// READ ONLY / INTERMEDIATE ////////////

		logger.group('******* 1. STARTING EXPLORATION PHASE *******')
		db = DB.explore_fs_recursively(db)
		db = await exec_pending_actions_recursively_until_no_more(db, '1.1 explore_fs_recursively')
		assert(DB.get_pending_actions(db).length === 0, 'eq 1')
		logger.verbose('>>>>>>> FS READ, NOW CONSOLIDATING >>>>>>>')
		db = DB.on_fs_exploration_done_consolidate_data_and_backup_originals(db)
		db = await exec_pending_actions_recursively_until_no_more(db, '1.2 on_fs_exploration_done_consolidate_data_and_backup_originals')
		assert(DB.get_pending_actions(db).length === 0, 'eq 2')
		logger.verbose('>>>>>>> CONSOLIDATION DONE ✔️ >>>>>>>')
		db = DB.backup_notes(db, 'mode:intermediate')
		db = await exec_pending_actions_recursively_until_no_more(db, '1.3 backup_notes')
		logger.groupEnd()
		if (up_to === 'explore_and_take_notes') return

		////////// WRITE ////////////
		logger.info('DB = ' + DB.to_string(db)) // for debug

		logger.group('******* 2. STARTING DE-DUPLICATION PHASE *******')
		// let's do it first so that we can clean the copy markers, unneeded
		db = DB.clean_up_duplicates(db)
		db = await exec_pending_actions_recursively_until_no_more(db, '2.0 clean_up_duplicates')
		assert(DB.get_pending_actions(db).length === 0, 'eq 3')
		logger.groupEnd()
		if (up_to === 'deduplicate') return

		logger.group('******* 3. STARTING IN-PLACE NORMALIZATION PHASE *******')
		db = DB.normalize_files_in_place(db)
		db = await exec_pending_actions_recursively_until_no_more(db, '3.0 normalize_files_in_place')
		// backup notes once more to reflect the new pathes
		db = DB.backup_notes(db, 'mode:intermediate')
		db = await exec_pending_actions_recursively_until_no_more(db, '3.1 backup_notes')
		logger.groupEnd()
		if (up_to === 'normalize') return

		logger.group('******* 4. STARTING FILE MOVE PHASE *******')
		db = DB.ensure_structural_dirs_are_present(db)
		db = await exec_pending_actions_recursively_until_no_more(db, '4.0 ensure_structural_dirs_are_present')
		db = DB.move_all_files_to_their_ideal_location(db)
		db = await exec_pending_actions_recursively_until_no_more(db, '4.1 move_all_files_to_their_ideal_location')
		// backup notes once more to reflect the new pathes
		db = DB.backup_notes(db, 'mode:intermediate')
		db = await exec_pending_actions_recursively_until_no_more(db, '4.2 backup_notes')

		logger.groupEnd()
		if (up_to === 'move') return

		logger.group('******* 5. STARTING FINAL CLEANUP PHASE *******')
		db = DB.clean_non_canonical_notes(db)
		db = await exec_pending_actions_recursively_until_no_more(db, '5.0 clean_misplaced_notes')
		const max_folder_depth = DB.get_max_folder_depth(db)
		console.log({ max_folder_depth })
		for(let depth = max_folder_depth; depth >= 0; --depth) {
			db = DB.delete_empty_folders_recursively(db, depth)
			db = await exec_pending_actions_recursively_until_no_more(db, `5.${max_folder_depth - depth + 1} normalize_files_in_place depth ${depth}`)
		}
		// backup notes one last time, duplicating them across all "years" folders for manual consolidation
		db = DB.backup_notes(db, 'mode:final')
		db = await exec_pending_actions_recursively_until_no_more(db, '5.99 final multiple notes backup')
		logger.groupEnd()
		if (up_to === 'cleanup') return
	})()

	logger.verbose('Sort up to: "' + up_to + '" done.')
	//logger.info('DB = ' + DB.to_string(db))
	console.log('\nactions done: ' + get_report_to_string())
}

////////////////////////////////////

sort_all_medias()
	.then(() => logger.info('All done, my pleasure!'))
	.catch(err => logger.fatal('Crash, please report.', { err }))
	.finally(() => {
		exiftool.end()
	})
