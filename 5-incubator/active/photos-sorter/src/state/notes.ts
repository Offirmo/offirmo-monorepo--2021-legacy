import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { BaseState, WithLastUserActionTimestamp } from '@offirmo-private/state-utils'

import logger from '../services/logger'
import {
	PersistedNotes as FileNotes,
	State as FileState,
	get_hash,
	merge_notes,
} from './file'
import { FileHash } from '../services/hash'
import { is_already_normalized } from '../services/name_parser'
import { get_params } from '../params'


////////////////////////////////////
// TODO rewrite. Currently info is duplicated across files and here

const LIB = '📃'
const SCHEMA_VERSION = 1

export interface State extends BaseState, WithLastUserActionTimestamp {
	_comment: string
	encountered_media_files: { [oldest_hash: string]: FileNotes }
	known_modifications_new_to_old: { [newer_hash: string]: string }
}

///////////////////// ACCESSORS /////////////////////

export function get_oldest_hash(state: Immutable<State>, hash: FileHash): FileHash {
	assert(hash, `get_oldest_hash() param`)

	let has_redirect = false
	while (state.known_modifications_new_to_old[hash]) {
		has_redirect = true
		assert(!state.encountered_media_files[hash], 'get_oldest_hash() newer hash should not have notes')
		hash = state.known_modifications_new_to_old[hash]
	}

	if (has_redirect) {
		assert(state.encountered_media_files[hash], 'get_oldest_hash() known hash should have notes')
	}

	return hash
}

export function get_file_notes_for_hash(state: Immutable<State>, hash: FileHash): null | Immutable<FileNotes> {
	hash = get_oldest_hash(state, hash)

	return state.encountered_media_files[hash] || null
}

///////////////////// REDUCERS /////////////////////

export function create(): Immutable<State> {
	logger.trace(`[${LIB}] create(…)`, { })

	return {
		_comment: "This data is from @offirmo/photo-sorter https://github.com/Offirmo/offirmo-monorepo/tree/master/5-incubator/active/photos-sorter",

		schema_version: SCHEMA_VERSION,
		revision: 0,
		last_user_action_tms: get_UTC_timestamp_ms(),

		encountered_media_files: {},
		known_modifications_new_to_old: {},
	}
}

export function on_previous_notes_found(state: Immutable<State>, old_state: Immutable<State>): Immutable<State> {
	logger.trace(`[${LIB}] on_previous_notes_found(…)`, { })

	// TODO migration

	const { encountered_media_files: encountered_media_files_a } = state
	const { encountered_media_files: encountered_media_files_b } = old_state
	const encountered_media_files: State['encountered_media_files'] = {}
	state = {
		...state,
		encountered_media_files,
		known_modifications_new_to_old: {
			// easy merge
			...state.known_modifications_new_to_old,
			...old_state.known_modifications_new_to_old,
		},
	}

	const encountered_media_files_hashes = new Set<FileHash>([
		...Object.keys(encountered_media_files_a),
		...Object.keys(encountered_media_files_b),
	])

	encountered_media_files_hashes.forEach(hash => {
		const notes: Array<Immutable<FileNotes> | undefined> = []

		notes.push(encountered_media_files_a[hash])
		notes.push(encountered_media_files_b[hash])
		while (state.known_modifications_new_to_old[hash]) {
			hash = state.known_modifications_new_to_old[hash]
			notes.push(encountered_media_files_a[hash])
			notes.push(encountered_media_files_b[hash])
		}

		const final_note = merge_notes(...notes.filter(n => !!n) as Array<Immutable<FileNotes>>)
		encountered_media_files[hash] = final_note
	})

	return state
}

export function on_exploration_done_merge_new_and_recovered_notes(state: Immutable<State>, media_file_states: Immutable<FileState>[]): Immutable<State> {
	logger.trace(`[${LIB}] on_exploration_done_store_new_notes(…)`, { })

	const encountered_media_files: State['encountered_media_files'] = { ...state.encountered_media_files }

	media_file_states.forEach(media_file_state => {
		let hash = get_hash(media_file_state)
		assert(hash, 'file hashed')

		hash = get_oldest_hash(state, hash)
		const old_notes = encountered_media_files[hash]
		const fresh_notes = media_file_state.notes

		if (!old_notes) {
			if (get_params().is_perfect_state) {
				assert(
					!is_already_normalized(fresh_notes.original.basename),
					`PERFECT STATE new notes should never reference an already normalized original basename "${fresh_notes.original.basename}"! ${hash}`
				)
			}
			encountered_media_files[hash] = fresh_notes
		} else {
			// merge with oldest having priority = at the end
			encountered_media_files[hash] = merge_notes(fresh_notes, old_notes)
		}

		if (get_params().is_perfect_state) {
			const original_basename = encountered_media_files[hash].original.basename
			console.error({ old_notes, fresh_notes, final_notes: encountered_media_files[hash] })

			assert(
				!is_already_normalized(original_basename),
				`PERFECT STATE notes should never end up having an already normalized original basename "${original_basename}"!`
			)
		}
	})

	return {
		...state,
		encountered_media_files,
	}
}

export function on_media_file_notes_recovered(state: Immutable<State>, current_hash: FileHash): Immutable<State> {
	//console.log('on_media_file_notes_recovered', current_hash)
	let encountered_media_files = {
		...state.encountered_media_files,
	}

	const oldest_hash = get_oldest_hash(state, current_hash)
	assert(encountered_media_files[oldest_hash], `on_media_file_notes_recovered() notes should exist`)
	delete encountered_media_files[oldest_hash] // clean to avoid redundancy, lives in the file state!
	assert(!encountered_media_files[oldest_hash], 'on_media_file_notes_recovered() delete')

	let hash = current_hash
	while (hash !== oldest_hash) {
		assert(!encountered_media_files[hash], 'on_media_file_notes_recovered() should not longer have notes')
		hash = state.known_modifications_new_to_old[hash]
	}

	return {
		...state,
		encountered_media_files,
	}
}

export function on_file_modified(state: Immutable<State>, previous_hash: string, current_hash: string): Immutable<State> {
	logger.trace(`[${LIB}] on_file_modified(…)`, { previous_hash, current_hash })

	throw new Error('NIMP')
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Immutable<State>) {
	const { encountered_media_files, known_modifications_new_to_old } = state

	let str = ''
	const processed = new Set<string>()

	const oldest_hashes: string[] = Object.keys(encountered_media_files)

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

		const notes = encountered_media_files[hash]
		str += `\n📄 notes: ${hash} = "${notes.original.basename}"`

		//str += '\n    TODO old hashes'
	})

	return str
}
