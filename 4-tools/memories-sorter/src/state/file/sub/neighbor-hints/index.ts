export * from './types'
export * from './selectors'

import { FsReliability, NeighborHints } from './types'

export function create(): NeighborHints {
	// safest possible
	return {
		bcdⵧfrom_fs__reliabilityⵧassessed_from_phase1: 'unknown',
	}
}

export function _createⵧfor_ut(reliability_shortcut?: FsReliability): NeighborHints {
	let state = create() // so far
	state._unit_test_shortcut = reliability_shortcut
	return state
}
