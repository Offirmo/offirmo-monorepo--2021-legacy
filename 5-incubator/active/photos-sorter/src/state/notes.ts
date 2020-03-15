import stable_stringify from 'json-stable-stringify'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'
const { cloneDeep } = require('lodash')

import { get_params } from '../params'
import logger from '../services/logger'
import { PersistedNotes as FileNotes, State as FileState } from './file'

export interface State {
	media_files: { [hash: string]: FileNotes }
	old_hashes_to_latest: { [hash: string]: string }
}

////////////////////////////////////

const LIB = '📃'

const PARAMS = get_params()

///////////////////// ACCESSORS /////////////////////

export function get_file_notes_from_hash(state: Readonly<State>, hash: string): null | Readonly<FileNotes> {
	if (state.media_files[hash])
		return state.media_files[hash]

	hash = state.old_hashes_to_latest[hash]
	return state.media_files[hash] || null
}

///////////////////// REDUCERS /////////////////////

export function create(): Readonly<State> {
	logger.trace(`[${LIB}] create(…)`, { })

	return {
		media_files: {},
		old_hashes_to_latest: {},
	}
}

export function on_previous_notes_found(state: Readonly<State>, old_state: Readonly<State>): Readonly<State> {
	logger.trace(`[${LIB}] on_notes_found(…)`, { })

	// todo reconcile the DBs

	throw new Error('NIMP')
}

// store infos for NEW files
export function on_exploration_done(state: Readonly<State>, media_file_states: Readonly<FileState>[]): Readonly<State> {
	logger.trace(`[${LIB}] on_notes_found(…)`, { })

	const media_files_notes: State['media_files'] = { ...state.media_files }

	media_file_states.forEach(media_file_state => {
		const { current_hash } = media_file_state
		assert(current_hash, 'file hashed')

		if (media_files_notes[current_hash])
			return

		if (state.old_hashes_to_latest[current_hash])
			return

		media_files_notes[current_hash] = cloneDeep(media_file_state.notes)
	})

	return {
		...state,
		media_files: media_files_notes,
	}
}

export function on_notes_taken(state: Readonly<State>, file_state: Readonly<FileState>): Readonly<State> {
	logger.trace(`[${LIB}] on_notes_taken(…)`, { })

	throw new Error('NIMP')
}


/*
export function on_file_hashed(state: Readonly<State>, hash: string, notes: FileNotes): Readonly<State> {
	logger.trace(`[${LIB}] on_file_hashed(…)`, { hash, notes })

	const existing_notes = get_file_notes_from_hash(state, hash)
	if (existing_notes) {
		assert(
			stable_stringify(existing_notes.original) === stable_stringify(notes.original),
			'matching originals'
		)
	}

	state = {
		...state,
		files: {
			...state.files,
			hash: {
				...existing_notes,
				...notes,
			},
		}
	}

	return state
}
*/

export function on_file_modified(state: Readonly<State>, previous_hash: string, current_hash: string): Readonly<State> {
	logger.trace(`[${LIB}] on_file_modified(…)`, { previous_hash, current_hash })

	throw new Error('NIMP')
}

///////////////////// DEBUG /////////////////////

export function to_string(state: Readonly<State>) {
	throw new Error('NIMP')
}
