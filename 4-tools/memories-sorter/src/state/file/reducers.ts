import assert from 'tiny-invariant'
import { Tags as EXIFTags } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { get_params } from '../../params'
import logger from '../../services/logger'
import {
	FsStatsSubset,
	get_most_reliable_birthtime_from_fs_stats,
} from '../../services/fs_stats'
import { get_orientation_from_exif } from '../../services/exif'
import {
	get_file_basename_copy_index,
	get_file_basename_extension‿normalized,
	get_file_basename_without_copy_index,
	get_folder_relpath_normalisation_version,
	get_media_basename_normalisation_version,
	is_normalized_event_folder_relpath,
	is_processed_media_basename,
	pathㆍparse_memoized,
} from '../../services/name_parser'
import {
	get_timestamp_utc_ms_from,
} from '../../services/better-date'

import { LIB } from './consts'
import {
	FileId,
	State,
	NeighborHints,
	PersistedNotes,
} from './types'
import {
	is_exif_powered_media_file,
	get_current_extension‿normalized,
	get_current_basename,
	get_oldest_known_basename,
	get_ideal_basename,
	get_best_creation_date‿meta,
	get_current_parent_folder_id,
	get_best_creation_date,
	get_creation_dateⵧfrom_fsⵧcurrent‿tms,
} from './selectors'
import * as NeighborHintsLib from './sub/neighbor-hints'
import { get_fs_reliability_score } from './sub/neighbor-hints'

////////////////////////////////////

export function create(id: FileId): Immutable<State> {
	logger.trace(`${LIB} create(…)`, { id })

	const parsed_path = pathㆍparse_memoized(id)

	const state: State = {
		id,

		current_exif_data: undefined,
		current_fs_stats: undefined,
		current_hash: undefined,
		current_neighbor_hints: undefined,

		are_notes_restored: false,
		restored_notes_were_null: undefined,
		notes: {
			historical: {
				basename: parsed_path.base,
				parent_path: parsed_path.dir,

				fs_bcd_tms: get_UTC_timestamp_ms(), // so far
				neighbor_hints: NeighborHintsLib.get_historical_representation(NeighborHintsLib.create(), undefined),

				exif_orientation: undefined,
				trailing_extra_bytes_cleaned: undefined,
			},

			deleted: undefined,
			starred: undefined,
			manual_date: undefined,

			bcd_afawk‿symd: undefined,

			_currently_known_as: parsed_path.base,
			_bcd_source: undefined,
		},
	}

	if (!is_exif_powered_media_file(state as Immutable<State>))
		state.current_exif_data = null

	if (get_params().expect_perfect_state) {
		const current_basename = parsed_path.base
		assert(
			!is_processed_media_basename(current_basename),
			`PERFECT STATE current basename should never be an already processed basename "${current_basename}"!`
		)
	}

	return enforce_immutability(state)
}

// Those PRIMARY "on_info_read..." happens first and have no inter-dependencies

export function on_info_read__fs_stats(state: Immutable<State>, fs_stats_subset: Immutable<FsStatsSubset>): Immutable<State> {
	logger.trace(`${LIB} on_info_read__fs_stats(…)`, { })

	assert(fs_stats_subset, `on_info_read__fs_stats() params`)
	assert(state.current_fs_stats === undefined, `on_info_read__fs_stats() should not be called several times`)
	assert(!state.are_notes_restored, `on_info_read__fs_stats() notes should not be restored yet`)

	// TODO add to a log for bad fs stats

	state = {
		...state,
		current_fs_stats: fs_stats_subset,
		notes: {
			...state.notes,
			historical: {
				// as far as we know we are dealing with the original
				...state.notes.historical,
				fs_bcd_tms: get_most_reliable_birthtime_from_fs_stats(fs_stats_subset),
			}
		}
	}

	return state
}

