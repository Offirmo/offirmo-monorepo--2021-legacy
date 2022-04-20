/////////////////////////////////////////////////
// Important concepts:
// - BCD = Best Creation Date
// - "oldest known" vs. "original"
//   What is contain in "original" may not be the original
//   Sometimes we explicitly want the original and will fail if not original.
// - FS reliability
//   We'd rather mis-sort than not sort, for manual sorting is harder than manual fixing
/////////////////////////////////////////////////

import { Tags as EXIFTags } from 'exiftool-vendored'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

import {
	Basename,
	RelativePath,
	SimpleYYYYMMDD,
} from '../../types'
import { FsStatsSubset } from '../../services/fs_stats'
import { FileHash } from '../../services/hash'

import { HistoricalNeighborHints, NeighborHints } from './sub/neighbor-hints/types'
import { BetterDateMembers } from '../../services/better-date'

/////////////////////////////////////////////////

export * from './sub/neighbor-hints/types'

// Data that we'll destroy/modify but is worth keeping
export interface HistoricalData {
	/////// Data that we'll likely destroy but is precious:
	// - in itself
	// - to recompute the date with stability on subsequent runs
	// - to recompute the date properly in case of a bug or an improvement of our algo

	// from path
	basename: Basename // can contain the date + we "clean" it, maybe with bugs
	parent_path: RelativePath // can contain the event description + useful to manually re-sort in multi-level folder cases

	// from fs
	// we should always store it in case it changes for some reason + we may overwrite it
	fs_bcd_tms: TimestampUTCMs

	// from neighbors
	neighbor_hints: HistoricalNeighborHints

	// from exif bc. we'll change it in the future
	exif_orientation?: number
	trailing_extra_bytes_cleaned?: number // TODO fix macOs bug
}

// notes contain infos that can't be preserved inside the file itself
// but that need to be preserved across invocations
export interface PersistedNotes {
	// backup
	historical: HistoricalData

	// user data
	deleted: undefined | boolean // TODO implement this feature TODO rename? TODO undefined?
	starred: undefined | boolean // TODO implement this feature TODO undefined?
	manual_date: undefined | SimpleYYYYMMDD | BetterDateMembers

	// for debug
	// NOTE it has to be properly re-set on change! TODO add auto checks?
	_currently_known_as: RelativePath // not strictly useful, intended at humans reading the notes manually
	_bcd_afawk‿symd: undefined | SimpleYYYYMMDD
	_bcd_source: undefined | string
}

// Id = path relative to root so far
export type FileId = RelativePath

export interface State {
	id: FileId

	// those fields need I/O to be completed, they start undefined
	current_fs_stats: undefined | FsStatsSubset // can't be null, is always a file
	current_hash: undefined | FileHash // can't be null, always a file
	current_exif_data: undefined | EXIFTags | null // can be null if no EXIF for this format
	current_neighbor_hints: undefined | NeighborHints

	are_notes_restored: boolean // needed to check if restoration happened
	notes: PersistedNotes
}
