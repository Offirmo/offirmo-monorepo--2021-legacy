import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { get_mutable_copy } from '@offirmo-private/state-utils'
import stylize_string from 'chalk'

import logger from '../../services/logger'
import { FileHash } from '../../services/hash'
import {
	get_human_readable_timestamp_auto,
	create_better_date_from_utc_tms,
} from '../../services/better-date'
import {
	PersistedNotes as FileNotes,
	merge_notes,
} from '../file'

import { LIB, SCHEMA_VERSION } from './consts'
import { State } from './types'
import { get_historical_fs_reliability } from '../file/sub/neighbor-hints'
import { get_lib_SEC } from '../../services/sec'

export { State } from './types'
import { migrate_to_latest as _migrate_to_latest } from './migrations'
import { get_file_basename_extension‿normalized } from '../../services/name_parser'
import { get_params, Params } from '../../params'

///////////////////// ACCESSORS /////////////////////

export function get_oldest_hash(state: Immutable<State>, hash: FileHash): FileHash {
	assert(hash, `get_oldest_hash() param`)

	let has_redirect = false
	while (state.known_modifications_new_to_old[hash]) {
		has_redirect = true
		assert(!state.encountered_files[hash], 'get_oldest_hash() newer hash should not have notes')
		hash = state.known_modifications_new_to_old[hash]
	}

	if (has_redirect) {
		assert(state.encountered_files[hash], 'get_oldest_hash() known hash should have notes')
	}

	return hash
}

export function get_file_notes_for_hash(state: Immutable<State>, hash: FileHash): null | Immutable<FileNotes> {
	hash = get_oldest_hash(state, hash)

	return state.encountered_files[hash] || null
}

export function has_notes_for_hash(state: Immutable<State>, hash: FileHash): boolean {
	return get_file_notes_for_hash(state, hash) !== null
}

///////////////////// REDUCERS /////////////////////

export function create(debug_id: string, notes_to_copy?: Immutable<State>): State {
	logger.trace(`${LIB} create(…) (${debug_id})`, { })

	let state: State = {
		_comment: "This data is from @offirmo/photo-sorter https://github.com/Offirmo/offirmo-monorepo/tree/master/5-incubator/active/photos-sorter",

		schema_version: SCHEMA_VERSION,
		revision: 0,
		last_user_investment_tms: get_UTC_timestamp_ms(),

		encountered_files: {},
		known_modifications_new_to_old: {},
	}

	if (notes_to_copy) {
		state.encountered_files = {
			...get_mutable_copy(notes_to_copy.encountered_files),
		}
		state.known_modifications_new_to_old = {
			...get_mutable_copy(notes_to_copy.known_modifications_new_to_old)
		}
	}

	return state
}

export function migrate_to_latest(prev: any): Immutable<State> {
	return _migrate_to_latest(get_lib_SEC(), prev)
}

export function on_previous_notes_found(state: Immutable<State>, previous_state: Immutable<State>, PARAMS: Immutable<Params> = get_params()): Immutable<State> {
	logger.trace(`${LIB} on_previous_notes_found(…)`, { })

	const { encountered_files: encountered_files_current } = state
	const { encountered_files: encountered_files_previous } = previous_state
	const encountered_files: { [oldest_hash: string]: Immutable<FileNotes> } = {}
	state = {
		...state,
		encountered_files,
		known_modifications_new_to_old: {
			// easy merge
			...state.known_modifications_new_to_old,
			...previous_state.known_modifications_new_to_old,
		},
	}

	const encountered_files_hashes = new Set<FileHash>([
		...Object.keys(encountered_files_current),
		...Object.keys(encountered_files_previous),
	])

	encountered_files_hashes.forEach(hash => {
		// merge notes for this hash and previous hashes of the same file


		// we'll push() any candidate into this array
		const raw_notes: Array<Immutable<FileNotes> | undefined> = []

		raw_notes.push(encountered_files_current[hash])
		raw_notes.push(encountered_files_previous[hash])
		while (state.known_modifications_new_to_old[hash]) {
			hash = state.known_modifications_new_to_old[hash]
			raw_notes.push(encountered_files_current[hash])
			raw_notes.push(encountered_files_previous[hash])
		}

		const notes = raw_notes.filter(n => !!n) as Array<Immutable<FileNotes>>
		notes.forEach(notes => {
			const { _currently_known_as } = notes
			if (!_currently_known_as) return

			const normalized_extension = get_file_basename_extension‿normalized(_currently_known_as)
			assert(PARAMS.extensions_of_media_files‿lc.includes(normalized_extension), `on_previous_notes_found() notes should only be stored for media files!`)
		})
		const final_notes = notes.length === 1
			? notes[0]
			: merge_notes(...notes)

		encountered_files[hash] = final_notes
	})

	return state
}