export function on_info_read__exif(state: Immutable<State>, exif_data: Immutable<EXIFTags>): Immutable<State> {
	logger.trace(`${LIB} on_info_read__exif(…)`, { })

	assert(is_exif_powered_media_file(state), `on_info_read__exif() should expect EXIF`)
	assert(exif_data, 'on_info_read__exif() params')
	assert(state.current_exif_data === undefined, `on_info_read__exif() should not be called several times`)
	assert(!state.are_notes_restored, `on_info_read__exif() notes should not be restored yet`)

	if (exif_data && exif_data.errors && exif_data.errors.length) {
		logger.error(`Error reading exif data for "${state.id}"!`, { errors: exif_data.errors })
		// XXX TODO mark file as "in error" to not be renamed / processed
		return {
			...state,
			current_exif_data: null,
		}
	}

	// TODO memory optim cherry pick useful fields only

	state = {
		...state,
		current_exif_data: exif_data,
		notes: {
			...state.notes,
			historical: {
				// as far as we know we are dealing with the original
				...state.notes.historical,
				exif_orientation: get_orientation_from_exif(exif_data),
			}
		}
	}

	return state
}

export function on_info_read__hash(state: Immutable<State>, hash: string): Immutable<State> {
	logger.trace(`${LIB} on_info_read__hash(…)`, { })

	assert(hash, 'on_info_read__hash() ok')
	assert(state.current_hash === undefined, `on_info_read__hash() should not be called several times`)

	state = {
		...state,
		current_hash: hash,
	}

	return state
}

// this extra SECONDARY "on_info_read..." happens on consolidation, requires ALL files to have all the PRIMARY loaded
export function on_info_read__current_neighbors_primary_hints(
	state: Immutable<State>,
	neighbor_hints: Immutable<NeighborHints>,
	PARAMS = get_params(),
): Immutable<State> {
	logger.trace(`${LIB} on_info_read__current_neighbors_primary_hints(…)`, {
		id: state.id,
		neighbor_hints: NeighborHintsLib.to_string(neighbor_hints),
	})

	assert(!state.current_neighbor_hints, `on_info_read__current_neighbors_primary_hints() should not be called several times ${state.id}`)
	assert(!state.are_notes_restored, `on_info_read__current_neighbors_primary_hints() should be called BEFORE notes restoration ${state.id}`)

	state = {
		...state,
		current_neighbor_hints: neighbor_hints,
		notes: {
			...state.notes,
			historical: {
				...state.notes.historical,
				neighbor_hints: NeighborHintsLib.get_historical_representation(neighbor_hints, get_creation_dateⵧfrom_fsⵧcurrent‿tms(state)),
			},
		},
	}

	//console.log('on_info_read__current_neighbors_primary_hints', neighbor_hints, state.notes.historical.neighbor_hints)

	return state
}

// happens AFTER ALL on_info_read...
export function on_notes_recovered(state: Immutable<State>, recovered_notes: null | Immutable<PersistedNotes>): Immutable<State> {
	logger.trace(`${LIB} on_notes_recovered(…)`, { id: state.id, recovered_notes })

	if (state.are_notes_restored) {
		// FOR DEBUG
		// seen in very rare cases
		// - manual copy/paste for test where a media and a non-media file have the same hash
		// - strange case = collision???
		console.error('??? PENDING ERROR BELOW', state)
	}
	assert(!state.are_notes_restored, `on_notes_recovered() should not be called several times`)

	assert(state.current_hash, 'on_notes_recovered() should be called based on the hash') // obvious but just in case…
	assert(state.current_exif_data !== undefined, 'on_notes_recovered() should be called after exif') // obvious but just in case…
	assert(state.current_fs_stats, 'on_notes_recovered() should be called after FS') // obvious but just in case…

	// TODO track whether we are the original? hard to know later
	if (recovered_notes) {
		const current_ext‿norm = get_current_extension‿normalized(state)
		const original_ext‿norm = get_file_basename_extension‿normalized(recovered_notes.historical.basename)
		assert(current_ext‿norm === original_ext‿norm, `recovered notes should refer to the same file type! "${current_ext‿norm}" vs. "${original_ext‿norm}`)
	}

	state = {
		...state,
		are_notes_restored: true,
		restored_notes_were_null: recovered_notes === null,
		notes: {
			...state.notes,
			...recovered_notes,
			_currently_known_as: get_current_basename(state), // force keep this one
			historical: {
				...state.notes.historical,
				...recovered_notes?.historical,
			},
		},
	}

	if (get_params().expect_perfect_state) {
		assert(
			!is_processed_media_basename(get_oldest_known_basename(state)),
			`PERFECT STATE original basename should never be an already processed basename "${get_oldest_known_basename(state)}"!`
		)
	}

	return state
}

