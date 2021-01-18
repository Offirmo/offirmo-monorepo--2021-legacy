import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { BaseState, WithLastUserActionTimestamp } from '@offirmo-private/state-utils'
import stylize_string from 'chalk'

import logger from '../services/logger'
import {
	PersistedNotes as FileNotes,
	State as FileState,
	get_hash,
	merge_notes,
} from './file'
import { FileHash } from '../services/hash'
import {
	get_human_readable_timestamp_auto,
	create_better_date_from_utc_tms,
} from '../services/better-date'
import { is_normalized_media_basename } from '../services/name_parser'
import { get_params } from '../params'

////////////////////////////////////

const LIB = '📃'
const SCHEMA_VERSION = 1

// DESIGN NOTE: the idea is to NOT have a duplication of info
// However since we don't control the order of file discovery in the explore phase,
// there'll be a temporary redundancy which will be corrected in the consolidation phase
export interface State extends BaseState, WithLastUserActionTimestamp {
	_comment: string
	encountered_files: { [oldest_hash: string]: FileNotes }
	known_modifications_new_to_old: { [newer_hash: string]: string }
}

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

export function create(debug_id: string): State {
	logger.trace(`${LIB} create(…) (${debug_id})`, { })

	return {
		_comment: "This data is from @offirmo/photo-sorter https://github.com/Offirmo/offirmo-monorepo/tree/master/5-incubator/active/photos-sorter",

		schema_version: SCHEMA_VERSION,
		revision: 0,
		last_user_action_tms: get_UTC_timestamp_ms(),

		encountered_files: {},
		known_modifications_new_to_old: {},
	}
}

export function migrate_to_latest(prev: any): Immutable<State> {
	// TODO proper migration
	return prev as Immutable<State>
}

export function on_previous_notes_found(state: Immutable<State>, old_state: Immutable<State>): Immutable<State> {
	logger.trace(`${LIB} on_previous_notes_found(…)`, { })

	const { encountered_files: encountered_files_a } = state
	const { encountered_files: encountered_files_b } = old_state
	const encountered_files: { [oldest_hash: string]: Immutable<FileNotes> } = {}
	state = {
		...state,
		encountered_files,
		known_modifications_new_to_old: {
			// easy merge
			...state.known_modifications_new_to_old,
			...old_state.known_modifications_new_to_old,
		},
	}

	const encountered_files_hashes = new Set<FileHash>([
		...Object.keys(encountered_files_a),
		...Object.keys(encountered_files_b),
	])

	encountered_files_hashes.forEach(hash => {
		const raw_notes: Array<Immutable<FileNotes> | undefined> = []

		raw_notes.push(encountered_files_a[hash])
		raw_notes.push(encountered_files_b[hash])
		while (state.known_modifications_new_to_old[hash]) {
			hash = state.known_modifications_new_to_old[hash]
			raw_notes.push(encountered_files_a[hash])
			raw_notes.push(encountered_files_b[hash])
		}

		const notes = raw_notes.filter(n => !!n) as Array<Immutable<FileNotes>>
		const final_notes = notes.length === 1
			? notes[0]
			: merge_notes(...notes)

		encountered_files[hash] = final_notes
	})

	return state
}

export function on_exploration_done_merge_new_and_recovered_notes(state: Immutable<State>, file_states: Immutable<FileState>[]): Immutable<State> {
	logger.trace(`${LIB} on_exploration_done_merge_new_and_recovered_notes(…)`, { })

	const encountered_files: { [oldest_hash: string]: Immutable<FileNotes> } = { ...state.encountered_files }

	file_states.forEach(file_state => {
		let hash = get_hash(file_state)
		assert(hash, `on_exploration_done_merge_new_and_recovered_notes() file should be hashed: "${file_state.id}"`)

		hash = get_oldest_hash(state, hash)
		const old_notes = encountered_files[hash]
		const fresh_notes = file_state.notes

		if (!old_notes) {
			if (get_params().is_perfect_state) {
				assert(
					!is_normalized_media_basename(fresh_notes.original.basename),
					`PERFECT STATE new notes should never reference an already normalized original basename "${fresh_notes.original.basename}"! ${hash}`
				)
			}
			encountered_files[hash] = fresh_notes
		} else {
			// merge with oldest having priority = at the beginning
			encountered_files[hash] = merge_notes(old_notes, fresh_notes)
		}

		if (get_params().is_perfect_state) {
			const original_basename = encountered_files[hash].original.basename
			//console.error({ old_notes, fresh_notes, final_notes: encountered_files[hash] })

			assert(
				!is_normalized_media_basename(original_basename),
				`PERFECT STATE notes should never end up having an already normalized original basename "${original_basename}"!`
			)
		}
	})

	return {
		...state,
		encountered_files,
	}
}

export function on_file_notes_recovered(state: Immutable<State>, current_hash: FileHash): Immutable<State> {
	let encountered_files = {
		...state.encountered_files,
	}

	const oldest_hash = get_oldest_hash(state, current_hash)
	assert(encountered_files[oldest_hash], `on_file_notes_recovered() notes should exist`)
	delete encountered_files[oldest_hash] // clean to avoid redundancy, lives in the file state!
	assert(!encountered_files[oldest_hash], 'on_file_notes_recovered() delete')

	let hash = current_hash
	while (hash !== oldest_hash) {
		assert(!encountered_files[hash], 'on_file_notes_recovered() should not longer have notes')
		hash = state.known_modifications_new_to_old[hash]
	}

	return {
		...state,
		encountered_files,
	}
}

export function on_file_modified(state: Immutable<State>, previous_hash: string, current_hash: string): Immutable<State> {
	logger.trace(`${LIB} on_file_modified(…)`, { previous_hash, current_hash })

	throw new Error('NIMP')
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>): string {
	const { encountered_files, known_modifications_new_to_old } = state

	let str = ''
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

	return str
}

function notes_to_string(notes: Immutable<FileNotes>): string {
	let str = ''

	str += `CKA "${stylize_string.yellow.bold(notes.currently_known_as)}" HKA "${stylize_string.yellow.bold(
		[
			notes.original.parent_path,
			notes.original.basename,
		].filter(e => !!e).join('/')
	)}" 📅(fs)${get_human_readable_timestamp_auto(create_better_date_from_utc_tms(notes.original.birthtime_ms, 'tz:auto'), 'tz:embedded')}`

	return str
}
