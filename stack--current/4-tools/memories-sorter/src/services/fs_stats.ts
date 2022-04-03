import fs from 'fs'

import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

////////////////////////////////////

// TODO add size to detect collisions?
export type FsStatsSubset = Pick<fs.Stats, 'birthtimeMs' | 'atimeMs' | 'mtimeMs' | 'ctimeMs' /*| 'size'*/>
const KEYS: Array<keyof FsStatsSubset> = [ 'birthtimeMs', 'atimeMs', 'mtimeMs', 'ctimeMs'/*, 'size'*/ ]

////////////////////////////////////

// memory optimisation
export function get_relevant_fs_stats_subset(fs_stats: Immutable<fs.Stats>): FsStatsSubset {
	return KEYS.reduce((acc, key) => {
		acc[key] = fs_stats[key]
		return acc
	}, {} as any)
}

// TODO UT
export function get_most_reliable_birthtime_from_fs_stats(fs_stats_subset: Immutable<FsStatsSubset>): TimestampUTCMs {
	assert(fs_stats_subset, 'get_most_reliable_birthtime_from_fs_stats() fs stats ok ✔')
	//console.log(fs_stats_subset)

	// fs stats are unreliable for some reasons.
	const candidates: number[] = KEYS
		.map(key => {
			const raw_candidate = fs_stats_subset[key]
			assert(typeof raw_candidate === 'number', `get_most_reliable_birthtime_from_fs_stats "${ key }" should be a number: ${ raw_candidate }!`)

			const candidate: number = Math.round(raw_candidate) // bc seen float = sub millis
			assert(Number.isSafeInteger(candidate), `get_most_reliable_birthtime_from_fs_stats "${ key }" isSafeInteger(): ${ candidate }!`)
			return candidate
		})
		.filter(d => !!d)

	assert(candidates.length, `get_most_reliable_birthtime_from_fs_stats(): at least one correct tms should be present`)

	const lowest_ms = Math.min(...candidates)

	assert(Number.isSafeInteger(lowest_ms), `get_most_reliable_birthtime_from_fs_stats(): no correct tms found: ${lowest_ms}`)
	return lowest_ms
}
