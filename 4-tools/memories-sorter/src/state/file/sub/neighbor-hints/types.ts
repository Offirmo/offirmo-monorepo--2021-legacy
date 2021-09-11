
export type FsReliability = 'reliable' | 'unreliable' | 'unknown'

export interface NeighborHints {
	bcd__from_fs__reliability__assessed_from_phase1: FsReliability
	// can be either an event (begin + X) or a backup (begin - X) depending on the hints
	// can serve both as a validation of fs or a source of BCD
	// TODO rework!
	/*	parent_folder_creation_date_range: null | {
			begin: BetterDate
			end: BetterDate
		}*/
}
