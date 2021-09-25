import { BetterDate, DateRange, BetterDateMembers } from '../../../../services/better-date'

export type FsReliability = 'reliable' | 'unreliable' | 'unknown'

/* What do we need?
 * 1. Mainly, a file needs to know *whether it can trust its unreliable FS creation date*
 *   Corresponding hints are:
 *   - expected date range (roughly, if any) = would confirm the FS date
 *   - are other sibling files with higher primary bcd displaying a reliable FS date?
 * 2. as a junk, what bcd can we use if we really don't have any other better source?
 */
export interface NeighborHints {
	bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1: FsReliability
	//expected_bcd_range: undefined | DateRange // can be either an event (begin + X) or a backup (begin - X) depending on the hints
	//fallback_junk_bcd: undefined | BetterDate
}

/* An alternate version that'll be stored in the notes.
 * What do we need?
 */
export interface HistoricalNeighborHints {
	fs_reliability: FsReliability
	//expected_bcd_range: undefined | DateRange<BetterDateMembers>
	//fallback_bcd: undefined | BetterDateMembers
}