export function on_moved(state: Immutable<State>, new_id: FileId): Immutable<State> {
	logger.trace(`${LIB} on_moved(…)`, { previous_id: state.id, new_id })
	assert(new_id !== state.id, `on_moved() should be a real move`)

	const previous_basename = get_current_basename(state)
	const ideal_basename = get_ideal_basename(state)
	const meta = get_best_creation_date‿meta(state)

	state =  {
		...state,
		id: new_id,
	}

	const new_basename = get_current_basename(state)
	state = {
		...state,
		notes: {
			...state.notes,
			_currently_known_as: new_basename,
		}
	}

	if (new_basename !== previous_basename) {
		const new_basename_without_copy_index = get_file_basename_without_copy_index(new_basename)
		if(new_basename_without_copy_index !== ideal_basename) {
			// can that happen?
			assert(new_basename_without_copy_index === ideal_basename, `file renaming should only be a normalization! ~"${new_basename_without_copy_index}"`)
		}
		else {
			state = {
				...state,
				notes: {
					...state.notes,
					_bcd_source: meta.source,
				}
			}
		}
	}

	return state
}

///////////////////// SPECIAL /////////////////////

// all those states represent the same file anyway!
// return the "best" one to keep, merged with extra infos
// assumption is that other copies will be cleaned.
// The "best" one is thus the MORE already sorted, assuming others are re-appearance of old backups
export function merge_duplicates(...states: Immutable<State[]>): Immutable<State> {
	logger.trace(`${LIB} merge_duplicates(…)`, { ids: states.map(s => s.id) })
	assert(states.length > 1, 'merge_duplicates(…) params')

	states.forEach((duplicate_state, index) => {
		try {
			assert(duplicate_state.current_hash, 'merge_duplicates(…) should happen after hash computed')
			assert(duplicate_state.current_hash === states[0].current_hash, 'merge_duplicates(…) should have the same hash')
			assert(duplicate_state.current_fs_stats, 'merge_duplicates(…) should happen after fs stats read')
			assert(duplicate_state.are_notes_restored, 'merge_duplicates(…) should happen after notes are restored (if any)')
		}
		catch (err) {
			logger.error('merge_duplicates(…) initial assertion failed', {
				err,
				state: states[index],
			})
			throw err
		}
	})

	const reasons = new Set<string>()
	let selected_state = states[0] // so far
	//let min_fs_bcd_tms = get_most_reliable_birthtime_from_fs_stats(selected_state.current_fs_stats!) // so far
	states.forEach(candidate_state => {
		if (candidate_state === selected_state) return

		// equal so far, try to discriminate with a criteria
		const selected__has_normalized_basename = get_file_basename_without_copy_index(get_current_basename(selected_state)) === get_ideal_basename(selected_state)
		const candidate__has_normalized_basename = get_file_basename_without_copy_index(get_current_basename(candidate_state)) === get_ideal_basename(candidate_state)
		if (selected__has_normalized_basename !== candidate__has_normalized_basename) {
			reasons.add('normalized_basename')

			if (selected__has_normalized_basename)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		const selected__has_normalized_parent_folder = is_normalized_event_folder_relpath(get_current_parent_folder_id(selected_state))
		const candidate__has_normalized_parent_folder = is_normalized_event_folder_relpath(get_current_parent_folder_id(candidate_state))
		if (selected__has_normalized_parent_folder !== candidate__has_normalized_parent_folder) {
			// we try to keep the already normalized one
			reasons.add('normalized_parent_folder')

			if (selected__has_normalized_parent_folder)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		let selected__current_copy_index = get_file_basename_copy_index(get_current_basename(selected_state))
		let candidate__current_copy_index = get_file_basename_copy_index(get_current_basename(candidate_state))
		if (selected__current_copy_index !== candidate__current_copy_index) {
			reasons.add('copy_index')

			if (selected__current_copy_index === undefined)
				return // current is better

			if (candidate__current_copy_index !== undefined && selected__current_copy_index < candidate__current_copy_index)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		const selected__best_creation_date_tms = get_timestamp_utc_ms_from(get_best_creation_date(selected_state))
		const candidate__best_creation_date_tms = get_timestamp_utc_ms_from(get_best_creation_date(candidate_state))
		if (selected__best_creation_date_tms !== candidate__best_creation_date_tms) {
			reasons.add('best_creation_date')
			//console.log('different best_creation_date', selected__best_creation_date_tms, candidate__best_creation_date_tms)
			// earliest file wins

			if (selected__best_creation_date_tms <= candidate__best_creation_date_tms)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		const selected__current_fs_creation_date_tms = get_creation_dateⵧfrom_fsⵧcurrent‿tms(selected_state)
		const candidate__current_fs_creation_date_tms = get_creation_dateⵧfrom_fsⵧcurrent‿tms(candidate_state)
		if (selected__current_fs_creation_date_tms !== candidate__current_fs_creation_date_tms) {
			reasons.add('current_fs_creation_date')
			//console.log('different best_creation_date', selected__best_creation_date_tms, candidate__best_creation_date_tms)
			// earliest file wins

			if (selected__current_fs_creation_date_tms <= candidate__current_fs_creation_date_tms)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		if (get_current_basename(selected_state).length !== get_current_basename(candidate_state).length) {
			reasons.add('current_basename.length')

			// shorter name wins!
			if (get_current_basename(selected_state).length < get_current_basename(candidate_state).length)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal so far, try to discriminate with another criteria
		if (selected_state.id.length !== candidate_state.id.length) {
			reasons.add('current_id.length')

			// shorter name wins!
			if (selected_state.id.length < candidate_state.id.length)
				return // current is better

			selected_state = candidate_state
			return
		}

		// still equal
		// no more criteria, 1st encountered wins
		reasons.add('order')
	})

	logger.log('de-duplicated file states:', {
		count: states.length,
		final_basename: selected_state.id,
		criterias: [...reasons]
	})

	selected_state = {
		...selected_state,
		notes: {
			// merge notes separately.
			// Even if we discard duplicates, they may still hold precious original info
			...merge_notes(...states.map(s => s.notes)),
			// update
			_currently_known_as: get_current_basename(selected_state),
		},
	}

	return selected_state
}

// merge notes concerning the same file (by hash). Could be:
// - duplicated notes
// - duplicated files
// - persisted vs. reconstructed notes
// the earliest best choice will take precedence
// NOTE that this function works in an opposite way than merge_duplicates,
//      it will try to preserve the LESS sorted data = the oldest
// https://stackoverflow.com/a/56650790/587407
const _get_defined_props = (obj: any) =>
	Object.fromEntries(
		Object.entries(obj)
			.filter(([k, v]) => v !== undefined)
	)
export function merge_notes(...notes: Immutable<PersistedNotes[]>): Immutable<PersistedNotes> {
	logger.trace(`${LIB} merge_notes(…)`, { ids: notes.map(n => n.historical.basename) })
	assert(notes.length > 1, 'merge_notes(…) should be given several notes to merge')

	let merged_notes = notes[0]
	assert(merged_notes, 'merge_notes(…) selected a starting point')

	logger.silly('merge_notes() notes so far', merged_notes)
	notes.forEach(note => {
		const {
			deleted,
			starred,
			manual_date,
			historical: {
				basename,
				parent_path,
				fs_bcd_tms,
				neighbor_hints: {
					fs_reliability,
					parent_bcd,
					...unknown_historical_neighbor_hints
				},
				exif_orientation,
				trailing_extra_bytes_cleaned,
				...unknown_historical
			},
			// debug
			bcd_afawk‿symd,
			_currently_known_as,
			_bcd_source,
			// safety
			...unknown
		} = note

		if (Object.keys(unknown).length > 0)
			throw new Error(`merge_notes() unknown attributes! "${Object.keys(unknown).join(',')}"`)
		if (Object.keys(unknown_historical).length > 0)
			throw new Error(`merge_notes() unknown historical attributes! "${Object.keys(unknown_historical).join(',')}"`)
		if (Object.keys(unknown_historical_neighbor_hints).length > 0)
			throw new Error(`merge_notes() unknown historical neighbor_hints attributes! "${Object.keys(unknown_historical_neighbor_hints).join(',')}"`)

		if (deleted !== undefined) {
			let target = deleted
			if (merged_notes.deleted !== undefined && merged_notes.deleted !== target) {
				// conflict
				// since "true" is the default, "false" is the highest intent = wins
				target = false
			}
			if (merged_notes.deleted !== target) {
				merged_notes = {
					...merged_notes,
					deleted: target,
				}
			}
		}
		if (starred !== undefined) {
			let target = starred
			if (merged_notes.starred !== undefined && merged_notes.starred !== target) {
				// conflict
				// since "false" is the default, "true" is the highest intent = wins
				target = true
			}
			if (merged_notes.starred !== target) {
				merged_notes = {
					...merged_notes,
					starred: target,
				}
			}
		}
		if (manual_date !== undefined) {
			throw new Error(`merge_notes() NIMP manual_date!`)
		}

		if (bcd_afawk‿symd !== undefined) {
			throw new Error(`merge_notes() NIMP bcd_afawk‿symd!`)
		}

		// debug data can be ignored, it'll be automatically updated

		/////// historical

		if (exif_orientation !== merged_notes.historical.exif_orientation) {
			throw new Error(`merge_notes() unexpected exif_orientation difference!`)
		}
		if (trailing_extra_bytes_cleaned !== undefined) {
			throw new Error(`merge_notes() NIMP trailing_extra_bytes_cleaned!`)
		}

		// remaining data go together

		// fs
		let oldest_most_reliable_fs: 'current' | 'candidate' = (() => {

			if (fs_reliability !== merged_notes.historical.neighbor_hints.fs_reliability) {
				const rsa = get_fs_reliability_score(merged_notes.historical.neighbor_hints.fs_reliability)
				const rsb = get_fs_reliability_score(fs_reliability)

				if (rsa !== rsb) {
					return rsa >= rsb ? 'current' : 'candidate'
				}
			}

			// birthtimes tend to be botched to a *later* date by the FS (ex. git pull or unzip)
			if (fs_bcd_tms !== fs_bcd_tms)
				return fs_bcd_tms <= fs_bcd_tms ? 'current' : 'candidate'

			if (parent_bcd !== merged_notes.historical.neighbor_hints.parent_bcd) {

			}

			return 'current'
		})()
		if (oldest_most_reliable_fs === 'current') {
			// no change
		}
		else {
			merged_notes = {
				...merged_notes,
				historical: {
					...merged_notes.historical,
					fs_bcd_tms,
					neighbor_hints: {
						...merged_notes.historical.neighbor_hints,
						fs_reliability,
					},
				},
			}
		}

		// basename + parent_path
		let oldest_path: 'current' | 'candidate' = (() => {

			if (basename !== merged_notes.historical.basename) {
				const nva = get_media_basename_normalisation_version(merged_notes.historical.basename)
				const nvb = get_media_basename_normalisation_version(basename)

				if (nva !== nvb) {
					if (nva === undefined) {
						return 'current'
					}
					else if (nvb === undefined) {
						return 'candidate'
					}
					else if (nva <= nvb) {
						return 'current'
					}
					else {
						return 'candidate'
					}
				}

				return merged_notes.historical.basename.length <= basename.length ? 'current' : 'candidate'
			}

			if (parent_path !== merged_notes.historical.parent_path) {
				const nva = get_folder_relpath_normalisation_version(merged_notes.historical.parent_path)
				const nvb = get_folder_relpath_normalisation_version(parent_path)

				if (nva !== nvb) {
					if (nva === undefined) {
						return 'current'
					}
					else if (nvb === undefined) {
						return 'candidate'
					}
					else if (nva <= nvb) {
						return 'current'
					}
					else {
						return 'candidate'
					}
				}

				return merged_notes.historical.parent_path.length <= parent_path.length ? 'current' : 'candidate'
			}

			return oldest_most_reliable_fs
		})()
		if (oldest_path === 'current') {
			// no change
		}
		else {
			merged_notes = {
				...merged_notes,
				historical: {
					...merged_notes.historical,
					basename,
					parent_path,
				},
			}
		}


		logger.silly('merge_notes() notes so far', merged_notes)
	})

	// cleanups
	if (merged_notes.historical.neighbor_hints.fs_reliability === 'unknown') {
		// no value, clean it
		const { fs_reliability, ...rest } = merged_notes.historical.neighbor_hints
		merged_notes = {
			...merged_notes,
			historical: {
				...merged_notes.historical,
				neighbor_hints: {
					...rest,
				},
			},
		}
	}


	if (is_processed_media_basename(merged_notes.historical.basename)) {
		logger.warn(`merge_notes(): ?? final historical basename "${merged_notes.historical.basename}" is already processed`)
	}

	return merged_notes
}
