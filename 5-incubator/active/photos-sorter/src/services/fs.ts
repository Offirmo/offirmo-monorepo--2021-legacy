import fs from 'fs'

import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'


export function get_most_reliable_birthtime_from_fs_stats(fs_stats: Immutable<fs.Stats>): TimestampUTCMs {
	assert(fs_stats, 'fs stats ok ✔')

	// fs stats are unreliable for some reasons.
	const { birthtimeMs, atimeMs, mtimeMs, ctimeMs } = fs_stats!
	const lowest_ms = Math.min(
		...[birthtimeMs, atimeMs, mtimeMs, ctimeMs].filter(d => !!d)
	)

	return lowest_ms
}
