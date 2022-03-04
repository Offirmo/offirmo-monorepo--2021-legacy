import { BetterDate, DateRange, BetterDateMembers } from '../../../../services/better-date'
import { TimeZone } from '../../../../types'

export type FsReliability = 'reliable' | 'unreliable' | 'unknown'

/* What do we need?
 * 1. Mainly, a file needs to know *whether it can trust its unreliable FS creation date*
 *   Corresponding hints are:
 *   - expected date range (roughly, if any) = would confirm the FS date
 *   - are other sibling files with higher primary bcd displaying a reliable FS date?
 * 2. as a junk, what bcd can we use if we really don't have any other better source?
 */
export interface NeighborHints {
	// if present (for unit tests), this prop will override any estimation of FS reliability
	_unit_test_shortcut?: FsReliability

	tz: undefined | TimeZone // folder tz aggregated from all children
	bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1: FsReliability
	expected_bcd_ranges: DateRange[] // can be either an event (begin + X) or a backup (begin - X) depending on the hints
	fallback_junk_bcd: undefined | BetterDate // should be a date that'll cause the file to be stable = stay in this folder
}

/* An alternate version that'll be stored in the notes.
 * We should store just what we need. For ex. if reliability = reliable, no need for parent bcd
 * Also due to migrations, all the fields can be missing (lost from previous versions)
 */
export interface HistoricalNeighborHints {
	fs_reliability?: FsReliability // should only be stored if !unknown and really from neighbors = not from self
	parent_bcd?: undefined | BetterDateMembers // should only be stored if not redundant with historical.parent_path
	// TODO store TZ?
}
