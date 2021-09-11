import { Immutable } from '@offirmo-private/ts-types'

import { NeighborHints } from './types'
import { get_debug_representation as get_better_date_debug_representation } from '../../../../services/better-date'

export function get_debug_representation(state: Immutable<NeighborHints>): any {
	return {
		//parent_folder_bcd: get_better_date_debug_representation(neighbor_hints.parent_folder_bcd),
		fs_bcd_assessed_reliability: state.fs_bcd_assessed_reliability,
	}
}