// delete the copy from this state in order to have a single source of truth
export function on_file_notes_recovered_into_active_file_state(state: Immutable<State>, current_hash: FileHash): Immutable<State> {
	let encountered_files = {
		...state.encountered_files,
	}

	const oldest_hash = get_oldest_hash(state, current_hash)
	assert(encountered_files[oldest_hash], `on_file_notes_recovered() notes should exist`)
	delete encountered_files[oldest_hash] // clean to avoid redundancy
	assert(!encountered_files[oldest_hash], 'on_file_notes_recovered_into_active_file_state() delete')

	let hash = current_hash
	while (hash !== oldest_hash) {
		assert(!encountered_files[hash], 'on_file_notes_recovered_into_active_file_state() should not longer have notes')
		hash = state.known_modifications_new_to_old[hash]
	}

	return {
		...state,
		encountered_files,
	}
}

export function on_file_modified(state: Immutable<State>, previous_hash: string, current_hash: string): Immutable<State> {
	logger.trace(`${LIB} on_file_modified(…)`, { previous_hash, current_hash })

	// TODO one day (we're never modifying files for now)

	throw new Error('NIMP on_file_modified!')
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>, mode: 'mode:full' | 'mode:summary' = 'mode:full'): string {
	const { encountered_files, known_modifications_new_to_old } = state

	let str = ''

	switch (mode) {
		case 'mode:full': {
			const processed = new Set<string>()

			const oldest_hashes: string[] = Object.keys(encountered_files)

			/*const known_modifications_old_to_new = Object.entries(known_modifications_new_to_old)
					.reduce((acc, [n, o]) => {
						acc[o] ??= []
						acc[o].push(n)

						return acc
					}, {} as { [old: string]: string[] })

			const newest_hashes: string[] = Object.keys(known_modifications_new_to_old)
			const target_hashes: string[] = Object.values(known_modifications_new_to_old)*/

			oldest_hashes.forEach(hash => {
				processed.add(hash)

				const notes = encountered_files[hash]
				str += `\n📄 notes: ${hash}: ` + notes_to_string(notes)

				//str += '\n    old hashes'
			})
			break
		}
		case 'mode:summary': {
			str += `\n📄 notes: ${Object.keys(encountered_files).length} entries`
			break
		}
		default:
			throw new Error('XXX!')
	}

	return str
}

function notes_to_string(notes: Immutable<FileNotes>): string {
	let str = ''

	const historical_fs_reliability = get_historical_fs_reliability(notes.historical.neighbor_hints, notes.historical.fs_bcd_tms)
	const reliability_icon = historical_fs_reliability === 'unknown'
		? '❓'
		: historical_fs_reliability === 'reliable'
			? '✅'
			: '❌'
	str += `CKA "${stylize_string.yellow.bold(notes._currently_known_as)}" HKA "${stylize_string.yellow.bold(
		[
			notes.historical.parent_path,
			notes.historical.basename,
		].filter(e => !!e).join('/')
	)}" 📅(fs)${reliability_icon}${get_human_readable_timestamp_auto(create_better_date_from_utc_tms(notes.historical.fs_bcd_tms, 'tz:auto'), 'tz:embedded')}`

	return str
}
