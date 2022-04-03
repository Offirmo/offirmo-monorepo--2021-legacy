import { BaseState, WithLastUserInvestmentTimestamp } from '@offirmo-private/state-utils'

import { PersistedNotes as FileNotes } from '../file'

////////////////////////////////////

// DESIGN NOTE: the idea is to NOT have duplication of info
// However since we don't control the order of file discovery in the explore phase,
// there'll be a temporary redundancy which will be corrected in the consolidation phase
export interface State extends BaseState, WithLastUserInvestmentTimestamp {
	_comment: 'This data is from @offirmo/photo-sorter https://github.com/Offirmo/offirmo-monorepo/tree/master/5-incubator/active/photos-sorter'
	encountered_files: { [oldest_hash: string]: FileNotes }
	known_modifications_new_to_old: { [newer_hash: string]: string }
}
