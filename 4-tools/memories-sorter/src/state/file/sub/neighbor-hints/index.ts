export * from './types'
export * from './selectors'

import { NeighborHints } from './types'

export function create(): NeighborHints {
	// safest possible
	return {
		bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1: 'unknown',
	}
}

export function _createⵧfor_ut(): NeighborHints {
	return create() // so far
}
