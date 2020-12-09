import stable_stringify from 'json-stable-stringify'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
const { cloneDeep } = require('lodash')
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


////////////////////////////////////

const LIB = '📃'
const SCHEMA_VERSION = 1

export interface State extends BaseState, WithLastUserActionTimestamp {
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

export function get_file_notes_from_hash(state: Immutable<State>, hash: FileHash): null | Immutable<FileNotes> {
	hash = get_oldest_hash(state, hash)

	return state.encountered_media_files[hash] || null
}

///////////////////// REDUCERS /////////////////////

export function create(): Immutable<State> {
	logger.trace(`[${LIB}] create(…)`, { })

	return {
		schema_version: SCHEMA_VERSION,
		revision: 0,
		last_user_action_tms: get_UTC_timestamp_ms(),

		encountered_media_files: {},
		known_modifications_new_to_old: {},
	}
}

// TODO
export function on_previous_notes_found(state: Immutable<State>, old_state: Immutable<State>): Immutable<State> {
	logger.trace(`[${LIB}] on_previous_notes_found(…)`, { })

	// TODO reconcile the DBs

	throw new Error('NIMP')
}

// store infos for NEW files
export function on_exploration_done_merge_notes(state: Immutable<State>, media_file_states: Immutable<FileState>[]): Immutable<State> {
	logger.trace(`[${LIB}] on_exploration_done_store_new_notes(…)`, { })

	const encountered_media_files: State['encountered_media_files'] = { ...state.encountered_media_files }

	media_file_states.forEach(media_file_state => {
		let hash = get_hash(media_file_state)
		assert(hash, 'file hashed')

		hash = get_oldest_hash(state, hash)

		if (!encountered_media_files[hash]) {
			encountered_media_files[hash] = media_file_state.notes
		} else {
			encountered_media_files[hash] = merge_notes(media_file_state.notes, encountered_media_files[hash])
		}
	})

	return {
		...state,
		encountered_media_files,
	}
}

export function on_notes_taken(state: Immutable<State>, file_state: Immutable<FileState>): Immutable<State> {
	logger.trace(`[${LIB}] on_notes_taken(…)`, { })

	throw new Error('NIMP')
}

// TODO store and restore notes!


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

	const known_modifications_old_to_new = Object.entries(known_modifications_new_to_old)
			.reduce((acc, [n, o]) => {
				acc[o] ??= []
				acc[o].push(n)

				return acc
			}, {} as { [old: string]: string[] })

	/*const newest_hashes: string[] = Object.keys(known_modifications_new_to_old)
	const target_hashes: string[] = Object.values(known_modifications_new_to_old)*/

	oldest_hashes.forEach(hash => {
		processed.add(hash)

		const notes = encountered_media_files[hash]
		str += `\n📄 notes: ${hash} = "${notes.original.basename}"`

		//str += '\n    TODO old hashes'
	})

	return str
}
